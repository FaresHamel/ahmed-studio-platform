"use client";

import Image from "next/image";
import { useI18n } from "@/src/i18n/context";
import { isRTL } from "@/src/i18n/translations";

// ── extended type with per-image natural dimensions ───────────────────────────
interface TapeItem {
  id: number;
  src: string;
  alt: string;
  w: number;
  h: number;
  resizeMode: string;
}

/*
  Sizes chosen to respect each image's natural aspect ratio
  while keeping a consistent visual height of ~100px per row.
  Adjust w/h here if your actual images differ.
*/
const videoTapesData: TapeItem[] = [
  // Row 1 — 3 images (beside title)
  {
    id: 1,
    src: "/images/video-other11.png",
    alt: "Hi8 Video Tape",
    w: 155,
    h: 118,
    resizeMode: "object-contain"
  },
  {
    id: 2,
    src: "/images/video-other3.png",
    alt: "Sony Betacam Tape",
    w: 145,
    h: 100,
    resizeMode: "object-center"
  },
  {
    id: 3,
    src: "/images/video-other1.png",
    alt: "MP90 Camcorder Tape",
    w: 200,
    h: 100,
    resizeMode: "object-cover"
  },
  // Row 2 — 4 images (beside description)
  {
    id: 4,
    src: "/images/three07.png",
    alt: "MiniDV Tape",
    w: 130,
    h: 100,
    resizeMode: "object-center"
  },
  {
    id: 5,
    src: "/images/three06.png",
    alt: "Metal HG Video Tape",
    w: 185,
    h: 118,
    resizeMode: "object-center"
  },
  {
    id: 6,
    src: "/images/video-other2.png",
    alt: "Siemens Compact Cassette",
    w: 185,
    h: 118,
    resizeMode: "object-center"
  },
  {
    id: 7,
    src: "/images/video-minidv.png",
    alt: "Sony DVCAM 34",
    w: 130,
    h: 100,
    resizeMode: "object-center"
  },
  // Row 3 — 5 images (full bottom row)
  {
    id: 8,
    src: "/images/three08.png",
    alt: "Vintage Audio Open Reel",
    w: 100,
    h: 100,
    resizeMode: "object-center"
  },
  {
    id: 10,
    src: "/images/video-camcorder.png",
    alt: "U-Matic Tape",
    w: 185,
    h: 118,
    resizeMode: "object-center"
  },
  {
    id: 11,
    src: "/images/video-dvd.png",
    alt: "U-Matic Tape",
    w: 185,
    h: 118,
    resizeMode: "object-center"
  },
  {
    id: 12,
    src: "/images/three09.png",
    alt: "U-Matic Tape",
    w: 185,
    h: 118,
    resizeMode: "object-center"
  },
  {
    id: 13,
    src: "/images/video-vhs.png",
    alt: "VHS Tape",
    w: 145,
    h: 122,
    resizeMode: "object-cover"
  }
];

// ── image cell — uses each item's own w/h ────────────────────────────────────
function TapeImage({
  item,
  priority = false
}: {
  item: TapeItem;
  priority?: boolean;
}) {
  return (
    <div
      className="relative flex-shrink-0 transition-transform duration-300 hover:scale-105 drop-shadow-[0_8px_15px_rgba(0,0,0,0.12)]"
      style={{ width: item.w, height: item.h }}
    >
      <Image
        src={item.src}
        alt={item.alt}
        fill
        sizes={`${item.w}px`}
        className="object-contain"
        priority={priority}
      />
    </div>
  );
}

export default function VideoTapesSection() {
  const { t, language } = useI18n();
  const isRtl = isRTL(language);

  const row1 = videoTapesData.slice(0, 3);
  const row2 = videoTapesData.slice(3, 7);
  const row3 = videoTapesData.slice(7, 12);

  const rowDir = isRtl ? "flex-row" : "flex-row";
  const textAlign = isRtl ? "text-right" : "text-left";

  // LTR: push image block slightly right for breathing room between text and images
  // RTL: no extra margin needed (images are on the left, text on the right)
  const imageBlockClass = isRtl ? "" : "ml-8";

  return (
    <section className="w-full bg-white py-10 md:py-16 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* ══ MOBILE ══ */}
        <div className="flex lg:hidden flex-col gap-6">
          <h2
            className={`text-[#5C3A21] text-[28px] sm:text-[36px] font-bold leading-tight ${textAlign}`}
          >
            {t.about.videoTapes.title}
          </h2>
          <p
            className={`text-black/75 text-[15px] sm:text-[16px] leading-relaxed ${textAlign}`}
          >
            {t.about.videoTapes.description}
          </p>
          <div className="grid grid-cols-3 gap-4 mt-2">
            {videoTapesData.map((item) => (
              <div
                key={item.id}
                className="relative transition-transform duration-300 hover:scale-105 drop-shadow-[0_6px_12px_rgba(0,0,0,0.1)]"
                style={{ width: "100%", aspectRatio: `${item.w} / ${item.h}` }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="30vw"
                  className="object-contain"
                  priority={item.id <= 3}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ══ DESKTOP ══ */}
        <div className="hidden lg:flex flex-col gap-6">
          {/* Row 1 — title + 3 images */}
          <div className={`flex ${rowDir} items-end gap-2`}>
            <div className="flex-1 flex items-end pb-1">
              <h2
                className={`text-[#5C3A21] text-[36px] xl:text-[48px] font-bold leading-tight ${textAlign}`}
              >
                {t.about.videoTapes.title}
              </h2>
            </div>
            <div
              className={`flex ${rowDir} items-end gap-3 ${imageBlockClass}`}
            >
              {row1.map((item) => (
                <TapeImage key={item.id} item={item} priority />
              ))}
            </div>
          </div>

          {/* Row 2 — description + 4 images */}
          <div className={`flex ${rowDir} items-center gap-2`}>
            <div className="flex-1">
              <p
                className={`text-black/75 text-[15px] xl:text-[17px] leading-relaxed ${textAlign}`}
              >
                {t.about.videoTapes.description}
              </p>
            </div>
            <div
              className={`flex ${rowDir} items-center gap-3 ${imageBlockClass}`}
            >
              {row2.map((item) => (
                <TapeImage key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Row 3 — 5 images, aligned with image columns above */}
          <div className={`flex ${rowDir} gap-2`}>
            <div className="flex-1" />
            <div
              className={`flex ${rowDir} items-center gap-3 ${imageBlockClass}`}
            >
              {row3.map((item) => (
                <TapeImage key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}