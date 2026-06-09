"use client";
import { useI18n } from "@/src/i18n/context";

export default function CoreServicesServicesSections() {
  const { t } = useI18n();
  const cs = t.services.coreServices;

  return (
    <div className="flex flex-col items-center mt-10 md:mt-15 px-4 w-full">
      <div className="text-center mb-12 md:mb-16 max-w-3xl w-full">
        <h2 className="text-primary text-[26px] sm:text-[30px] md:text-[35px] lg:text-[40px] leading-tight font-[500] text-center mb-6 md:mb-8 w-full">
          {cs.title}
        </h2>
        <p className="text-black text-[14px] sm:text-[15px] md:text-[16px] text-start leading-relaxed opacity-90 mx-auto w-full">
          {cs.description}
        </p>
      </div>
    </div>
  );
}
