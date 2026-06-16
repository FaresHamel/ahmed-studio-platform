"use client";
import Image from "next/image";
import { useI18n } from "@/src/i18n/context";
import { isRTL } from "@/src/i18n/translations";

const dvdData = [
  { id: 1, imageSrc: "/images/dvd1.png", imageAlt: "DVDs",      labelEn: "DVDs",      labelAr: "أقراص DVD"      },
  { id: 2, imageSrc: "/images/dvd2.png", imageAlt: "Mini DVDs", labelEn: "Mini DVDs", labelAr: "أقراص DVD صغيرة" },
];

// Fixed image size — same for both discs
const IMG_SIZE = 150;

export default function DvdSection() {
  const { t, language } = useI18n();
  const isRtl = isRTL(language);

  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto w-full py-8 md:py-12 px-6 md:px-12 lg:px-20 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">

        {/* ══ TEXT ══ */}
        <div
          className={`w-full lg:w-1/2 flex flex-col ${
            isRtl ? "items-end text-right" : "items-start text-left"
          }`}
        >
          <h2 className="text-[#5C3A21] text-[26px] sm:text-[36px] md:text-[48px] font-semibold leading-tight mb-4 md:mb-5">
            {t.about.dvd.title}
          </h2>
          <p className="text-black/70 text-[14px] md:text-[17px] leading-relaxed max-w-xl">
            {t.about.dvd.description}
          </p>
        </div>
        <div
          className={`w-full lg:w-1/2 flex justify-center lg:justify-end ${
            isRtl ? "lg:pl-16" : "lg:pr-16"
          }`}
        >
          {/* Mobile — row of two discs */}
          <div className="flex lg:hidden flex-row items-end justify-center gap-8">
            {dvdData.map((disc) => (
              <div key={disc.id} className="flex flex-col items-center gap-2">
                <div
                  className="relative drop-shadow-[0_12px_20px_rgba(0,0,0,0.22)]"
                  style={{ width: 90, height: 90 }}
                >
                  <Image src={disc.imageSrc} alt={disc.imageAlt} fill sizes="90px" className="object-contain" priority />
                </div>
                <span className="text-black font-medium text-[12px] whitespace-nowrap">
                  {isRtl ? disc.labelAr : disc.labelEn}
                </span>
              </div>
            ))}
          </div>

          {/* Desktop — stacked column, 40px gap */}
          <div className="hidden lg:flex flex-col" style={{ gap: 40 }}>
            {dvdData.map((disc) => (
              <div
                key={disc.id}
                className={`flex items-center gap-5 ${isRtl ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className="relative flex-shrink-0 drop-shadow-[0_12px_20px_rgba(0,0,0,0.22)] transition-transform duration-300 hover:scale-105"
                  style={{ width: IMG_SIZE, height: IMG_SIZE }}
                >
                  <Image src={disc.imageSrc} alt={disc.imageAlt} fill sizes={`${IMG_SIZE}px`} className="object-contain" priority />
                </div>
                <span className="text-black font-medium text-[16px] whitespace-nowrap">
                  {isRtl ? disc.labelAr : disc.labelEn}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}