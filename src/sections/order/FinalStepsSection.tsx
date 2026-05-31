"use client";
import Image from "next/image";
import { useI18n } from "@/src/i18n/context";

export default function FinalStepsSection() {
  const { t } = useI18n();
  const { step4, step5 } = t.order.finalSteps;
  return (
    <section className="py-16 md:py-24 px-6 md:px-20 lg:px-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-10 lg:gap-20">
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <div className="relative w-[80%] sm:w-[60%] lg:w-full max-w-[500px] aspect-video">
            <Image src="/images/howItWorkOrder.png" alt="Instant Access Preview" fill className="object-contain" priority />
          </div>
        </div>
        <div className="flex flex-col lg:w-1/2 space-y-16">
          <div className="flex flex-col items-start">
            <div className="flex items-start gap-4">
              <span className="text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-6xl leading-tight font-[500]">{step4.number}</span>
              <h2 className="text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-6xl leading-tight font-[500]">{step4.title}</h2>
            </div>
            <p className="text-black text-[16px] leading-relaxed opacity-90 mt-6 md:mt-8">{step4.description}</p>
          </div>
          <div className="flex flex-col items-start">
            <div className="flex items-start gap-4">
              <span className="text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-6xl leading-tight font-[500]">{step5.number}</span>
              <h2 className="text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-6xl leading-tight font-[500]">{step5.title}</h2>
            </div>
            <p className="text-black text-[16px] leading-relaxed opacity-90 mt-6 md:mt-8">{step5.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
