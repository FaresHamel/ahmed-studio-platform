"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";

interface ResetPasswordComponentProps {
  t: {
    title: string;
    subtitle: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    confirmPasswordLabel: string;
    confirmPasswordPlaceholder: string;
    continueBtn: string;
    heroTagline: string;
    errors: {
      passwordRequired: string;
      passwordMin: string;
      confirmPasswordRequired: string;
      passwordsMustMatch: string;
    };
  };
  dir?: "ltr" | "rtl";
  onSubmit: (data: { newPassword: string; confirmPassword: string }) => void;
  isLoading?: boolean;
}

export const ResetPasswordComponent: React.FC<ResetPasswordComponentProps> = ({
  t,
  dir = "ltr",
  onSubmit,
  isLoading = false
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const schema = Yup.object().shape({
    newPassword: Yup.string()
      .min(8, t.errors.passwordMin)
      .required(t.errors.passwordRequired),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], t.errors.passwordsMustMatch)
      .required(t.errors.confirmPasswordRequired)
  });

  const formik = useFormik({
    initialValues: { newPassword: "", confirmPassword: "" },
    validationSchema: schema,
    onSubmit: (values) => onSubmit(values)
  });

  return (
    <div
      dir={dir}
      className="min-h-screen w-full bg-background text-foreground flex items-center justify-center p-6 md:p-12"
    >
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12 py-4 sm:py-6 lg:py-8 w-full">
          <div className="relative w-56 sm:w-72 md:w-80 lg:w-96 h-36 sm:h-44 md:h-52 lg:h-60 mb-2 sm:mb-4">
            <Image
              src="/images/logoCompany.png"
              alt="Ahmed Studio"
              fill
              sizes="(max-width: 640px) 224px, (max-width: 768px) 288px, (max-width: 1024px) 320px, 384px"
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col items-center space-y-4 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
            <p className="text-section-title font-[350] text-[18px] sm:text-[20px] lg:text-[24px] leading-[120%] text-center whitespace-pre-line">
              {t.heroTagline}
            </p>
            <div className="flex items-center space-x-2 dir-ltr pt-2">
              <span className="h-1 w-6 sm:w-8 bg-bg-soft rounded-full" />
              <span className="h-1 w-6 sm:w-8 bg-bg-soft rounded-full" />
              <span className="h-1 w-6 sm:w-8 bg-bg-soft rounded-full" />
              <span className="h-1 w-6 sm:w-8 bg-bg-soft rounded-full" />
              <span className="h-1 w-6 sm:w-8 bg-primary rounded-full" />
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-bg-soft">
            <div className="text-center mb-8">
              <h2 className="text-[28px] sm:text-[32px] font-[600] text-dark-brown tracking-tight leading-[120%] mb-2">
                {t.title}
              </h2>
              <p className="text-[14px] text-unselected font-[350] leading-[140%]">
                {t.subtitle}
              </p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-[14px] font-[500] text-section-title">
                  {t.passwordLabel} <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.newPassword}
                    placeholder={t.passwordPlaceholder}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      formik.touched.newPassword && formik.errors.newPassword
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
                {formik.touched.newPassword && formik.errors.newPassword && (
                  <p className="text-[12px] font-[350] text-red-500 mt-1">
                    {formik.errors.newPassword}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-[14px] font-[500] text-section-title">
                  {t.confirmPasswordLabel}{" "}
                  <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirmPassword}
                    placeholder={t.confirmPasswordPlaceholder}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      formik.touched.confirmPassword &&
                      formik.errors.confirmPassword
                        ? "border-red-500 focus:ring-red-500"
                        : "border-section-title/30 focus:border-primary focus:ring-primary"
                    } focus:ring-1 outline-none text-[14px] font-[350] placeholder:text-unselected/50 transition bg-transparent pe-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 end-0 flex items-center pe-3 text-unselected hover:text-dark-brown"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <p className="text-[12px] font-[350] text-red-500 mt-1">
                      {formik.errors.confirmPassword}
                    </p>
                  )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-primary hover:bg-dark-brown text-white font-[500] rounded-lg transition duration-200 text-[14px] shadow-sm disabled:opacity-50 mt-2"
              >
                {isLoading ? "..." : t.continueBtn}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
