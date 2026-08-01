"use client";
import { useState } from "react";
import { useI18n } from "@/i18n/context";
import { LoginComponent } from "@/components/auth/LoginComponent";
import { authService } from "@/services/auth.service"; // Replace with your AuthService import
import { LoginDto } from "@/types/auth";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { getDashboardPath } from "@/lib/role-redirect";
export const LoginContainer = () => {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { t, language } = useI18n();
  const loginT = t.login;
  const [isLoading, setIsLoading] = useState(false);

  const dir = language === "ar" ? "rtl" : "ltr";

  const handleLoginSubmit = async (formData: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) => {
    try {
      setIsLoading(true);
      const loginDta: LoginDto = {
        email: formData.email,
        password: formData.password
      };
      const response = await authService.login(loginDta);
      setAuth(response.accessToken, response.user);
      toast.success("Logged in successfully!");
     // router.push(getDashboardPath(response.user.roles));
      router.replace(getDashboardPath(response.user.roles)); // not router.push
      // Execute post-login actions (redirect, state updates, etc.)
    } catch (error) {
         console.log("response of backend :", error);
      // Check if error is from Axios
      if (axios.isAxiosError(error)) {
        if (error.code === "ERR_NETWORK" || !error.response) {
          toast.error(
            "Unable to connect to the server. Please check your connection or server status."
          );
        } else if (error.response.status === 404) {
          toast.error("Authentication endpoint not found (404).");
        } else if (error.response.status === 401) {
          toast.error(
            error.response.data?.message || "Invalid email or password."
          );
        } else {
          // Fallback to backend's error message or status text
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

  const handleGoogleSignIn = async () => {
    try {
     // await AuthService.loginWithGoogle();
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  return (
    <LoginComponent
      t={loginT}
      dir={dir}
      onSubmit={handleLoginSubmit}
      onGoogleSignIn={handleGoogleSignIn}
      isLoading={isLoading}
    />
  );
};

export default LoginContainer;
