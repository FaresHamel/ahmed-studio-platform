"use client";
import Image from "next/image";
import SideByTwoLayout from "@/src/components/layouts/SideByTwoLayout";
import Link from "next/link";
import { useI18n } from "@/src/i18n/context";

export default function ProfessionalSection() {
  const { t } = useI18n();
  const p = t.home.professional;
  return (
    <SideByTwoLayout
      imagePosition="right"
      reverseOnMobile={true}
      gap="medium"
      margin="large"
      leftContent={
        <div className="flex flex-col items-start">
          <h2 className="text-primary text-[26px] sm:text-[36px] md:text-5xl lg:text-6xl leading-tight font-[500]">
            {p.titleLine1} <br /> {p.titleLine2}
          </h2>
          <div className="mt-8 space-y-6 text-black text-[16px] md:text-lg leading-relaxed opacity-90">
            <p>{p.p1}</p>
            <p>{p.p2}</p>
            <p>{p.p3}</p>
          </div>
          <Link href="/enhancement" className="mt-10 bg-primary text-white px-12 py-4 font-[400] rounded-lg hover:bg-primary/90 transition-all shadow-md">
            {p.cta}
          </Link>
        </div>
      }
      rightContent={
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px] flex">
          <div className="relative flex-1 overflow-hidden h-full">
            <Image src="/images/before.jpg" alt={p.compressed} fill className="object-cover" />
            <div className="absolute top-6 left-6 z-20">
              <span className="text-white font-bold text-sm md:text-lg tracking-widest uppercase bg-black/30 px-3 py-1 rounded">{p.compressed}</span>
            </div>
          </div>
          <div className="w-[1px] h-full bg-white/30 z-30 shadow-sm" />
          <div className="relative flex-1 overflow-hidden h-full">
            <Image src="/images/after.jpg" alt={p.raw} fill className="object-cover" />
            <div className="absolute top-6 right-6 z-20">
              <span className="text-white font-bold text-sm md:text-lg tracking-widest uppercase bg-black/30 px-3 py-1 rounded">{p.raw}</span>
            </div>
          </div>
        </div>
      }
    />
  );
}
