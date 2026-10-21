import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/auth.store';
import type { AuthResponse } from '@/types/auth';
import { getPrimaryRole } from '@/lib/role-redirect';

const options = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
};
const api = axios.create(options);
// No interceptors on this client: refresh can never recursively refresh itself.
const refreshApi = axios.create(options);
const NO_AUTO_REFRESH = new Set([
  '/auth/login', '/auth/register', '/auth/logout', '/auth/refresh',
  '/auth/reset-password', '/auth/verify-otp', '/auth/forgot-password',
]);
function authEndpoint(url: string | undefined): boolean {
  const pathname = (url ?? '').split('?')[0].replace(/\/+$/, '');
  // Also handles a baseURL prefix or an absolute request URL.
  return [...NO_AUTO_REFRESH].some((endpoint) => pathname === endpoint || pathname.endsWith(endpoint));
}

export function assertAuthResponse(value: unknown): asserts value is AuthResponse {
  const data = value as Partial<AuthResponse> | null;
  if (!data || typeof data.accessToken !== 'string' || !data.accessToken ||
      !data.user || typeof data.user.id !== 'string' || typeof data.user.email !== 'string' ||
      !Array.isArray(data.user.roles) || !getPrimaryRole(data.user.roles)) {
    throw new Error('Invalid authentication response or unsupported user role');
  }
}

let refreshInFlight: { version: number; promise: Promise<AuthResponse> } | null = null;
export function refreshSession(): Promise<AuthResponse> {
  const current = useAuthStore.getState();
  if (!current.allowRefresh) return Promise.reject(new Error('Session refresh is disabled after sign out'));
  const version = current.sessionVersion;
  if (refreshInFlight?.version === version) return refreshInFlight.promise;
  const promise = refreshApi.post<AuthResponse>('/auth/refresh')
    .then(({ data }) => {
      assertAuthResponse(data);
      const applied = useAuthStore.getState().setRefreshedAuth(data.accessToken, data.user, version);
      if (!applied) throw new Error('An outdated refresh response was ignored');
      return data;
    })
    .catch((error: unknown) => {
      if (useAuthStore.getState().sessionVersion === version) useAuthStore.getState().clearAuth();
      throw error;
    })
    .finally(() => {
      if (refreshInFlight?.promise === promise) refreshInFlight = null;
    });
  refreshInFlight = { version, promise };
  return promise;
}

let initialization: Promise<void> | null = null;
export function initializeAuth(): Promise<void> {
  if (useAuthStore.getState().isInitialized) return Promise.resolve();
  if (!initialization) {
    initialization = refreshSession()
      .then(() => undefined)
      .catch(() => undefined) // refreshSession clears only its own failed session.
      .finally(() => { useAuthStore.getState().setInitialized(true); });
  }
  return initialization;
}

type SessionConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  _sessionVersion?: number;
  _sentToken?: string | null;
};
api.interceptors.request.use((config) => {
  const request = config as SessionConfig;
  const state = useAuthStore.getState();
  request._sessionVersion = state.sessionVersion;
  if (!authEndpoint(request.url)) {
    if (state.accessToken && !request.headers.Authorization) {
      request.headers.Authorization = `Bearer ${state.accessToken}`;
    }
    request._sentToken = state.accessToken;
  }
  return request;
});

api.interceptors.response.use((response) => response, async (error: AxiosError) => {
  const original = error.config as SessionConfig | undefined;
  if (!original || error.response?.status !== 401 || original._retry || authEndpoint(original.url)) {
    return Promise.reject(error);
  }
  const state = useAuthStore.getState();
  // Never replay an old user's request under a newly logged-in account.
  if (original._sessionVersion !== state.sessionVersion || !state.allowRefresh) return Promise.reject(error);
  original._retry = true;
  try {
    // A delayed 401 can arrive after another request has already refreshed.
    const token = state.accessToken && state.accessToken !== original._sentToken
      ? state.accessToken
      : (await refreshSession()).accessToken;
    if (useAuthStore.getState().sessionVersion !== original._sessionVersion) return Promise.reject(error);
    original.headers.Authorization = `Bearer ${token}`;
    return api(original);
  } catch {
    return Promise.reject(error);
  }
});
export default api;
