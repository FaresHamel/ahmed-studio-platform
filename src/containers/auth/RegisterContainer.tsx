"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/i18n/context";
import { RegisterComponent } from "@/components/auth/RegisterComponent";
import { authService } from "@/services/auth.service";
import { RegisterDto } from "@/types/auth";
import { useAuthStore } from "@/store/auth.store";
import { getDashboardPath } from "@/lib/role-redirect";
import toast from "react-hot-toast";
import axios from "axios";

export const RegisterContainer = () => {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { t, language } = useI18n();
  const registerT = t.register;
  const [isLoading, setIsLoading] = useState(false);

  const dir = language === "ar" ? "rtl" : "ltr";

  const handleRegisterSubmit = async (formData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      setIsLoading(true);
      const dto: RegisterDto = { ...formData };
      const response = await authService.register(dto);
      setAuth(response.accessToken, response.user);
      toast.success("Account created successfully!");
      //router.replace(getDashboardPath(response.user.roles));
      router.replace(getDashboardPath(response.user.roles)); // not router.push
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ERR_NETWORK" || !error.response) {
          toast.error(
            "Unable to connect to the server. Please check your connection or server status."
          );
        } else if (error.response.status === 409) {
          toast.error(error.response.data?.message || "Email already in use.");
        } else if (error.response.status === 400) {
          toast.error(
            error.response.data?.message ||
              "Please check your details and try again."
          );
        } else {
          const backendMessage =
            error.response.data?.message || "An unexpected error occurred.";
          toast.error(backendMessage);
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterComponent
      t={registerT}
      dir={dir}
      onSubmit={handleRegisterSubmit}
      isLoading={isLoading}
    />
  );
};

export default RegisterContainer;
