"use client";
import Image from "next/image";
import SideByTwoLayout from "@/src/components/layouts/SideByTwoLayout";
import { useI18n } from "@/src/i18n/context";

export default function CustomeAiSolution() {
  const { t } = useI18n();
  const ai = t.enhancement.aiSolution;
  return (
    <SideByTwoLayout
      imagePosition="right"
      gap="medium"
      margin="large"
      leftContent={
        <div className="flex flex-col items-start text-left">
          <h2 className="text-primary text-[18px] sm:text-[28px] md:text-5xl lg:text-6xl leading-tight font-[500] mb-8">{ai.title}</h2>
          <div className="space-y-6 text-black text-[15px] md:text-[16px] leading-relaxed">
            <p className="opacity-80">{ai.intro}</p>
            {ai.features.map((feature, i) => (
              <p key={i} className="text-gray-700">
                <strong className="text-black font-[700] block sm:inline">{feature.label} </strong>
                <span className="opacity-80">{feature.desc}</span>
              </p>
            ))}
          </div>
        </div>
      }
      rightContent={
        <div className="relative aspect-square w-full overflow-hidden rounded-[20px]">
          <Image src="/images/customAiSoltion.png" alt="The Possibilities Are Endless" fill className="object-cover" />
        </div>
      }
    />
  );
}
