"use client";
import Image from "next/image";
import { useI18n } from "@/src/i18n/context";

const filmReelsData = [
  { id: 1, imageSrc: "/images/tapTratment02.png", imageAlt: "35mm Movie Film Reel", sizeClass: "w-[90px] md:w-[90px] lg:w-[150px]", positionClass: "-mt-10 md:-mt-20 z-30" },
  { id: 2, imageSrc: "/images/tapTratment01.png", imageAlt: "16mm Movie Film Reel", sizeClass: "w-[90px] md:w-[90px] lg:w-[150px]", positionClass: "-mt-6 md:-mt-10 z-20" },
  { id: 3, imageSrc: "/images/tapTratment03.png", imageAlt: "8mm Movie Film Reel", sizeClass: "w-[90px] md:w-[90px] lg:w-[150px]", positionClass: "-mt-6 md:-mt-10 -mb-10 md:-mb-20 z-10" }
];

export default function TapTratmentSections() {
  const { t } = useI18n();
  return (
    <section className="max-w-7xl mx-auto bg-[#F7F1EC] my-10 sm:my-16 md:my-[100px] w-full overflow-visible">
      <div className="w-full py-12 max-w-7xl flex flex-row lg:flex-row items-center justify-between gap-4 md:gap-14 px-5 lg:gap-30 overflow-visible lg:px-20">
        <div className="w-full lg:w-1/2 flex flex-col lg:items-start relative space-y-24 md:space-y-26 lg:space-y-28">
          {filmReelsData.map((reel) => (
            <div key={reel.id} className={`relative flex items-center gap-3 md:gap-5 ${reel.positionClass}`}>
              <div className={`relative ${reel.sizeClass} flex-shrink-0 drop-shadow-[0_12px_20px_rgba(0,0,0,0.28)]`}>
                <Image src={reel.imageSrc} alt={reel.imageAlt} width={300} height={300} className="w-full h-auto object-contain" priority />
              </div>
            </div>
          ))}
        </div>
        <div className="w-full lg:w-1/2 z-10">
          <h2 className="text-primary text-[34px] sm:text-[42px] md:text-[52px] font-semibold leading-tight mb-5">
            {t.about.tapeTreatment.title}
          </h2>
          <p className="text-black/70 text-[15px] md:text-[17px] leading-relaxed max-w-xl">
            {t.about.tapeTreatment.description}
          </p>
        </div>
      </div>
    </section>
  );
}
