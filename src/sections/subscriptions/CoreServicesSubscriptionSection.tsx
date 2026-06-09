"use client";
import { useI18n } from "@/src/i18n/context";

export default function CoreServicesSubscriptionSection() {
  const { t } = useI18n();
  const cs = t.subscriptions.coreServices;

  return (
    <div className="flex flex-col items-center mt-10 md:mt-15">
      <div className="text-center mb-8 md:mb-16">
        <h2 className="text-primary text-[24px] sm:text-[30px] lg:text-[40px] leading-tight font-[500] text-center mb-6 md:mb-8">
          {cs.titleLine1}
          <br /> {cs.titleLine2}
        </h2>
        <p className="text-black text-[14px] sm:text-[15px] md:text-[16px] text-center md:text-left leading-relaxed opacity-90 max-w-3xl mx-auto">
          {cs.description}
        </p>
      </div>
    </div>
  );
}
