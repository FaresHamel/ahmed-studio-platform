"use client";
import { useI18n } from "@/src/i18n/context";
import { isRTL } from "@/src/i18n/translations";
import Image from "next/image";

const BAND_HEIGHT = 380;
const CENTER = BAND_HEIGHT / 2; // 190

const COL_A_CENTER_X = 110;
const COL_B_CENTER_X = 310;

const colA = [
  {
    id: 1,
    src: "/images/tape-cassette.png",
    alt: "Cassette Tape",
    w: 140,
    h: 100,
    center: 0, // bleeds above
    rotate: 0,
    offsetX: 0
  },
  {
    id: 2,
    src: "/images/casset02.png",
    alt: "DAT Audio Cassette",
    w: 344,
    h: 220,
    center: CENTER,
    rotate: -22,
    offsetX: -26 // compensates for rotation visual drift
  },
  {
    id: 3,
    src: "/images/cassete.png",
    alt: "MC-60 Cassette",
    w: 244,
    h: 220,
    center: BAND_HEIGHT, // bleeds below
    rotate: 0,
    offsetX: 0
  }
];

const COL_B_GAP = 150;
const colB = [
  {
    id: 4,
    src: "/images/disc01.png",
    alt: "Vinyl Record",
    w: 180,
    h: 180,
    center: CENTER - COL_B_GAP / 2 // 115
  },
  {
    id: 5,
    src: "/images/disq02.png",
    alt: "Reel to Reel Tape",
    w: 140,
    h: 140,
    center: CENTER + COL_B_GAP / 2 // 265
  }
];

export default function AudioTapesSection() {
    const { t,language } = useI18n();
    const isRtl = isRTL(language);

  const posA = (item: (typeof colA)[0]) => {
    const appliedOffset = isRtl ? -item.offsetX : item.offsetX;
    const value = COL_A_CENTER_X - item.w / 2 + appliedOffset;
    return isRtl ? { right: value } : { left: value };
  };

  const posB = (item: (typeof colB)[0]) => {
    const value = COL_B_CENTER_X - item.w / 2;
    return isRtl ? { right: value } : { left: value };
  };

  return (
    <section
      className="w-full mt-40 mb-40"
      style={{ backgroundColor: "#F5EDE3" }}
    >
      <div className="w-full px-6 md:px-16 lg:px-24 py-12 md:py-16 lg:py-0 overflow-visible">
        <div
          className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16 overflow-visible"
          style={{ minHeight: BAND_HEIGHT }}
        >
          <div
            className={`w-full lg:w-[55%] flex items-center justify-center overflow-visible ${
              isRtl ? "lg:justify-end" : "lg:justify-start"
            }`}
          >
            {/* Mobile / Tablet — flex wrap row, no positioning needed */}
            <div className="flex lg:hidden flex-row flex-wrap justify-center gap-6 py-10">
              {[...colA, ...colB].map((item) => (
                <div
                  key={item.id}
                  className="relative drop-shadow-md transition-transform duration-300 hover:scale-105"
                  style={{ width: 110, height: 72 }}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="110px"
                    className="object-contain"
                    priority={item.id <= 2}
                  />
                </div>
              ))}
            </div>
            <div
              className="hidden lg:block relative overflow-visible flex-shrink-0"
              style={{ width: 420, height: BAND_HEIGHT }}
            >
              {/* Column A — 3 tapes */}
              {colA.map((item) => (
                <div
                  key={item.id}
                  className="absolute drop-shadow-[0_10px_20px_rgba(0,0,0,0.18)]"
                  style={{
                    width: item.w,
                    height: item.h,
                    top: item.center - item.h / 2,
                    ...posA(item),
                    transform: `rotate(${item.rotate}deg)`,
                    transition: "transform 0.3s ease"
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = `rotate(${item.rotate}deg) scale(1.05)`)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = `rotate(${item.rotate}deg) scale(1)`)
                  }
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes={`${item.w}px`}
                    className="object-contain"
                    priority
                  />
                </div>
              ))}

              {/* Column B — 2 round items */}
              {colB.map((item) => (
                <div
                  key={item.id}
                  className="absolute drop-shadow-[0_10px_20px_rgba(0,0,0,0.18)]"
                  style={{
                    width: item.w,
                    height: item.h,
                    top: item.center - item.h / 2,
                    ...posB(item),
                    transition: "transform 0.3s ease"
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes={`${item.w}px`}
                    className="object-contain"
                    priority
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ══ Text — title + description ══ */}
          <div className="w-full lg:w-[45%] flex flex-col justify-center text-start">
            <h2 className="text-[#5C3A21] text-[32px] sm:text-[40px] lg:text-[48px] font-bold leading-tight mb-4">
              {t.about.audioTapes.title}
            </h2>
            <p className="text-black/70 text-[15px] sm:text-[16px] lg:text-[18px] leading-relaxed max-w-xl">
                   {t.about.audioTapes.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

