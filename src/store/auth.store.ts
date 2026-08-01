import { create } from "zustand";
import { AuthUser } from "@/types/auth";

interface AuthState {
    accessToken: string | null;
    user: AuthUser | null;
    isInitialized: boolean;
    setAuth: (accessToken: string, user: AuthUser) => void;
    clearAuth: () => void;
    setInitialized: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    user: null,
    isInitialized: false,
    setAuth: (accessToken, user) => set({ accessToken, user }),
    clearAuth: () => set({ accessToken: null, user: null }),
    setInitialized: (v) => set({ isInitialized: v }),
}));