"use client";
import Link from "next/link";
import { useI18n } from "@/src/i18n/context";

export default function MoreServicesPricesSection() {
  const { t } = useI18n();
  const ms = t.about.moreServices;
  return (
    <section className="w-full bg-white py-16 md:py-24 px-6 md:px-12 lg:px-20 flex items-center justify-center overflow-visible">
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center text-center">
        <h2 className="text-black text-[28px] sm:text-[34px] md:text-[40px] font-[600] leading-tight mb-6 md:mb-8">
          {ms.title}
        </h2>
        <div className="w-full flex flex-col gap-6 mb-10 md:mb-12">
          <p className="text-black text-[14px] sm:text-[15px] md:text-[16px] leading-relaxed opacity-80 max-w-3xl mx-auto">
            {ms.p1}
          </p>
          <p className="text-black text-[14px] sm:text-[15px] md:text-[16px] leading-relaxed opacity-80 max-w-3xl mx-auto">
            {ms.p2}
          </p>
        </div>
        <Link
          href="https://ahmad-studio.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center bg-[#84634B] hover:bg-[#6F503A] text-white font-[500] text-[14px] sm:text-[16px] px-6 py-3 sm:px-10 sm:py-4 rounded-lg shadow-[0_4px_14px_rgba(132,99,75,0.25)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
        >
          {ms.cta}
        </Link>
      </div>
    </section>
  );
}
