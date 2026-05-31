"use client";
import Image from "next/image";
import SideByTwoLayout from "@/src/components/layouts/SideByTwoLayout";
import { useI18n } from "@/src/i18n/context";

export default function CloudSection() {
  const { t } = useI18n();
  const c = t.home.cloud;
  return (
    <SideByTwoLayout
      imagePosition="left"
      gap="medium"
      margin="medium"
      leftContent={
        <div className="relative aspect-square w-full overflow-hidden rounded-[10px]">
          <Image src="/images/setUpDesktop.jpg" alt="From your attic to our app" fill className="object-cover" />
        </div>
      }
      rightContent={
        <div className="flex flex-col items-start">
          <h2 className="text-primary text-[26px] sm:text-[36px] md:text-5xl lg:text-6xl leading-tight font-[500]">
            {c.titleLine1} <br /> {c.titleLine2}
          </h2>
          <p className="mt-8 text-black text-[400] text-[16px] leading-relaxed opacity-90">{c.description}</p>
          <button className="mt-10 bg-primary text-white px-12 py-4 font-bold rounded-lg hover:bg-primary/90 transition-all shadow-md">
            {c.cta}
          </button>
        </div>
      }
    />
  );
}
