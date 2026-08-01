"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface VerifyOtpComponentProps {
  t: {
    title: string;
    subtitle: string;
    otpLabel: string;
    continueBtn: string;
    resendPrompt: string;
    resend: string;
    backToLogin: string;
    signIn: string;
    heroTagline: string;
    errors: { otpRequired: string; otpLength: string; invalidCode: string };
  };
  dir?: "ltr" | "rtl";
  email: string;
  onSubmit: (otp: string) => void;
  onResend: () => void;
  isLoading?: boolean;
  errorMessage?: string | null;
}

export const VerifyOtpComponent: React.FC<VerifyOtpComponentProps> = ({
  t,
  dir = "ltr",
  email,
  onSubmit,
  onResend,
  isLoading = false,
  errorMessage = null
}) => {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = pasted.split("");
    while (next.length < 6) next.push("");
    setDigits(next);
    inputsRef.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(digits.join(""));
  };

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
              <span className="h-1 w-6 sm:w-8 bg-primary rounded-full" />
              <span className="h-1 w-6 sm:w-8 bg-bg-soft rounded-full" />
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
                {t.subtitle}{" "}
                <span className="font-[600] text-section-title">{email}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-[14px] font-[500] text-section-title text-center">
                  {t.otpLabel}
                </label>
                <div className="flex justify-center gap-2 dir-ltr" dir="ltr">
                  {digits.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        inputsRef.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      onPaste={handlePaste}
                      className={`w-12 h-14 text-center text-[20px] font-[600] rounded-lg border ${
                        errorMessage
                          ? "border-red-500 focus:ring-red-500"
                          : "border-section-title/30 focus:border-primary focus:ring-primary"
                      } focus:ring-1 outline-none transition bg-transparent text-dark-brown`}
                    />
                  ))}
                </div>
                {errorMessage && (
                  <p className="text-[12px] font-[350] text-red-500 mt-2 text-center">
                    {errorMessage}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || digits.join("").length !== 6}
                className="w-full py-3.5 bg-primary hover:bg-dark-brown text-white font-[500] rounded-lg transition duration-200 text-[14px] shadow-sm disabled:opacity-50 mt-2"
              >
                {isLoading ? "..." : t.continueBtn}
              </button>
            </form>

            <p className="text-center text-[13px] font-[350] text-unselected mt-6">
              {t.resendPrompt}{" "}
              <button
                type="button"
                onClick={onResend}
                className="text-primary font-[600] hover:underline"
              >
                {t.resend}
              </button>
            </p>

            <p className="text-center text-[13px] font-[350] text-unselected mt-2">
              {t.backToLogin}{" "}
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
