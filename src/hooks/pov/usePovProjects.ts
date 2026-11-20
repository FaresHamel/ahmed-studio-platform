"use client";

import { useEffect, useState } from "react";

import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { povError } from "@/lib/pov/display";
import { povService } from "@/services/pov.service";
import { useAuthStore } from "@/store/auth.store";

import type {
    Page,
    ProjectSummary
} from "@/types/production-api";

const PAGE_SIZE = 10;

interface ProjectsResult {
    key: string;
    response?: Page<ProjectSummary>;
    error?: string;
}

export function usePovProjects() {
    const accountId = useAuthStore((state) => state.user?.id);
    const initialized = useAuthStore((state) => state.isInitialized);

    const isAdmin = useAuthStore((state) =>
        Boolean(state.user?.roles.includes("admin"))
    );

    const { search } = useDashboard();

    const input = search.trim();
    const query = useDebouncedValue(input);
    const canLoad = initialized && isAdmin;

    const [pagination, setPagination] = useState({
        query: "",
        page: 1
    });

    const [revision, setRevision] = useState(0);
    const [result, setResult] = useState<ProjectsResult | null>(null);

    const page = pagination.query === query ? pagination.page : 1;
    const key = JSON.stringify([accountId, query, page, revision]);

    useEffect(() => {
        if (!canLoad) return;

        const controller = new AbortController();

        function isCurrentRequest() {
            const auth = useAuthStore.getState();

            return (
                !controller.signal.aborted &&
                auth.isInitialized &&
                auth.user?.id === accountId &&
                Boolean(auth.user?.roles.includes("admin"))
            );
        }

        async function load() {
            try {
                const response = await povService.list(
                    {
                        page,
                        limit: PAGE_SIZE,
                        search: query || undefined
                    },
                    controller.signal
                );

                if (!isCurrentRequest()) return;

                const lastPage = Math.max(1, response.meta.totalPages);

                if (page > lastPage) {
                    setPagination({ query, page: lastPage });
                    return;
                }

                setResult({ key, response });
            } catch (failure) {
                if (!isCurrentRequest()) return;

                setResult({
                    key,
                    error: povError(failure, "Could not load POV projects.")
                });
            }
        }

        void load();

        return () => controller.abort();
    }, [accountId, canLoad, key, page, query]);

    const current =
        canLoad && result?.key === key ? result : null;

    return {
        projects: current?.response?.data ?? [],
        total: current?.response?.meta.total ?? 0,
        totalPages: Math.max(
            1,
            current?.response?.meta.totalPages ?? 1
        ),
        page,
        limit: PAGE_SIZE,
        initialized,
        canLoad,
        loading: canLoad && (input !== query || !current),
        error: current?.error,

        setPage(nextPage: number) {
            setPagination({
                query,
                page: Math.max(1, nextPage)
            });
        },

        refresh() {
            setRevision((value) => value + 1);
        }
    };
}