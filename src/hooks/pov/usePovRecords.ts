"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";

import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { povError } from "@/lib/pov/display";
import { povService } from "@/services/pov.service";
import { useAuthStore } from "@/store/auth.store";

import type {
    Page,
    PovRecord
} from "@/types/production-api";

const PAGE_SIZE = 10;

interface RecordsState {
    key: string;
    response?: Page<PovRecord>;
    error?: string;
    fetching: boolean;
}

export function usePovRecords(projectId: string) {
    const accountId = useAuthStore((state) => state.user?.id);
    const initialized = useAuthStore((state) => state.isInitialized);

    const isAdmin = useAuthStore((state) =>
        Boolean(state.user?.roles.includes("admin"))
    );

    const canLoad = initialized && isAdmin && Boolean(projectId);
    const scope = JSON.stringify([projectId, accountId]);

    const [searchState, setSearchState] = useState({
        scope,
        value: ""
    });

    const search =
        searchState.scope === scope ? searchState.value : "";

    const query = useDebouncedValue(search.trim());

    const [pagination, setPagination] = useState({
        scope,
        query: "",
        page: 1
    });

    const page =
        pagination.scope === scope && pagination.query === query
            ? pagination.page
            : 1;

    const key = JSON.stringify([scope, query, page]);

    const [state, setState] = useState<RecordsState | null>(null);

    const controllerRef = useRef<AbortController | null>(null);
    const requestRef = useRef(0);

    const refresh = useCallback(async (): Promise<boolean> => {
        if (!canLoad) return false;

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
            response:
                previous?.key === key ? previous.response : undefined,
            fetching: true
        }));

        try {
            const response = await povService.records(
                projectId,
                {
                    page,
                    limit: PAGE_SIZE,
                    search: query || undefined
                },
                controller.signal
            );

            if (!isCurrentRequest()) return false;

            const lastPage = Math.max(1, response.meta.totalPages);

            setState({
                key,
                response,
                fetching: false
            });

            if (page > lastPage) {
                setPagination({
                    scope,
                    query,
                    page: lastPage
                });
            }

            return true;
        } catch (failure) {
            if (isCurrentRequest()) {
                setState((previous) => ({
                    key,
                    response:
                        previous?.key === key ? previous.response : undefined,
                    fetching: false,
                    error: povError(failure, "Could not load records.")
                }));
            }

            return false;
        }
    }, [accountId, canLoad, key, page, projectId, query, scope]);

    useEffect(() => {
        if (!canLoad) return;

        void refresh();

        return () => {
            controllerRef.current?.abort();
            requestRef.current++;
        };
    }, [canLoad, refresh]);

    const current =
        canLoad && state?.key === key ? state : null;

    const searching = search.trim() !== query;

    return {
        records: current?.response?.data ?? [],
        total: current?.response?.meta.total ?? 0,
        totalPages: Math.max(
            1,
            current?.response?.meta.totalPages ?? 1
        ),
        page,
        limit: PAGE_SIZE,
        search,
        error: current?.error,
        loading:
            canLoad &&
            (searching || !current || (
                current.fetching && !current.response
            )),
        refreshing: Boolean(current?.fetching),
        refresh,

        setSearch(value: string) {
            setSearchState({ scope, value });
        },

        setPage(nextPage: number) {
            setPagination({
                scope,
                query,
                page: Math.max(1, nextPage)
            });
        }
    };
}