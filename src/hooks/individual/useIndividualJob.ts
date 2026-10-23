"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { individualService } from "@/services/individual.service";
import { useAuthStore } from "@/store/auth.store";
import type { IndividualJobDetails } from "@/types/production-api";

export function individualError(
    error: unknown,
    fallback = "The request failed. Please try again.",
): string {
    if (axios.isAxiosError<{ message?: string | string[] }>(error)) {
        const message = error.response?.data?.message;

        if (Array.isArray(message)) return message.join(" ");
        if (typeof message === "string") return message;
    }

    return fallback;
}

export function useIndividualJob(jobId: string) {
    const user = useAuthStore(state => state.user);
    const initialized = useAuthStore(state => state.isInitialized);

    const canLoad =
        initialized && !!user?.roles.includes("admin");

    const [revision, setRevision] = useState(0);

    const [result, setResult] = useState<{
        key: string;
        job?: IndividualJobDetails;
        error?: string;
    } | null>(null);

    const key = JSON.stringify([jobId, user?.id, revision]);

    useEffect(() => {
        if (!canLoad) return;

        const controller = new AbortController();

        async function load() {
            try {
                const job = await individualService.getJob(
                    jobId,
                    controller.signal,
                );

                if (!controller.signal.aborted) {
                    setResult({ key, job });
                }
            } catch (failure) {
                if (!controller.signal.aborted) {
                    setResult({
                        key,
                        error: individualError(
                            failure,
                            "Could not load the Individual job.",
                        ),
                    });
                }
            }
        }

        void load();

        return () => controller.abort();
    }, [canLoad, jobId, key]);

    const current =
        canLoad && result?.key === key ? result : null;

    return {
        job: current?.job,
        loading: canLoad && !current,
        error: current?.error,

        refresh() {
            setRevision(value => value + 1);
        },
    };
}