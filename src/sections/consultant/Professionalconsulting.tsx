"use client";
import Image from "next/image";
import { useI18n } from "@/src/i18n/context";

export default function ProfessionalConsulting({ imageUrl = "/images/professional-consulting.jpg" }: { imageUrl?: string }) {
  const { t } = useI18n();
  const pc = t.consultant.professionalConsulting;
  return (
    <section className="w-full py-12 md:py-20 lg:py-24 bg-white">
      <div className="relative w-full min-h-[460px] md:min-h-0 md:h-[450px] lg:h-[600px] rounded-xl md:rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between">
        <div className="absolute inset-0 z-0">
          <Image
            src={imageUrl}
            alt="Professional Consulting"
            fill
            className="object-cover"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80 md:bg-gradient-to-r md:from-black/70 md:to-black/40" />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-6 py-10 md:p-10 lg:p-12 h-full min-h-[460px] md:min-h-0">
          <div className="max-w-2xl">
            <h2 className="text-white text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight font-bold mb-3 md:mb-6">
              {pc.title} <br /> {pc.subtitle}
            </h2>
            <p className="text-white/90 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed max-w-xl">
              {pc.description}
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-lg md:rounded-xl px-4 md:px-8 py-3 md:py-5 w-fit mt-6 md:mt-0">
            <div className="flex items-center gap-2">
              <span className="text-gray-700 text-xs md:text-base font-medium">
                📅 {pc.statLabel}{" "}
                <span className="text-primary font-bold">{pc.statValue}</span>
              </span>
            </div>
            <span className="text-gray-600 text-xs hidden sm:inline">
              {pc.statSuffix}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
