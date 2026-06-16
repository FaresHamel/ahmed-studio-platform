"use client";
import Image from "next/image";
import { useI18n } from "@/src/i18n/context";
import { isRTL } from "@/src/i18n/translations";
import { useState } from "react";

const IMG_W = 133;
const IMG_H = 127;
const BAND_HEIGHT = 350;
const CENTER = BAND_HEIGHT / 2;

const images = [
  {
    id: 1,
    src: "/images/tapTratment02.png",
    alt: "Damaged VHS tape",
    center: 0
  },
  {
    id: 2,
    src: "/images/tapTratment01.png",
    alt: "Deteriorated tape reel",
    center: CENTER
  },
  {
    id: 3,
    src: "/images/tapTratment03.png",
    alt: "Broken cassette casing",
    center: BAND_HEIGHT
  }
];

export default function TapeTreatmentSection() {
  const { t, language } = useI18n();
  const isRtl = isRTL(language);
  const [expanded, setExpanded] = useState(false);

  const description: string = t.about.tapeTreatment.description;
  const SHORT_LIMIT = 120;
  const isLong = description.length > SHORT_LIMIT;
  const shortText = isLong
    ? description.slice(0, SHORT_LIMIT).trimEnd() + "…"
    : description;

  return (
    <section
      className="w-full overflow-visible mt-40 mb-40"
      style={{ backgroundColor: "#CDB096" }}
    >
      <div className="w-full px-6 md:px-16 lg:px-24 overflow-visible">
        <div
          className={`max-w-7xl mx-auto flex flex-col items-center gap-10 overflow-visible ${
            isRtl ? "lg:flex-row" : "lg:flex-row-reverse"
          } lg:gap-16`}
          style={{ minHeight: BAND_HEIGHT }}
        >
          {/* ══ IMAGES ══ */}
          <div
            className={`w-full lg:w-[45%] flex items-center overflow-visible ${
              isRtl ? "lg:order-2 justify-end" : "lg:order-1 justify-start"
            }`}
          >
            {/* Mobile — horizontal row, centered */}
            <div className="flex lg:hidden flex-row items-center justify-center gap-4 py-6">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="relative flex-shrink-0 drop-shadow-[0_8px_16px_rgba(0,0,0,0.2)] transition-transform duration-300 hover:scale-105"
                  style={{
                    width: Math.round(IMG_W * 0.6),
                    height: Math.round(IMG_H * 0.6)
                  }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="80px"
                    className="object-contain"
                    priority
                  />
                </div>
              ))}
            </div>

            {/* Desktop — absolute stack, bleed top & bottom */}
            <div
              className="hidden lg:block relative overflow-visible flex-shrink-0"
              style={{ width: IMG_W, height: BAND_HEIGHT }}
            >
              {images.map((img) => (
                <div
                  key={img.id}
                  className="absolute drop-shadow-[0_10px_20px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:scale-105"
                  style={{
                    width: IMG_W,
                    height: IMG_H,
                    top: img.center - IMG_H / 2,
                    ...(isRtl ? { right: 0 } : { left: 0 })
                  }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes={`${IMG_W}px`}
                    className="object-contain"
                    priority
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ══ TEXT ══ */}
          <div
            className={`w-full lg:w-[55%] flex flex-col justify-center ${
              isRtl ? "text-right" : "text-left"
            }`}
          >
            <h2 className="text-[#5C3A21] text-[32px] sm:text-[40px] lg:text-[48px] font-semibold leading-tight mb-4 md:mb-6">
              {t.about.tapeTreatment.title}
            </h2>

            {/* Desktop — always full */}
            <p className="hidden lg:block text-black/80 text-[14px] sm:text-[15px] lg:text-[17px] leading-relaxed max-w-xl">
              {description}
            </p>

            {/* Mobile — truncated with read more / read less inline */}
            <p className="lg:hidden text-black/80 text-[13px] leading-relaxed max-w-xl">
              {expanded ? description : shortText}
              {isLong && (
                <span
                  onClick={() => setExpanded(!expanded)}
                  className="ml-1 text-[#5C3A21] font-semibold cursor-pointer"
                >
                  {expanded
                    ? isRtl
                      ? " اقرأ أقل"
                      : " Read less"
                    : isRtl
                    ? " اقرأ المزيد"
                    : " Read more"}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
