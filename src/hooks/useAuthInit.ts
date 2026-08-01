"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";

export function useAuthInit() {
    const setAuth = useAuthStore((s) => s.setAuth);
    const setInitialized = useAuthStore((s) => s.setInitialized);

    useEffect(() => {
        authService
            .refresh()
            .then(({ accessToken, user }) => setAuth(accessToken, user))
            .catch(() => { })
            .finally(() => setInitialized(true));
    }, []);
}