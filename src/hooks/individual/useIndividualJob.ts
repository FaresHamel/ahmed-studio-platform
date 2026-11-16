"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

import { individualService } from "@/services/individual.service";
import { useAuthStore } from "@/store/auth.store";
import type { IndividualJobDetails } from "@/types/production-api";

export function individualError(
    error: unknown,
    fallback = "The request failed. Please try again."
): string {
    if (axios.isAxiosError<{ message?: string | string[] }>(error)) {
        const message = error.response?.data?.message;

        if (Array.isArray(message)) {
            return message.join(" ");
        }

        if (typeof message === "string" && message.trim()) {
            return message;
        }
    }

    return fallback;
}

interface JobState {
    key: string;
    job?: IndividualJobDetails;
    error?: string;
    fetching: boolean;
}

export function useIndividualJob(jobId: string) {
    const accountId = useAuthStore((state) => state.user?.id);
    const initialized = useAuthStore((state) => state.isInitialized);

    const isAdmin = useAuthStore((state) =>
        Boolean(state.user?.roles.includes("admin"))
    );

    const canLoad =
        initialized && isAdmin && Boolean(accountId) && Boolean(jobId);

    const key = JSON.stringify([jobId, accountId]);

    const [state, setState] = useState<JobState | null>(null);

    const controllerRef = useRef<AbortController | null>(null);
    const requestRef = useRef(0);

    const refresh = useCallback(async (): Promise<void> => {
        const auth = useAuthStore.getState();

        if (
            !canLoad ||
            !auth.isInitialized ||
            auth.user?.id !== accountId ||
            !auth.user?.roles.includes("admin")
        ) {
            throw new Error("Individual job access is unavailable.");
        }

        controllerRef.current?.abort();

        const controller = new AbortController();
        const requestId = ++requestRef.current;

        controllerRef.current = controller;

        function isCurrentRequest(): boolean {
            const currentAuth = useAuthStore.getState();

            return (
                !controller.signal.aborted &&
                requestRef.current === requestId &&
                currentAuth.isInitialized &&
                currentAuth.user?.id === accountId &&
                Boolean(currentAuth.user?.roles.includes("admin"))
            );
        }

        setState((previous) => ({
            key,
            job: previous?.key === key ? previous.job : undefined,
            error: undefined,
            fetching: true
        }));

        try {
            const job = await individualService.getJob(
                jobId,
                controller.signal
            );

            if (!isCurrentRequest()) {
                throw new DOMException(
                    "The Individual job request was superseded.",
                    "AbortError"
                );
            }

            setState({
                key,
                job,
                error: undefined,
                fetching: false
            });
        } catch (failure) {
            if (isCurrentRequest()) {
                setState((previous) => ({
                    key,
                    job: previous?.key === key ? previous.job : undefined,
                    error: individualError(
                        failure,
                        "Could not load the Individual job."
                    ),
                    fetching: false
                }));
            }

            throw failure;
        }
    }, [accountId, canLoad, jobId, key]);

    useEffect(() => {
        if (!canLoad) return;

        void refresh().catch(() => {
            // Current request errors are exposed through state.
        });

        return () => {
            controllerRef.current?.abort();
            requestRef.current++;
        };
    }, [canLoad, refresh]);

    const current =
        canLoad && state?.key === key ? state : null;

    return {
        job: current?.job,
        error: current?.error,
        canLoad,
        loading: canLoad && (!current || (!current.job && current.fetching)),
        refreshing: Boolean(current?.job && current.fetching),
        refresh
    };
}