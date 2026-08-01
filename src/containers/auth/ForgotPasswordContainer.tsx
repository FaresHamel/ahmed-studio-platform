"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { useI18n } from "@/i18n/context";
import { ForgotPasswordComponent } from "@/components/auth/ForgotPasswordComponent";
import { authService } from "@/services/auth.service";
import { usePasswordResetStore } from "@/store/password-reset.store";
import { useAuthStore } from "@/store/auth.store";

export const ForgotPasswordContainer = () => {
  const router = useRouter();
  const { t, language } = useI18n();
  const forgotT = t.forgotPassword;
  const [isLoading, setIsLoading] = useState(false);
  const setEmail = usePasswordResetStore((s) => s.setEmail);
 const clearAuth = useAuthStore((s) => s.clearAuth);
  const dir = language === "ar" ? "rtl" : "ltr";

  const handleSubmit = async (email: string) => {
    try {
        setIsLoading(true);
         clearAuth();
        const response = await authService.forgotPassword({ email });
        console.log("Forgot password response:", response);
      setEmail(email);
      toast.success("If an account exists, a code has been sent.");
      router.push("/verify-otp");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ERR_NETWORK" || !error.response) {
          toast.error("Unable to connect to the server.");
        } else {
          toast.error(
            error.response.data?.message || "An unexpected error occurred."
          );
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ForgotPasswordComponent
      t={forgotT}
      dir={dir}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};

export default ForgotPasswordContainer;
