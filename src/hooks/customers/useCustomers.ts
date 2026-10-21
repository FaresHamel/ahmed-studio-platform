"use client";

import { useEffect, useState } from "react";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { useAuthStore } from "@/store/auth.store";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { customersService } from "@/services/customers.service";
import type {
    CustomerListItem,
    Page,
} from "@/types/production-api";

const LIMIT = 10;

interface Result {
    requestKey: string;
    response: Page<CustomerListItem>;
}

export function useCustomers() {
    const user = useAuthStore(state => state.user);
    const initialized = useAuthStore(state => state.isInitialized);
    const { search } = useDashboard();

    const input = search.trim();
    const query = useDebouncedValue(input);
    const userId = user?.id;

    const canLoad =
        initialized &&
        !!userId &&
        !!user?.roles.includes("admin");

    const [pagination, setPagination] = useState({
        query: "",
        page: 1,
    });

    const [revision, setRevision] = useState(0);
    const [result, setResult] = useState<Result | null>(null);
    const [failure, setFailure] = useState<{
        requestKey: string;
        message: string;
    } | null>(null);

    const page = pagination.query === query
        ? pagination.page
        : 1;

    const requestKey = JSON.stringify([
        userId,
        query,
        page,
        revision,
    ]);

    useEffect(() => {
        if (!canLoad) return;

        const controller = new AbortController();

        async function load() {
            try {
                const response = await customersService.list(
                    {
                        page,
                        limit: LIMIT,
                        search: query || undefined,
                    },
                    controller.signal,
                );

                if (controller.signal.aborted) return;

                const totalPages = Math.max(
                    1,
                    response.meta.totalPages,
                );

                if (page > totalPages) {
                    setPagination({ query, page: totalPages });
                    return;
                }

                setResult({ requestKey, response });
            } catch {
                if (!controller.signal.aborted) {
                    setFailure({
                        requestKey,
                        message: "Could not load customers. Please try again.",
                    });
                }
            }
        }

        void load();

        return () => controller.abort();
    }, [canLoad, page, query, requestKey]);

    const current = canLoad && result?.requestKey === requestKey
        ? result.response
        : null;

    const error = canLoad && failure?.requestKey === requestKey
        ? failure.message
        : null;

    const loading =
        canLoad &&
        (input !== query || (!current && !error));

    return {
        customers: current?.data ?? [],
        total: current?.meta.total ?? 0,
        totalPages: Math.max(1, current?.meta.totalPages ?? 1),
        page,
        limit: LIMIT,
        loading,
        error,
        canLoad,

        setPage(next: number) {
            setPagination({
                query,
                page: Math.max(1, next),
            });
        },

        refresh() {
            setRevision(value => value + 1);
        },
    };
}