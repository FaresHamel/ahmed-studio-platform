"use client";
import Image from "next/image";
import { useI18n } from "@/src/i18n/context";
import { isRTL } from "@/src/i18n/translations";

const CONTAINER_H = 420;

export default function PhotosSlidesSection() {
  const { t, language } = useI18n();
  const isRtl = isRTL(language);

  /*
    LTR (English): images LEFT  → order-1 | text RIGHT → order-2
    RTL (Arabic):  text LEFT    → order-1 | images RIGHT → order-2
  */

  return (
    <section className="mt-40 mb-40 w-full bg-[#F5EFEA] py-16 md:py-10 px-6 md:px-12 lg:px-20 overflow-visible">
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-20 overflow-visible">
        {/* ══ IMAGES ══ */}
        <div
          className={`w-full lg:w-1/2 overflow-visible ${
            isRtl ? "lg:order-2" : "lg:order-1"
          }`}
        >
          {/* Mobile */}
          <div className="flex lg:hidden flex-col items-center gap-6 py-6">
            <div className="relative w-[220px] h-[180px] drop-shadow-[0_12px_20px_rgba(0,0,0,0.18)] transition-transform duration-300 hover:rotate-2">
              <Image
                src="/images/slides-stack.png"
                alt="Printed Photos Stack"
                fill
                sizes="220px"
                className="object-contain"
                priority
              />
            </div>
            <div className="relative w-[200px] h-[180px] drop-shadow-[0_8px_15px_rgba(0,0,0,0.12)] transition-transform duration-300 hover:scale-105">
              <Image
                src="/images/slides-preview.png"
                alt="Color Slides Preview"
                fill
                sizes="200px"
                className="object-contain"
                priority
              />
            </div>
            <div className="relative w-[220px] h-[100px] drop-shadow-[0_12px_18px_rgba(0,0,0,0.2)] transition-transform duration-300 hover:-translate-y-1">
              <Image
                src="/images/slides-negative.png"
                alt="Negative Film Strips"
                fill
                sizes="220px"
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Desktop */}
          <div
            className="hidden lg:block relative w-full overflow-visible"
            style={{ height: CONTAINER_H }}
          >
            <div
              className="absolute drop-shadow-[0_12px_20px_rgba(0,0,0,0.18)] transition-transform duration-300 hover:rotate-2"
              style={{
                width: 220,
                height: 200,
                top: 20,
                ...(isRtl ? { right: 60 } : { left: 0 })
              }}
            >
              <Image
                src="/images/slides-stack.png"
                alt="Printed Photos Stack"
                fill
                sizes="220px"
                className="object-contain"
                priority
              />
            </div>
            <div
              className="absolute drop-shadow-[0_8px_15px_rgba(0,0,0,0.12)] transition-transform duration-300 hover:scale-105"
              style={{
                width: 190,
                height: 190,
                top: 10,
                ...(isRtl ? { right: 320 } : { left: 280 })
              }}
            >
              <Image
                src="/images/slides-preview.png"
                alt="Color Slides Preview"
                fill
                sizes="190px"
                className="object-contain"
                priority
              />
            </div>
            <div
              className="absolute drop-shadow-[0_12px_18px_rgba(0,0,0,0.2)] transition-transform duration-300 hover:-translate-y-1"
              style={{
                width: 230,
                height: 105,
                bottom: 20,
                ...(isRtl ? { right: 160 } : { left: 80 })
              }}
            >
              <Image
                src="/images/slides-negative.png"
                alt="Negative Film Strips"
                fill
                sizes="230px"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* ══ TEXT ══ */}
        <div
          className={`w-full lg:w-1/2 flex flex-col z-10 ${
            isRtl ? "text-right" : "text-left"
          }`}
        >
          <h2 className="text-[#5C3A21] text-[32px] sm:text-[40px] md:text-[48px] font-semibold leading-tight mb-4 md:mb-6">
            {t.about.photos.title}
          </h2>
          <p className="text-black/80 text-[14px] sm:text-[15px] lg:text-[16px] leading-relaxed max-w-xl">
            {t.about.photos.description}
          </p>
        </div>
      </div>
    </section>
  );
}
