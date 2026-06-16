"use client";
import { useI18n } from "@/src/i18n/context";
import { isRTL } from "@/src/i18n/translations";
import Image from "next/image";


const LARGEST_REEL = 230;
const REEL_CENTER_X = LARGEST_REEL / 2; // 115px
const LABEL_LEFT = LARGEST_REEL + 24; // 254px — fixed column for labels
const BAND_HEIGHT = 420;
const CENTER = BAND_HEIGHT / 2; // 210px

const reels = [
  {
    id: 1,
    src: "/images/film-35mm.png",
    alt: "35mm Movie Film Reel",
    labelIndex: 0,
    size: 230,
    center: CENTER - 190, // bleeds above
    mobileSize: 96,
    label: "35mm"
  },
  {
    id: 2,
    src: "/images/film-16mm.png",
    alt: "16mm Movie Film Reel",
    labelIndex: 1,
    size: 165,
    center: CENTER,
    mobileSize: 72,
    label: "16mm"
  },
  {
    id: 3,
    src: "/images/film-8mm.png",
    alt: "8mm Movie Film Reel",
    labelIndex: 2,
    size: 115,
    center: CENTER + 180,
    mobileSize: 52,
    label: "8mm"
  }
];

export default function MovieFilmsSection() {
  const {t, language } = useI18n();

  const isRtl = isRTL(language);


  return (
    <section className="w-full bg-white">
      <div
        className="w-full px-6 md:px-16 lg:px-24 py-12 md:py-16 lg:py-0 overflow-visible"
        style={{ backgroundColor: "#CDB096" }}
      >
        <div
          className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center overflow-visible"
          style={{ minHeight: BAND_HEIGHT }}
        >
          {/* ── Text ── */}
          <div
            className={`w-full lg:w-[45%] flex flex-col justify-center text-start ${
              isRtl ? "lg:ml-16" : ""
            }`}
          >
            <h2 className="text-[#5C3A21] text-[32px] sm:text-[40px] lg:text-[48px] font-bold leading-tight mb-4">
              {t.about.movieFilms.title}
            </h2>
            <p className="text-black/70 text-[15px] sm:text-[16px] lg:text-[18px] leading-relaxed max-w-xl">
              {t.about.movieFilms.description}
            </p>
          </div>

          {/* ── Reels ── */}
          <div className="w-full lg:w-[55%] flex items-center justify-center lg:justify-end overflow-visible">
            {/* Mobile / Tablet — bottom-aligned row, label below each reel */}
            <div className="flex lg:hidden flex-row items-end justify-center gap-8 py-10">
              {reels.map((reel) => (
                <div key={reel.id} className="flex flex-col items-center gap-2">
                  <div
                    className="relative drop-shadow-md flex-shrink-0"
                    style={{ width: reel.mobileSize, height: reel.mobileSize }}
                  >
                    <Image
                      src={reel.src}
                      alt={reel.alt}
                      fill
                      sizes={`${reel.mobileSize}px`}
                      className="object-contain"
                      priority
                    />
                  </div>
                  <span className="text-black font-bold text-sm whitespace-nowrap">
                    {reel.label}
                  </span>
                </div>
              ))}
            </div>
            <div
              className="hidden lg:block relative overflow-visible flex-shrink-0"
              style={{ width: LABEL_LEFT + 80, height: BAND_HEIGHT }}
            >
              {reels.map((reel) => {
                const reelTop = reel.center - reel.size / 2;
                const labelTop = reel.center - 13; // vertically center label on reel
                const reelLeft = REEL_CENTER_X - reel.size / 2; // ← axis alignment

                // RTL: labels appear to the left (use `right`), reels flip via container
                const labelPos =  { left: LABEL_LEFT };

                return (
                  <div key={reel.id} className="overflow-visible">
                    {/* Reel — centered on shared REEL_CENTER_X axis */}
                    <div
                      className="absolute transition-transform duration-300 hover:scale-105 drop-shadow-[0_12px_24px_rgba(0,0,0,0.25)]"
                      style={{
                        width: reel.size,
                        height: reel.size,
                        top: reelTop,
                        left: reelLeft
                      }}
                    >
                      <Image
                        src={reel.src}
                        alt={reel.alt}
                        fill
                        sizes={`${reel.size}px`}
                        className="object-contain"
                        priority
                      />
                    </div>

                    {/* Label — all share same horizontal position */}
                    <span
                      className="absolute text-black font-bold text-xl whitespace-nowrap"
                      style={{ top: labelTop, ...labelPos }}
                    >
                      {reel.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
