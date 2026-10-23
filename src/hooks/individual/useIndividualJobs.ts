"use client";

import { useEffect, useState } from "react";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { useAuthStore } from "@/store/auth.store";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { individualService } from "@/services/individual.service";
import type {
    IndividualJobListItem,
    Page,
} from "@/types/production-api";

const LIMIT = 10;

export function useIndividualJobs() {
    const user = useAuthStore(state => state.user);
    const initialized = useAuthStore(state => state.isInitialized);
    const { search } = useDashboard();

    const input = search.trim();
    const query = useDebouncedValue(input);
    const canLoad = initialized && !!user?.roles.includes("admin");

    const [pagination, setPagination] = useState({
        query: "",
        page: 1,
    });
    const [revision, setRevision] = useState(0);

    const [result, setResult] = useState<{
        key: string;
        response?: Page<IndividualJobListItem>;
        error?: string;
    } | null>(null);

    const page = pagination.query === query
        ? pagination.page
        : 1;

    const key = JSON.stringify([user?.id, query, page, revision]);

    useEffect(() => {
        if (!canLoad) return;

        const controller = new AbortController();

        async function load() {
            try {
                const response = await individualService.listJobs(
                    { page, limit: LIMIT, search: query || undefined },
                    controller.signal,
                );

                if (controller.signal.aborted) return;

                const totalPages = Math.max(1, response.meta.totalPages);

                if (page > totalPages) {
                    setPagination({ query, page: totalPages });
                    return;
                }

                setResult({ key, response });
            } catch {
                if (!controller.signal.aborted) {
                    setResult({
                        key,
                        error: "Could not load Individual jobs.",
                    });
                }
            }
        }

        void load();
        return () => controller.abort();
    }, [canLoad, key, page, query]);

    const current = canLoad && result?.key === key ? result : null;

    return {
        jobs: current?.response?.data ?? [],
        total: current?.response?.meta.total ?? 0,
        totalPages: Math.max(
            1,
            current?.response?.meta.totalPages ?? 1,
        ),
        page,
        limit: LIMIT,
        canLoad,
        loading: canLoad && (input !== query || !current),
        error: current?.error,

        setPage(next: number) {
            setPagination({ query, page: Math.max(1, next) });
        },

        refresh() {
            setRevision(value => value + 1);
        },
    };
}