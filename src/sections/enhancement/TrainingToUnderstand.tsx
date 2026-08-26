"use client";
import Image from "next/image";
import SideByTwoLayout from "@/components/layouts/SideByTwoLayout";
import { useI18n } from "@/i18n/context";

export default function TrainingToUnderstand() {
  const { t } = useI18n();
  const tr = t.enhancement.training;
  return (
    <SideByTwoLayout
      imagePosition="left"
      gap="medium"
      margin="large"
      leftContent={
        <div className="relative aspect-square w-full  rounded-[40px]">
          <Image
            src="/images/enhancmentlastpicture.jpg"
            alt="The Possibilities Are Endless"
            fill
            className="object-cover rounded-[30px] object-center"
          />
        </div>
      }
      rightContent={
        /* FIXED: Changed text alignments to text-start and adjusted sizes for mobile devices */
        <div className="flex flex-col items-center lg:items-start text-center lg:text-start w-full">
          <h2 className="text-primary text-[26px] sm:text-[28px] md:text-5xl lg:text-6xl leading-tight font-[500] mb-4 md:mb-8 w-full">
            {tr.title}
          </h2>
          <div className="space-y-6 text-black text-[14px] md:text-[16px] leading-relaxed text-start w-full">
            <p className="opacity-80">{tr.intro}</p>
            {tr.features.map((feature, i) => (
              <p key={i} className="text-gray-700">
                <strong className="text-black font-[700] block sm:inline">
                  {feature.label}{" "}
                </strong>
                <span className="opacity-80">{feature.desc}</span>
              </p>
            ))}
          </div>
        </div>
      }
    />
  );
}
