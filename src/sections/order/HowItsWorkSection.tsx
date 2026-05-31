"use client";
import Image from "next/image";
import SideByTwoLayout from "@/src/components/layouts/SideByTwoLayout";
import { useI18n } from "@/src/i18n/context";

export default function HowItsWorkSection() {
  const { t } = useI18n();
  const hw = t.order.howItWorks;
  return (
    <SideByTwoLayout
      imagePosition="left"
      gap="medium"
      margin="small"
      leftContent={
        <div className="relative aspect-square w-full overflow-hidden rounded-[20px]">
          <Image src="/images/howItWorkOrder.png" alt="How It Works" fill className="object-contain" />
        </div>
      }
      rightContent={
        <div className="flex flex-col items-start">
          <h2 className="text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-6xl leading-tight font-[500]">{hw.title}</h2>
          <p className="mt-6 md:mt-8 text-black text-[13px] sm:text-[15px] md:text-lg leading-relaxed">{hw.description}</p>
        </div>
      }
    />
  );
}
