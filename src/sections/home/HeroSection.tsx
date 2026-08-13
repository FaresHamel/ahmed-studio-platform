"use client";
import { useI18n } from "@/i18n/context";
import Image from "next/image";

export default function HeroSection() {
  const { t } = useI18n();
  const h = t.ourLab.hero;
  return (
    <div
      className={`relative w-full h-[55vh] sm:h-[65vh] md:h-[90vh] mt-4 overflow-hidden rounded-[10px] pt-10`}
    >
      <div className="absolute inset-0">
        <Image
          src="/images/hero.png"
          alt="Hero"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className="relative z-10 h-full flex items-center justify-center md:px-16 text-center">
        <div className="flex flex-col items-center max-w-4xl p-4 sm:p-6 md:p-0">
          <h1 className="text-white leading-tight text-[26px] sm:text-4xl md:text-6xl lg:text-7xl max-w-3xl">
            {t.home.hero.title}

            <br />
            <span className="text-white"> {t.home.hero.titleHighlight}</span>
          </h1>
          <p className="mt-4 sm:mt-6 text-white/90 leading-relaxed max-w-2xl text-[13px] sm:text-base md:text-xl">
            {t.home.hero.description}
          </p>
        </div>
      </div>
    </div>
  );
}

