import axios from "axios";
import { useAuthStore } from "@/store/auth.store";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const EXCLUDED_FROM_REFRESH = [
    "/auth/refresh",
    "/auth/reset-password",
    "/auth/verify-otp",
    "/auth/forgot-password",
];

let refreshPromise: Promise<string | null> | null = null;

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config;
        if (
            error.response?.status === 401 &&
            !original._retry &&
            !EXCLUDED_FROM_REFRESH.includes(original.url)
        ) {
            original._retry = true;
            try {
                if (!refreshPromise) {
                    refreshPromise = api
                        .post("/auth/refresh")
                        .then((res) => {
                            const { accessToken, user } = res.data;
                            useAuthStore.getState().setAuth(accessToken, user);
                            return accessToken;
                        })
                        .catch(() => {
                            useAuthStore.getState().clearAuth();
                            return null;
                        })
                        .finally(() => {
                            refreshPromise = null;
                        });
                }
                const newToken = await refreshPromise;
                if (newToken) {
                    original.headers.Authorization = `Bearer ${newToken}`;
                    return api(original);
                }
            } catch {
                useAuthStore.getState().clearAuth();
            }
        }
        return Promise.reject(error);
    }
);

export default api;