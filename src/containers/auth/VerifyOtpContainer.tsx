"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { useI18n } from "@/i18n/context";
import { VerifyOtpComponent } from "@/components/auth/VerifyOtpComponent";
import { authService } from "@/services/auth.service";
import { usePasswordResetStore } from "@/store/password-reset.store";

export const VerifyOtpContainer = () => {
  const router = useRouter();
  const { t, language } = useI18n();
  const otpT = t.verifyOtp;
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { email, setResetToken } = usePasswordResetStore();

  const dir = language === "ar" ? "rtl" : "ltr";

  // If someone lands here directly without going through step 1, send them back
  useEffect(() => {
    if (!email) router.replace("/forgot-password");
  }, [email, router]);

  const handleSubmit = async (otp: string) => {
    if (!email) return;
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const response = await authService.verifyOtp({ email, otp });
      setResetToken(response.resetToken);
      router.push("/reset-password");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setErrorMessage(otpT.errors.invalidCode);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    try {
      await authService.forgotPassword({ email });
      toast.success("A new code has been sent.");
    } catch {
      toast.error("Could not resend code. Please try again.");
    }
  };

  if (!email) return null;

  return (
    <VerifyOtpComponent
      t={otpT}
      dir={dir}
      email={email}
      onSubmit={handleSubmit}
      onResend={handleResend}
      isLoading={isLoading}
      errorMessage={errorMessage}
    />
  );
};

export default VerifyOtpContainer;
