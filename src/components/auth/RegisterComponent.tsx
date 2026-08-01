"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";

interface RegisterComponentProps {
  t: {
    welcome: string;
    title: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    confirmPasswordLabel: string;
    confirmPasswordPlaceholder: string;
    agreeTerms: string;
    createAccount: string;
    alreadyHaveAccount: string;
    signIn: string;
    heroTagline: string;
    errors: {
      nameRequired: string;
      emailRequired: string;
      emailInvalid: string;
      phoneRequired: string;
      phoneInvalid: string;
      passwordRequired: string;
      passwordMin: string;
      confirmPasswordRequired: string;
      passwordsMustMatch: string;
      termsRequired: string;
    };
  };
  dir?: "ltr" | "rtl";
  onSubmit: (formData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }) => void;
  isLoading?: boolean;
}

export const RegisterComponent: React.FC<RegisterComponentProps> = ({
  t,
  dir = "ltr",
  onSubmit,
  isLoading = false
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const registerSchema = Yup.object().shape({
    name: Yup.string().required(t.errors.nameRequired),
    email: Yup.string()
      .email(t.errors.emailInvalid)
      .required(t.errors.emailRequired),
    phone: Yup.string()
      .matches(/^[0-9+\s-]{8,15}$/, t.errors.phoneInvalid)
      .required(t.errors.phoneRequired),
    password: Yup.string()
      .min(8, t.errors.passwordMin)
      .required(t.errors.passwordRequired),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], t.errors.passwordsMustMatch)
      .required(t.errors.confirmPasswordRequired),
    agreeTerms: Yup.boolean().oneOf([true], t.errors.termsRequired)
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agreeTerms: true
    },
    validationSchema: registerSchema,
    onSubmit: (values) => {
      onSubmit({
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        confirmPassword: values.confirmPassword
      });
    }
  });

  return (
    <div
      dir={dir}
      className="min-h-screen w-full bg-background text-foreground flex items-center justify-center p-6 md:p-12"
    >
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left side — identical to LoginComponent */}
        <div className="flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12 py-4 sm:py-6 lg:py-8 w-full">
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

          <div className="flex flex-col items-center space-y-4 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
            <p className="text-section-title font-[350] text-[18px] sm:text-[20px] lg:text-[24px] leading-[120%] tracking-normal text-center whitespace-pre-line">
              {t.heroTagline}
            </p>
            <div className="flex items-center space-x-2 dir-ltr pt-2">
              <span className="h-1 w-6 sm:w-8 bg-bg-soft rounded-full" />
              <span className="h-1 w-6 sm:w-8 bg-primary rounded-full" />
              <span className="h-1 w-6 sm:w-8 bg-bg-soft rounded-full" />
              <span className="h-1 w-6 sm:w-8 bg-bg-soft rounded-full" />
              <span className="h-1 w-6 sm:w-8 bg-bg-soft rounded-full" />
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-bg-soft">
            <div className="text-center mb-8">
              <p className="text-[14px] font-[500] text-section-title mb-1">
                {t.welcome}
              </p>
              <h2 className="text-[28px] sm:text-[32px] font-[600] text-dark-brown tracking-tight leading-[120%]">
                {t.title}
              </h2>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-[14px] font-[500] text-section-title">
                  {t.nameLabel} <span className="text-primary">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  placeholder={t.namePlaceholder}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    formik.touched.name && formik.errors.name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-section-title/30 focus:border-primary focus:ring-primary"
                  } focus:ring-1 outline-none text-[14px] font-[350] placeholder:text-unselected/50 transition bg-transparent`}
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-[12px] font-[350] text-red-500 mt-1">
                    {formik.errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-[14px] font-[500] text-section-title">
                  {t.emailLabel} <span className="text-primary">*</span>
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

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="block text-[14px] font-[500] text-section-title">
                  {t.phoneLabel} <span className="text-primary">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phone}
                  placeholder={t.phonePlaceholder}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    formik.touched.phone && formik.errors.phone
                      ? "border-red-500 focus:ring-red-500"
                      : "border-section-title/30 focus:border-primary focus:ring-primary"
                  } focus:ring-1 outline-none text-[14px] font-[350] placeholder:text-unselected/50 transition bg-transparent`}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <p className="text-[12px] font-[350] text-red-500 mt-1">
                    {formik.errors.phone}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-[14px] font-[500] text-section-title">
                  {t.passwordLabel} <span className="text-primary">*</span>
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

              {/* Confirm Password */}
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

              {/* Terms checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer text-section-title font-[400] text-[13px]">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    onChange={formik.handleChange}
                    checked={formik.values.agreeTerms}
                    className="w-4 h-4 mt-0.5 rounded border-section-title/30 text-primary focus:ring-primary accent-primary"
                  />
                  <span>{t.agreeTerms}</span>
                </label>
                {formik.touched.agreeTerms && formik.errors.agreeTerms && (
                  <p className="text-[12px] font-[350] text-red-500 mt-1">
                    {formik.errors.agreeTerms}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-primary hover:bg-dark-brown text-white font-[500] rounded-lg transition duration-200 text-[14px] shadow-sm disabled:opacity-50 mt-2"
              >
                {isLoading ? "..." : t.createAccount}
              </button>
            </form>

            <p className="text-center text-[13px] font-[350] text-unselected mt-6">
              {t.alreadyHaveAccount}{" "}
              <Link
                href="/login"
                className="text-primary font-[600] hover:underline"
              >
                {t.signIn}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
