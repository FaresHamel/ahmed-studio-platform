"use client";
import Image from "next/image";
import { useI18n } from "@/src/i18n/context";

const IMAGES_MAP = [
  "/images/boxdelivery.jpg",
  "/images/watchTv.png",
  "/images/city.jpg"
];

export default function FeaturesSection() {
  const { t } = useI18n();
  const sectionsData = t.differences.features.sections || [];

  return (
    <div className="max-w-[1170px] mx-auto px-4 mt-12 md:mt-24 space-y-16 md:space-y-24 mb-16 md:mb-20">
      {sectionsData.map(
        (
          section: { badge: string; heading: string; body: string },
          idx: number
        ) => {
          const isReversed = idx % 2 !== 0;

          return (
            <section
              key={idx}
              className={`flex flex-col lg:flex-row items-center gap-8 md:gap-16 lg:gap-20 ${
                isReversed ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Image Box Wrapper Container */}
              <div className="relative w-full lg:w-[470px] shrink-0 rounded-2xl shadow-lg h-[260px] sm:h-[350px] md:h-[420px] lg:h-[480px]">
                <Image
                  src={IMAGES_MAP[idx] || "/images/boxdelivery.jpg"}
                  alt="Feature illustration asset"
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>

              {/* Structured Text Alignment Layer Box */}
              <div className="flex-1 min-w-0 flex flex-col items-center lg:items-start text-center lg:text-start">
                <span className="bg-[#F7F1EC] text-[#77510A] text-xs uppercase font-bold tracking-wider px-3 py-1.5 rounded-md mb-3 md:mb-4 inline-block self-center lg:self-start">
                  {section.badge}
                </span>
                <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-semibold text-[#77510A] leading-tight mb-4 md:mb-6 w-full">
                  {section.heading}
                </h2>
                <p className="text-sm md:text-base lg:text-lg text-[#3C3C3C] leading-relaxed text-start w-full opacity-90">
                  {section.body}
                </p>
              </div>
            </section>
          );
        }
      )}
    </div>
  );
}
