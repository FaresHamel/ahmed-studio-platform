"use client";
import { useI18n } from "@/src/i18n/context";

export default function CoreServicesServicesSections() {
  const { t } = useI18n();
  const cs = t.services.coreServices;
  return (
    <div className="flex flex-col items-center mt-15">
      <div className="text-center mb-16">
        <h2 className="text-primary text-[26px] sm:text-[30px] md:text-[30px] lg:text-[40px] leading-tight font-[500] text-center mb-16">
          {cs.title}
        </h2>
        <p className="text-black text-[14px] sm:text-[15px] md:text-[16px] text-left leading-relaxed opacity-90 max-w-3xl">
          {cs.description}
        </p>
      </div>
    </div>
  );
}
