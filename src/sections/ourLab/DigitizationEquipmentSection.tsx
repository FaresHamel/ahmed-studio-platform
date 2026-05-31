"use client";
import Image from "next/image";
import { useI18n } from "@/src/i18n/context";

const equipmentSrcs = [
  "/images/reel-to-reel-1.png",
  "/images/film-scanner.png",
  "/images/rack-mounts.png",
  "/images/studio-audio-deck.png",
  "/images/vhs-player-monitor.png",
  "/images/flatbed-editor.png",
  "/images/audio-turntable.png",
  "/images/mixing-board.png"
];

export default function DigitizationEquipmentSection() {
  const { t } = useI18n();
  const de = t.ourLab.digitizationEquipment;

  return (
    <section className="w-full bg-white overflow-visible flex flex-col items-center">
      <div className="w-full bg-[#FFEDDE] pt-16 pb-24 md:pt-24 md:pb-36 px-6 md:px-12 lg:px-20 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <h2 className="text-black text-[28px] sm:text-[34px] md:text-[42px] lg:text-[46px] font-[600] leading-tight mb-6">{de.title}</h2>
          <p className="text-black text-[14px] sm:text-[15px] md:text-[16px] leading-relaxed opacity-75 max-w-3xl">{de.description}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 w-full overflow-visible">
        <div className="w-full grid grid-cols-4 gap-2 sm:gap-6 md:gap-8 justify-items-center items-center -mt-16 md:-mt-24 pb-16 md:pb-24 overflow-visible">
          {equipmentSrcs.map((src, index) => (
            <div key={index} className="w-full aspect-square relative bg-gray-100 rounded-[6px] sm:rounded-[16px] overflow-hidden drop-shadow-[0_4px_10px_rgba(0,0,0,0.12)] md:drop-shadow-[0_12px_24px_rgba(0,0,0,0.14)] transition-all duration-300 hover:scale-[1.03]">
              <Image src={src} alt={de.items[index] ?? ""} fill sizes="(max-w-640px) 25vw, 25vw" className="object-cover" priority={index < 4} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
