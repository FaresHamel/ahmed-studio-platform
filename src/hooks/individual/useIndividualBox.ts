"use client";

import { useEffect, useState } from "react";
import { individualService } from "@/services/individual.service";
import { useAuthStore } from "@/store/auth.store";
import { individualError } from "./useIndividualJob";
import type { IndividualBoxDetails } from "@/types/production-api";

export function useIndividualBox(boxId: string) {
    const user = useAuthStore(state => state.user);
    const initialized = useAuthStore(state => state.isInitialized);
    const canLoad = initialized && !!user?.roles.includes("admin");

    const [revision, setRevision] = useState(0);
    const [result, setResult] = useState<{
        key: string;
        box?: IndividualBoxDetails;
        error?: string;
    } | null>(null);

    const key = JSON.stringify([boxId, user?.id, revision]);

    useEffect(() => {
        if (!canLoad) return;

        const controller = new AbortController();

        async function load() {
            try {
                const box = await individualService.getBox(
                    boxId,
                    controller.signal,
                );

                if (!controller.signal.aborted) {
                    setResult({ key, box });
                }
            } catch (failure) {
                if (!controller.signal.aborted) {
                    setResult({
                        key,
                        error: individualError(failure, "Could not load the box."),
                    });
                }
            }
        }

        void load();
        return () => controller.abort();
    }, [canLoad, boxId, key]);

    const current = canLoad && result?.key === key ? result : null;

    return {
        box: current?.box,
        error: current?.error,
        loading: canLoad && !current,
        refresh: () => setRevision(value => value + 1),
    };
}