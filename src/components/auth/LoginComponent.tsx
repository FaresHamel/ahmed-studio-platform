"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
interface LoginComponentProps {
  t: {
    welcome: string;
    subtitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    rememberMe: string;
    forgotPassword: string;
    signIn: string;
    orLoginWith: string;
    signInWithGoogle: string;
    noAccount: string;
    signUp: string;
    heroTagline: string;
    errors: {
      emailRequired: string;
      emailInvalid: string;
      passwordRequired: string;
      passwordMin: string;
    };
  };
  dir?: "ltr" | "rtl";
  onSubmit: (formData: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) => void;
  onGoogleSignIn: () => void;
  isLoading?: boolean;
}

export const LoginComponent: React.FC<LoginComponentProps> = ({
  t,
  dir = "ltr",
  onSubmit,
  onGoogleSignIn,
  isLoading = false
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Dynamic Yup Validation Schema with localized strings
  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email(t.errors.emailInvalid)
      .required(t.errors.emailRequired),
    password: Yup.string()
      .min(6, t.errors.passwordMin)
      .required(t.errors.passwordRequired),
    rememberMe: Yup.boolean()
  });

  // Formik Hook Setup
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: true
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      onSubmit(values);
    }
  });

  return (
    <div
      dir={dir}
      className="min-h-screen w-full bg-background text-foreground flex items-center justify-center p-6 md:p-12"
    >
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12 py-4 sm:py-6 lg:py-8 w-full">
          {/* Logo Section */}
          <div className="flex flex-col items-center justify-center w-full">
            <div className="relative w-56 sm:w-72 md:w-80 lg:w-96 h-36 sm:h-44 md:h-52 lg:h-60 mb-2 sm:mb-4 transition-all">
              <Image
                src="/images/logoCompany.png"
                alt="Ahmed Studio"
                fill
                sizes="(max-width: 640px) 224px, (max-width: 768px) 288px, (max-width: 1024px) 320px, 384px"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Hero Tagline & Indicators */}
          <div className="flex flex-col items-center space-y-4 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
            <p className="text-section-title font-[350] text-[18px] sm:text-[20px] lg:text-[24px] leading-[120%] tracking-normal text-center whitespace-pre-line">
              {t.heroTagline}
            </p>

            {/* Carousel Indicators */}
            <div className="flex items-center space-x-2 dir-ltr pt-2">
              <span className="h-1 w-6 sm:w-8 bg-primary rounded-full" />
              <span className="h-1 w-6 sm:w-8 bg-bg-soft rounded-full" />
              <span className="h-1 w-6 sm:w-8 bg-bg-soft rounded-full" />
              <span className="h-1 w-6 sm:w-8 bg-bg-soft rounded-full" />
              <span className="h-1 w-6 sm:w-8 bg-bg-soft rounded-full" />
            </div>
          </div>
        </div>
        {/* Right Form Card */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-bg-soft">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-[28px] sm:text-[32px] font-[600] text-dark-brown tracking-tight leading-[120%] mb-2">
                {t.welcome}
              </h2>
              <p className="text-[14px] text-unselected font-[350] leading-[140%]">
                {t.subtitle}
              </p>
            </div>

            {/* Formik Form */}
            <form onSubmit={formik.handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-[14px] font-[500] text-section-title">
                  {t.emailLabel}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  placeholder={t.emailPlaceholder}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    formik.touched.email && formik.errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-section-title/30 focus:border-primary focus:ring-primary"
                  } focus:ring-1 outline-none text-[14px] font-[350] placeholder:text-unselected/50 transition bg-transparent`}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-[12px] font-[350] text-red-500 mt-1">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-[14px] font-[500] text-section-title">
                  {t.passwordLabel}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    placeholder={t.passwordPlaceholder}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      formik.touched.password && formik.errors.password
                        ? "border-red-500 focus:ring-red-500"
                        : "border-section-title/30 focus:border-primary focus:ring-primary"
                    } focus:ring-1 outline-none text-[14px] font-[350] placeholder:text-unselected/50 transition bg-transparent pe-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 end-0 flex items-center pe-3 text-unselected hover:text-dark-brown"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="text-[12px] font-[350] text-red-500 mt-1">
                    {formik.errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-[13px] pt-1">
                <label className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer text-section-title font-[400]">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    onChange={formik.handleChange}
                    checked={formik.values.rememberMe}
                    className="w-4 h-4 rounded border-section-title/30 text-primary focus:ring-primary accent-primary"
                  />
                  <span>{t.rememberMe}</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-section-title hover:text-primary underline-offset-2 hover:underline font-[400]"
                >
                  {t.forgotPassword}
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-primary hover:bg-dark-brown text-white font-[500] rounded-lg transition duration-200 text-[14px] shadow-sm disabled:opacity-50 mt-2"
              >
                {isLoading ? "..." : t.signIn}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="border-t border-section-title/20 w-full"></div>
              <span className="bg-white px-3 text-[12px] text-unselected font-[350] absolute">
                {t.orLoginWith}
              </span>
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={onGoogleSignIn}
              className="w-full py-3 px-4 border border-section-title/30 rounded-lg flex items-center justify-center gap-3 bg-white hover:bg-bg-soft transition text-[14px] font-[400] text-section-title"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{t.signInWithGoogle}</span>
            </button>

            {/* Bottom Signup Link */}
            <p className="text-center text-[13px] font-[350] text-unselected mt-6">
              {t.noAccount}{" "}
              <Link
                href="/registration"
                className="text-primary font-[600] hover:underline"
              >
                {t.signUp}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
