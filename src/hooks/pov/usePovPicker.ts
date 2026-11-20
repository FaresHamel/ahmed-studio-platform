"use client";

import { useEffect, useState } from "react";

import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { povError } from "@/lib/pov/display";
import { useAuthStore } from "@/store/auth.store";

import type {
    Page,
    PageQuery
} from "@/types/production-api";

type PickerLoader<T> = (
    params: PageQuery,
    signal?: AbortSignal
) => Promise<Page<T>>;

interface PickerResult<T> {
    key: string;
    items: T[];
    totalPages: number;
    error?: string;
}

const PAGE_SIZE = 5;

export function usePovPicker<T>(loader: PickerLoader<T>) {
    const accountId = useAuthStore((state) => state.user?.id);
    const initialized = useAuthStore((state) => state.isInitialized);

    const isAdmin = useAuthStore((state) =>
        Boolean(state.user?.roles.includes("admin"))
    );

    const canLoad = initialized && isAdmin;

    const [search, setSearch] = useState("");
    const query = useDebouncedValue(search.trim());

    const [pagination, setPagination] = useState({
        query: "",
        page: 1
    });

    const [revision, setRevision] = useState(0);
    const [result, setResult] = useState<PickerResult<T> | null>(null);

    const page = pagination.query === query ? pagination.page : 1;

    const key = JSON.stringify([
        accountId,
        query,
        page,
        revision
    ]);

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
                const response = await loader(
                    {
                        page,
                        limit: PAGE_SIZE,
                        search: query || undefined
                    },
                    controller.signal
                );

                if (!isCurrentRequest()) return;

                const totalPages = Math.max(
                    1,
                    response.meta.totalPages
                );

                if (page > totalPages) {
                    setPagination({ query, page: totalPages });
                    return;
                }

                setResult({
                    key,
                    items: response.data,
                    totalPages
                });
            } catch (failure) {
                if (!isCurrentRequest()) return;

                setResult({
                    key,
                    items: [],
                    totalPages: 1,
                    error: povError(failure, "Could not load options.")
                });
            }
        }

        void load();

        return () => controller.abort();
    }, [accountId, canLoad, key, loader, page, query]);

    const current =
        canLoad && result?.key === key ? result : null;

    return {
        search,
        setSearch,
        items: current?.items ?? [],
        page,
        totalPages: current?.totalPages ?? 1,
        error: current?.error,
        loading:
            canLoad && (search.trim() !== query || !current),

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