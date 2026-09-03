// "use client";
// import Image from "next/image";
// import { useI18n } from "@/i18n/context";
// import { isRTL } from "@/i18n/translations";

// export interface TapeItem {
//   id: number;
//   src: string;
//   alt: string;
//   w?: number; // Optional
//   h?: number; // Optional
//   scale?: number;
//   offsetY?: number; // px to nudge up (negative) or down (positive)
//   offsetX?: number;
// }

// const videoTapesData: TapeItem[] = [
//   {
//     id: 1,
//     src: "/images/video-other11.png",
//     alt: "Hi8 Video Tape",
//     scale: 0.9
//   },
//   {
//     id: 2,
//     src: "/images/video-other2.png",
//     alt: "Sony Betacam Tape",
//     scale: 0.6,
//     offsetY: 12
//   },
//   {
//     id: 3,
//     src: "/images/video-other1.png",
//     alt: "MP90 Camcorder Tape",
//     scale: 0.9
//   },
//   {
//     id: 4,
//     src: "/images/three07.png",
//     alt: "MiniDV Tape",
//     scale: 0.8
//     // offsetY: -6
//   },
//   {
//     id: 5,
//     src: "/images/three06.png",
//     alt: "Metal HG Video Tape",
//     scale: 1,
//     offsetY: -12
//   },
//   {
//     id: 6,
//     src: "/images/video-other3.png",
//     alt: "Siemens Compact Cassette",
//     scale: 0.9
//   },
//   {
//     id: 7,
//     src: "/images/video-minidv.png",
//     alt: "Sony DVCAM 34",
//     scale: 0.9,
//     offsetY: -8
//   },
//   {
//     id: 8,
//     src: "/images/three08.png",
//     alt: "Vintage Audio Open Reel",
//     scale: 0.8,
//     offsetY: 15
//   },
//   {
//     id: 10,
//     src: "/images/video-camcorder.png",
//     alt: "U-Matic Tape",
//     scale: 0.8,
//     offsetY: 15
//   },
//   {
//     id: 11,
//     src: "/images/video-dvd.png",
//     alt: "U-Matic Tape",
//     scale: 1.1
//   },
//   {
//     id: 12,
//     src: "/images/three09.png",
//     alt: "U-Matic Tape",
//     scale: 0.9,
//     offsetY: 8
//   },
//   {
//     id: 13,
//     src: "/images/video-vhs.png",
//     alt: "VHS Tape",
//     scale: 0.9,
//     offsetY: 18
//   }
// ];

// const CELL_WIDTH = 180;
// const CELL_HEIGHT = 140;

// function TapeImage({
//   item,
//   priority = false
// }: {
//   item: TapeItem;
//   priority?: boolean;
// }) {
//   const scale = item.scale ?? 1;
//   const offsetY = item.offsetY ?? 0;
//   const offsetX = item.offsetX ?? 0;

//   return (
//     <div
//       className="relative flex-shrink-0 flex items-center justify-center transition-transform duration-300 hover:scale-105 drop-shadow-[0_8px_15px_rgba(0,0,0,0.12)]"
//       style={{ width: CELL_WIDTH, height: CELL_HEIGHT }}
//     >
//       <Image
//         src={item.src}
//         alt={item.alt}
//         fill
//         sizes={`${CELL_WIDTH}px`}
//         className="object-contain"
//         priority={priority}
//         style={{
//           transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`
//         }}
//       />
//     </div>
//   );
// }

// export default function VideoTapesSection() {
//   const { t, language } = useI18n();
//   const isRtl = isRTL(language);

//   const row1 = videoTapesData.slice(0, 3);
//   const row2 = videoTapesData.slice(3, 7);
//   const row3 = videoTapesData.slice(7, 12);

//   const rowDir = isRtl ? "flex-row" : "flex-row";
//   const textAlign = isRtl ? "text-right" : "text-left";

//   // LTR: push image block slightly right for breathing room between text and images
//   // RTL: no extra margin needed (images are on the left, text on the right)
//   const imageBlockClass = isRtl ? "" : "ml-8";

//   return (
//     <section className="w-full bg-white py-10 md:py-16 px-6 md:px-12 lg:px-20">
//       <div className="max-w-7xl mx-auto">
//         {/* ══ MOBILE ══ */}
//         <div className="flex lg:hidden flex-col gap-6">
//           <h2
//             className={`text-[#5C3A21] text-[28px] sm:text-[36px] font-bold leading-tight ${textAlign}`}
//           >
//             {t.about.videoTapes.title}
//           </h2>
//           <p
//             className={`text-black/75 text-[15px] sm:text-[16px] leading-relaxed ${textAlign}`}
//           >
//             {t.about.videoTapes.description}
//           </p>
//           <div className="grid grid-cols-3 gap-4 mt-2">
//             {videoTapesData.map((item) => (
//               <div
//                 key={item.id}
//                 className="relative transition-transform duration-300 hover:scale-105 drop-shadow-[0_6px_12px_rgba(0,0,0,0.1)]"
//                 style={{ width: "100%", aspectRatio: `${item.w} / ${item.h}` }}
//               >
//                 <Image
//                   src={item.src}
//                   alt={item.alt}
//                   fill
//                   sizes="30vw"
//                   className="object-contain"
//                   priority={item.id <= 3}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ══ DESKTOP ══ */}
//         <div className="hidden lg:flex flex-col gap-6">
//           {/* Row 1 — title + 3 images */}
//           <div className={`flex ${rowDir} items-end gap-2`}>
//             <div className="flex-1 flex items-end pb-1">
//               <h2
//                 className={`text-[#5C3A21] text-[36px] xl:text-[48px] font-bold leading-tight ${textAlign}`}
//               >
//                 {t.about.videoTapes.title}
//               </h2>
//             </div>
//             <div
//               className={`flex ${rowDir} items-end gap-3 ${imageBlockClass}`}
//             >
//               {row1.map((item) => (
//                 <TapeImage key={item.id} item={item} priority />
//               ))}
//             </div>
//           </div>

//           {/* Row 2 — description + 4 images */}
//           <div className={`flex ${rowDir} items-center gap-2`}>
//             <div className="flex-1">
//               <p
//                 className={`text-black/75 text-[15px] xl:text-[17px] leading-relaxed ${textAlign}`}
//               >
//                 {t.about.videoTapes.description}
//               </p>
//             </div>
//             <div
//               className={`flex ${rowDir} items-center gap-3 ${imageBlockClass}`}
//             >
//               {row2.map((item) => (
//                 <TapeImage key={item.id} item={item} />
//               ))}
//             </div>
//           </div>

//           {/* Row 3 — 5 images, aligned with image columns above */}
//           <div className={`flex ${rowDir} gap-2`}>
//             <div className="flex-1" />
//             <div
//               className={`flex ${rowDir} items-center gap-3 ${imageBlockClass}`}
//             >
//               {row3.map((item) => (
//                 <TapeImage key={item.id} item={item} />
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";
import Image from "next/image";
import { useI18n } from "@/i18n/context";
import { isRTL } from "@/i18n/translations";

export interface TapeItem {
  id: number;
  src: string;
  alt: string;
  w?: number;
  h?: number;
}

const videoTapesData: TapeItem[] = [
  { id: 1, src: "/images/video-other11.png", alt: "Hi8 Video Tape" },
  { id: 2, src: "/images/video-other2.png", alt: "Sony Betacam Tape" },
  { id: 3, src: "/images/video-other1.png", alt: "MP90 Camcorder Tape" },
  { id: 4, src: "/images/three07.png", alt: "MiniDV Tape" },
  { id: 5, src: "/images/three06.png", alt: "Metal HG Video Tape" },
  { id: 6, src: "/images/video-other3.png", alt: "Siemens Compact Cassette" },
  { id: 7, src: "/images/video-minidv.png", alt: "Sony DVCAM 34" },
  { id: 8, src: "/images/three08.png", alt: "Vintage Audio Open Reel" },
  { id: 10, src: "/images/video-camcorder.png", alt: "U-Matic Tape" },
  { id: 11, src: "/images/video-dvd.png", alt: "Video DVD" },
  { id: 12, src: "/images/three09.png", alt: "Open Reel Tape" },
  { id: 13, src: "/images/video-vhs.png", alt: "VHS Tape" }
];

function TapeCard({
  item,
  priority = false
}: {
  item: TapeItem;
  priority?: boolean;
}) {
  return (
    <div className="group flex flex-col items-center rounded-xl border border-black/8 bg-white p-3 sm:p-4 transition-shadow duration-300 hover:shadow-md">
      <div className="relative w-full aspect-square rounded-lg bg-[#FFFFFF] overflow-hidden">
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes="(max-width: 640px) 30vw, (max-width: 1024px) 22vw, 160px"
          className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
          priority={priority}
        />
      </div>
      <p className="mt-2 text-center text-[12px] sm:text-[13px] text-black/60 leading-snug">
        {item.alt}
      </p>
    </div>
  );
}

export default function VideoTapesSection() {
  const { t, language } = useI18n();
  const isRtl = isRTL(language);
  const textAlign = isRtl ? "text-right" : "text-left";

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      className="w-full bg-white py-10 md:py-16 px-6 md:px-12 lg:px-20"
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-8 md:gap-10">
        {/* Header — centered, same on mobile and desktop */}
        <div
          className={`max-w-2xl mx-auto flex flex-col gap-3 ${
            isRtl ? "text-right md:text-center" : "text-left md:text-center"
          }`}
        >
          <h2 className="text-[#5C3A21] text-[28px] sm:text-[36px] lg:text-[42px] font-bold leading-tight">
            {t.about.videoTapes.title}
          </h2>
          <p className="text-black/70 text-[15px] sm:text-[16px] lg:text-[17px] leading-relaxed">
            {t.about.videoTapes.description}
          </p>
        </div>

        {/* Uniform card grid — same markup for mobile and desktop, just more columns as it widens */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {videoTapesData.map((item, idx) => (
            <TapeCard key={item.id} item={item} priority={idx < 4} />
          ))}
        </div>
      </div>
    </section>
  );
}