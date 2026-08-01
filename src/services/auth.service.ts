import api from "@/apis/axios";
import {
  LoginDto,
  RegisterDto,
  AuthResponse,
  ForgotPasswordDto,
  VerifyOtpDto,
  VerifyOtpResponse,
  ResetPasswordDto,
} from "@/types/auth";
export const authService = {
  async register(data: RegisterDto): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>("/auth/register", data);
    return res.data;
  },

  async login(data: LoginDto): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>("/auth/login", data);
    return res.data;
  },

  async refresh(): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>("/auth/refresh");
    return res.data;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },

  async forgotPassword(data: ForgotPasswordDto): Promise<{ message: string }> {
    const res = await api.post<{ message: string }>("/auth/forgot-password", data);
    return res.data;
  },

  async verifyOtp(data: VerifyOtpDto): Promise<VerifyOtpResponse> {
    const res = await api.post<VerifyOtpResponse>("/auth/verify-otp", data);
    return res.data;
  },

  async resetPassword(resetToken: string, data: ResetPasswordDto): Promise<{ message: string }> {
    const res = await api.post<{ message: string }>("/auth/reset-password", data, {
      headers: { Authorization: `Bearer ${resetToken}` },
    });
    return res.data;
  },
};