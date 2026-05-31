"use client";
import Image from "next/image";
import { useI18n } from "@/src/i18n/context";

export default function HeroServicesSection() {
  const { t } = useI18n();
  const h = t.services.hero;
  return (
    <div className="relative w-full h-[55vh] sm:h-[55vh] md:h-[80vh] mt-4 overflow-hidden rounded-[10px]">
      <div className="absolute inset-0">
        <Image src="/images/heroServicesBg.png" alt="Hero" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className="relative z-10 h-full flex items-center justify-start px-4 sm:px-8 md:px-16">
        <div className="flex flex-col items-center max-w-4xl">
          <h1 className="text-white leading-tight text-[26px] sm:text-4xl md:text-6xl lg:text-7xl max-w-3xl">
            {h.title}
            <br />
            <span className="text-white text-[26px] sm:text-4xl md:text-6xl lg:text-7xl">{h.titleHighlight}</span>
          </h1>
          <p className="mt-4 px-[5px] sm:mt-6 text-white/90 leading-relaxed max-w-2xl text-[13px] sm:text-base md:text-xl">{h.description}</p>
        </div>
      </div>
    </div>
  );
}
