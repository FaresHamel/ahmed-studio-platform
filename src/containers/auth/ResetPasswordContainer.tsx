"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { useI18n } from "@/i18n/context";
import { ResetPasswordComponent } from "@/components/auth/ResetPasswordComponent";
import { authService } from "@/services/auth.service";
import { usePasswordResetStore } from "@/store/password-reset.store";
import { useAuthStore } from "@/store/auth.store";

export const ResetPasswordContainer = () => {
  const router = useRouter();
  const { t, language } = useI18n();
  const resetT = t.resetPassword;
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false); // ← new: blocks the guard effect once we're finishing up
  const { resetToken, clear } = usePasswordResetStore();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const dir = language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    if (!resetToken && !isDone) {
      router.replace("/forgot-password");
    }
  }, [resetToken, isDone, router]);

  const handleSubmit = async (data: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (!resetToken) return;
    try {
      setIsLoading(true);
      await authService.resetPassword(resetToken, data);
      toast.success("Password reset successful. Please sign in.");
      setIsDone(true); // ← stop the guard effect from firing on the next render
      clear();
      clearAuth(); 
      router.replace("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("Your session expired. Please start over.");
          setIsDone(true);
          clear();
          router.replace("/forgot-password");
        } else if (error.response?.status === 400) {
          toast.error(
            error.response.data?.message || "Please check your details."
          );
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!resetToken && !isDone) return null;

  return (
    <ResetPasswordComponent
      t={resetT}
      dir={dir}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};

export default ResetPasswordContainer;
