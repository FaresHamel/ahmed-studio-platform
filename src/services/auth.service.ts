import api, { refreshSession, assertAuthResponse } from '@/apis/axios';
import { useAuthStore } from '@/store/auth.store';
import type {
  LoginDto, RegisterDto, AuthResponse, ForgotPasswordDto, VerifyOtpDto,
  VerifyOtpResponse, ResetPasswordDto,
} from '@/types/auth';

async function authenticate(path: string, data: LoginDto | RegisterDto): Promise<AuthResponse> {
  // Invalidate an initialization refresh before starting an explicit sign-in.
  useAuthStore.getState().clearAuth();
  const version = useAuthStore.getState().sessionVersion;
  const response = await api.post<AuthResponse>(path, data);
  assertAuthResponse(response.data);
  if (useAuthStore.getState().sessionVersion !== version) throw new Error('An outdated login response was ignored');
  // Login/Register containers keep their existing setAuth(response...) call.
  return response.data;
}
export const authService = {
  register: (data: RegisterDto): Promise<AuthResponse> => authenticate('/auth/register', data),
  login: (data: LoginDto): Promise<AuthResponse> => authenticate('/auth/login', data),
  refresh: (): Promise<AuthResponse> => refreshSession(),
  async logout(): Promise<void> {
    const token = useAuthStore.getState().accessToken;
    // Invalidate all pending refresh/login responses immediately.
    useAuthStore.getState().clearAuth();
    await api.post('/auth/logout', undefined, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
  },
  async forgotPassword(data: ForgotPasswordDto): Promise<{ message: string }> {
    return (await api.post<{ message: string }>('/auth/forgot-password', data)).data;
  },
  async verifyOtp(data: VerifyOtpDto): Promise<VerifyOtpResponse> {
    return (await api.post<VerifyOtpResponse>('/auth/verify-otp', data)).data;
  },
  async resetPassword(resetToken: string, data: ResetPasswordDto): Promise<{ message: string }> {
    return (await api.post<{ message: string }>('/auth/reset-password', data, {
      headers: { Authorization: `Bearer ${resetToken}` },
    })).data;
  },
};
