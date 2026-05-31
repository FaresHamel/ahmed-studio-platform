"use client";
import Image from "next/image";
import SideByTwoLayout from "@/src/components/layouts/SideByTwoLayout";
import { useI18n } from "@/src/i18n/context";

export default function PossibilitiesSection() {
  const { t } = useI18n();
  const p = t.home.possibilities;
  return (
    <SideByTwoLayout
      imagePosition="left"
      gap="medium"
      margin="medium"
      leftContent={
        <div className="relative aspect-square w-full overflow-hidden rounded-[20px]">
          <Image src="/images/PossibilitiesImg.jpg" alt={p.titleLine1} fill className="object-cover" />
        </div>
      }
      rightContent={
        <div className="flex flex-col items-start">
          <h2 className="text-primary text-[28px] sm:text-[38px] md:text-5xl lg:text-6xl leading-tight font-[500]">
            {p.titleLine1} <br /> {p.titleLine2}
          </h2>
          <div className="mt-8 space-y-6 text-black text-[16px] md:text-lg leading-relaxed opacity-90">
            <p>{p.p1}</p>
            <p>{p.p2}</p>
          </div>
          <button className="mt-10 bg-primary text-white px-12 py-4 font-[400] rounded-lg hover:bg-primary/90 transition-all shadow-md">
            {p.cta}
          </button>
        </div>
      }
    />
  );
}
