"use client";
import Image from "next/image";
import { useI18n } from "@/src/i18n/context";

const filmReelsData = [
  {
    id: 1,
    sizeLabel: "DVDs",
    imageSrc: "/images/dvd1.png",
    imageAlt: "DVDs",
    sizeClass: "w-[90px] md:w-[90px] lg:w-[150px]",
    positionClass: "-mt-10 md:-mt-20 z-30"
  },
  {
    id: 2,
    sizeLabel: "Mini DVDs",
    imageSrc: "/images/dvd2.png",
    imageAlt: "Mini DVDs",
    sizeClass: "w-[50px] md:w-[70px] lg:w-[110px]",
    positionClass: "-mt-6 md:-mt-10 z-20"
  }
];

export default function DvdSection() {
  const { t } = useI18n();
  return (
    <div className="w-full py-12 max-w-7xl flex flex-col bg-white lg:flex-row items-center justify-between gap-14 lg:gap-30 overflow-visible px-20">
      <div className="w-full lg:w-1/2 z-10">
        <h2 className="text-primary text-[34px] sm:text-[42px] md:text-[52px] font-semibold leading-tight mb-5">
          {t.about.dvd.title}
        </h2>
        <p className="text-black/70 text-[15px] md:text-[17px] leading-relaxed max-w-xl">
          {t.about.dvd.description}
        </p>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-end relative space-y-4 md:space-y-6 lg:space-y-10">
        {filmReelsData.map((reel) => (
          <div key={reel.id} className={`relative flex items-center gap-3 md:gap-5 ${reel.positionClass}`}>
            <div className={`relative ${reel.sizeClass} flex-shrink-0 drop-shadow-[0_12px_20px_rgba(0,0,0,0.28)]`}>
              <Image
                src={reel.imageSrc}
                alt={reel.imageAlt}
                width={300}
                height={300}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
            <span className="text-black font-500 text-[10px] md:text-[14px] whitespace-nowrap">
              {reel.sizeLabel}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
