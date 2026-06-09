"use client";

import { useState } from "react";
import Image from "next/image";
import { useI18n } from "@/src/i18n/context";

const filmReelsData = [
  {
    id: 1,
    imageSrc: "/images/tapTratment02.png",
    imageAlt: "35mm Movie Film Reel",
    sizeClass: "w-[75px] sm:w-[90px] lg:w-[150px]",
    positionClass: "z-30"
  },
  {
    id: 2,
    imageSrc: "/images/tapTratment01.png",
    imageAlt: "16mm Movie Film Reel",
    sizeClass: "w-[75px] sm:w-[90px] lg:w-[150px]",
    positionClass: "z-20"
  },
  {
    id: 3,
    imageSrc: "/images/tapTratment03.png",
    imageAlt: "8mm Movie Film Reel",
    sizeClass: "w-[75px] sm:w-[90px] lg:w-[150px]",
    positionClass: "z-10"
  }
];

export default function TapTratmentSections() {
  const { t } = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);

  const fullDescription = t.about.tapeTreatment.description || "";
  const maxLength = 160;
  const shouldTruncate = fullDescription.length > maxLength;

  const displayedDescription =
    !isExpanded && shouldTruncate
      ? `${fullDescription.slice(0, maxLength)}...`
      : fullDescription;

  return (
    <section className="max-w-7xl mx-auto bg-[#F7F1EC] my-6 sm:my-16 md:my-[100px] w-full overflow-visible">
      <div className="w-full py-8 md:py-12 max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-30 overflow-visible px-4 md:px-12 lg:px-20">
        {/* Film Reels Row Layout on Mobile / Stacked on Desktop */}
        <div className="w-full lg:w-1/2 flex flex-row lg:flex-col items-center justify-center lg:items-start relative gap-4 sm:gap-6 lg:gap-0 lg:space-y-28">
          {filmReelsData.map((reel) => (
            <div
              key={reel.id}
              className={`relative flex items-center ${reel.positionClass}`}
            >
              <div
                className={`relative ${reel.sizeClass} flex-shrink-0 drop-shadow-[0_8px_15px_rgba(0,0,0,0.18)] lg:drop-shadow-[0_12px_20px_rgba(0,0,0,0.28)]`}
              >
                <Image
                  src={reel.imageSrc}
                  alt={reel.imageAlt}
                  width={300}
                  height={300}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>
            </div>
          ))}
        </div>

        {/* Text Content Container */}
        <div className="w-full lg:w-1/2 z-10 flex flex-col items-center lg:items-start text-center lg:text-start">
          <h2 className="text-primary text-[26px] sm:text-[36px] md:text-[52px] font-semibold leading-tight mb-4 md:mb-5 w-full">
            {t.about.tapeTreatment.title}
          </h2>

          <p className="text-black/70 text-[14px] md:text-[17px] leading-relaxed max-w-xl m-0 p-0">
            {displayedDescription}

            {shouldTruncate && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-primary font-bold ml-1.5 mr-1.5 hover:underline inline-block focus:outline-none text-[13px] md:text-[16px]"
              >
                {isExpanded
                  ? t.cloudStorage?.about.readLess 
                  : t.cloudStorage?.about.readMore}
              </button>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
