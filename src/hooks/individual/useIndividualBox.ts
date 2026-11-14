"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";

import { individualService } from "@/services/individual.service";
import { useAuthStore } from "@/store/auth.store";
import { individualError } from "./useIndividualJob";
import type { IndividualBoxDetails } from "@/types/production-api";

interface BoxState {
    key: string;
    box?: IndividualBoxDetails;
    error?: string;
    fetching: boolean;
}

export function useIndividualBox(boxId: string) {
    const accountId = useAuthStore((state) => state.user?.id);
    const initialized = useAuthStore((state) => state.isInitialized);

    const isAdmin = useAuthStore((state) =>
        Boolean(state.user?.roles.includes("admin"))
    );

    const canLoad = initialized && isAdmin && Boolean(boxId);

    const key = JSON.stringify([boxId, accountId]);

    const [state, setState] = useState<BoxState | null>(null);

    const controllerRef = useRef<AbortController | null>(null);
    const requestRef = useRef(0);

    const refresh = useCallback(async (): Promise<void> => {
        if (!canLoad) {
            throw new Error("Box access is unavailable.");
        }

        controllerRef.current?.abort();

        const controller = new AbortController();
        const requestId = ++requestRef.current;

        controllerRef.current = controller;

        function isCurrentRequest() {
            const auth = useAuthStore.getState();

            return (
                !controller.signal.aborted &&
                requestRef.current === requestId &&
                auth.isInitialized &&
                auth.user?.id === accountId &&
                Boolean(auth.user?.roles.includes("admin"))
            );
        }

        setState((previous) => ({
            key,
            box: previous?.key === key ? previous.box : undefined,
            error: undefined,
            fetching: true
        }));

        try {
            const box = await individualService.getBox(
                boxId,
                controller.signal
            );

            if (!isCurrentRequest()) {
                throw new DOMException(
                    "The box request was superseded.",
                    "AbortError"
                );
            }

            setState({
                key,
                box,
                error: undefined,
                fetching: false
            });
        } catch (failure) {
            if (isCurrentRequest()) {
                setState((previous) => ({
                    key,
                    box: previous?.key === key ? previous.box : undefined,
                    error: individualError(
                        failure,
                        "Could not load the box."
                    ),
                    fetching: false
                }));
            }

            throw failure;
        }
    }, [accountId, boxId, canLoad, key]);

    useEffect(() => {
        if (!canLoad) return;

        void refresh().catch(() => {
            // The request error is exposed through state.
        });

        return () => {
            controllerRef.current?.abort();
            requestRef.current++;
        };
    }, [canLoad, refresh]);

    const current =
        canLoad && state?.key === key ? state : null;

    return {
        box: current?.box,
        error: current?.error,
        loading: canLoad && !current,
        refreshing: Boolean(current?.fetching),
        refresh
    };
}