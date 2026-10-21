"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { customersService } from "@/services/customers.service";
import { useAuthStore } from "@/store/auth.store";
import type { CustomerDetails } from "@/types/production-api";

export function customerError(
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

export function useCustomerDetails(id: string) {
    const user = useAuthStore(state => state.user);
    const initialized = useAuthStore(state => state.isInitialized);
    const canLoad = initialized && !!user?.roles.includes("admin");

    const [revision, setRevision] = useState(0);
    const [result, setResult] = useState<{
        key: string;
        customer?: CustomerDetails;
        error?: string;
    } | null>(null);

    const key = JSON.stringify([id, user?.id, revision]);

    useEffect(() => {
        if (!canLoad) return;

        const controller = new AbortController();

        async function load() {
            try {
                const customer = await customersService.get(
                    id,
                    controller.signal,
                );

                if (!controller.signal.aborted) {
                    setResult({ key, customer });
                }
            } catch (error) {
                if (!controller.signal.aborted) {
                    setResult({
                        key,
                        error: customerError(
                            error,
                            "Could not load customer details.",
                        ),
                    });
                }
            }
        }

        void load();
        return () => controller.abort();
    }, [canLoad, id, key]);

    const current = canLoad && result?.key === key ? result : null;

    return {
        customer: current?.customer,
        error: current?.error,
        loading: canLoad && !current,
        refresh: () => setRevision(value => value + 1),
    };
}