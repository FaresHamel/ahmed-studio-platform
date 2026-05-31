"use client";
import Image from "next/image";
import NumberedSection from "@/src/components/sections/NumberedSection";
import { useI18n } from "@/src/i18n/context";

export default function StepsSection() {
  const { t } = useI18n();
  const s = t.order.steps;

  const step3Image = (
    <div className="flex justify-center items-center">
      <div className="relative w-full max-w-[550px] aspect-[4/3]">
        <Image src="/images/cardboard-box.png" alt="Shipping Box" fill className="object-contain z-10" />
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="w-[40%] h-auto opacity-90">
            <Image src="/images/logo-black.png" alt="Ahmed Studio Logo" width={250} height={120} className="object-contain" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full">
      <NumberedSection number={2} title={s.step2.title} description={s.step2.description} backgroundColor="bg-white" />
      <NumberedSection number={3} title={s.step3.title} description={s.step3.description} leftContent={step3Image} backgroundColor="bg-[#F7F1EC]" imagePosition="left" />
    </div>
  );
}
