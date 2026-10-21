import { create } from 'zustand';
import type { AuthUser } from '@/types/auth';

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isInitialized: boolean;
  // Changes on login/logout, not on refresh within the same session.
  sessionVersion: number;
  allowRefresh: boolean;
  setAuth: (accessToken: string, user: AuthUser) => void;
  setRefreshedAuth: (accessToken: string, user: AuthUser, expectedVersion: number) => boolean;
  clearAuth: () => void;
  setInitialized: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  isInitialized: false,
  sessionVersion: 0,
  allowRefresh: true, // On initial page load only: try the server refresh cookie.
  setAuth: (accessToken, user) => set((state) => ({
    accessToken, user, isInitialized: true, allowRefresh: true,
    sessionVersion: state.sessionVersion + 1,
  })),
  setRefreshedAuth: (accessToken, user, expectedVersion) => {
    const state = get();
    if (state.sessionVersion !== expectedVersion || !state.allowRefresh) return false;
    set({ accessToken, user });
    return true;
  },
  clearAuth: () => set((state) => ({
    accessToken: null, user: null, isInitialized: true, allowRefresh: false,
    sessionVersion: state.sessionVersion + 1,
  })),
  setInitialized: (isInitialized) => set({ isInitialized }),
}));
