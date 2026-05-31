"use client";
import Image from "next/image";
import { useI18n } from "@/src/i18n/context";

export default function ProfessionalConsulting({ imageUrl = "/images/professional-consulting.jpg" }: { imageUrl?: string }) {
  const { t } = useI18n();
  const pc = t.consultant.professionalConsulting;
  return (
    <section className="w-full py-12 md:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="relative w-full aspect-video md:aspect-auto md:h-[450px] lg:h-[500px] rounded-3xl overflow-hidden shadow-xl">
          <Image src={imageUrl} alt="Professional Consulting" fill className="object-cover" priority={false} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
          <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10 lg:p-12">
            <div className="max-w-2xl">
              <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight font-bold mb-4 md:mb-6">
                {pc.title} <br /> {pc.subtitle}
              </h2>
              <p className="text-white/90 text-sm md:text-base lg:text-lg leading-relaxed max-w-xl">{pc.description}</p>
            </div>
            <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-xl px-6 md:px-8 py-4 md:py-5 w-fit">
              <div className="flex items-center gap-2">
                <span className="text-gray-700 text-sm md:text-base font-medium">
                  📅 {pc.statLabel}{" "}
                  <span className="text-primary font-bold">{pc.statValue}</span>
                </span>
              </div>
              <span className="text-gray-600 text-sm hidden sm:inline">{pc.statSuffix}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
