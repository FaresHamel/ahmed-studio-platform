export type UserRole = "admin" | "operator" | "client";

export interface AuthUser {
    id: string;
    email: string;
    name?: string | null;
    roles: UserRole[];
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

export interface AuthResponse {
    accessToken: string;
    message: string;
    user: AuthUser;
}
export interface ForgotPasswordDto {
    email: string;
}

export interface VerifyOtpDto {
    email: string;
    otp: string;
}

export interface VerifyOtpResponse {
    resetToken: string;
    message: string;
}

export interface ResetPasswordDto {
    newPassword: string;
    confirmPassword: string;
}