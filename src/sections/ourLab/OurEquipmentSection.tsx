"use client";
import { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";

interface EquipmentItem {
  id: string;
  title: string;
  icon: string;
  description: string;
}

// Exactly mapping your 4 required fields with proper detailed descriptions
const equipmentItems: EquipmentItem[] = [
  {
    id: "REFURBISHED",
    title: "Full Refurbished",
    icon: "clarity:recycle-line",
    description:
      "We make sure each device has its components fully replaced and structural mechanisms completely rebuilt to meet original manufacturer production specifications."
  },
  {
    id: "CALIBRATED",
    title: "Calibrated",
    icon: "hugeicons:camera-lens",
    description:
      "Precisely aligned head drums and fine sound tracking calibration ensure our decks perfectly match high-fidelity archival studio reference readings."
  },
  {
    id: "LOW_HOURS",
    title: "Low Hours Operation",
    icon: "fluent:clock-arrow-download-20-regular",
    description:
      "Utilizing devices with exceptionally low-use original recording drums is critical to preventing tracking artifacts and reaching maximum quality for tapes."
  },
  {
    id: "HIGH_END",
    title: "High End Equipment",
    icon: "ph:star-light",
    description:
      "We process archives exclusively through premium broadcast-grade master decks, high-end time base correctors, and specialized ingestion pipelines."
  }
];

export default function OurEquipmentSection() {
  const [activeId, setActiveId] = useState<string>("REFURBISHED");

  const currentItem =
    equipmentItems.find((item) => item.id === activeId) || equipmentItems[0];

  return (
    <section className="w-full md:px-16 py-20 relative min-h-[700px] flex flex-col md:flex-row mb-20 overflow-hidden text-white">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/heroServicesBg.png"
          alt="Our Equipment Background"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Subtle dark tinted overlay layer matching the asset style in Screen Shot 2026-05-31 at 17.31.13.jpg */}
        <div className="absolute inset-0 bg-black/75 md:bg-black/65 backdrop-blur-[2px]" />
      </div>
      <div className="w-full md:w-[38%] relative z-10 pt-12 pb-12 px-6 lg:px-8 flex flex-col justify-between border-r border-white/5">
        <div>
          {/* 1. Section title centered on a single line */}
          <h2 className="text-xl md:text-2xl lg:text-3xl font-[550] text-center whitespace-nowrap px-2 mb-8 tracking-wide">
            Our Equipment
          </h2>

          {/* 2. Top solid architectural divider rule */}
          <div className="w-full h-[1px] bg-white/20" />

          {/* 3. Core 2x2 Interactive Data Frame Map */}
          <div className="grid grid-cols-2 gap-0 relative">
            {/* Center horizontal divider vector path split line rule */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/20 pointer-events-none" />

            {equipmentItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setActiveId(item.id)}
                className={`flex flex-col items-center justify-center p-6 text-center transition-all duration-300 relative min-h-[160px] md:group
                  ${index % 2 === 0 ? "border-r border-white/20" : ""}
                  cursor-default md:cursor-pointer
                `}
              >
                {/* Desktop Interactive State Background Fill Triggers */}
                <div
                  className={`absolute inset-0 bg-white/5 transition-opacity duration-300 hidden md:block ${
                    activeId === item.id
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-40"
                  }`}
                />

                {/* Clean Vector Stroke Icon Node */}
                <div
                  className={`mb-3 transition-transform duration-300 text-white md:text-white/60 md:group-hover:scale-105 ${
                    activeId === item.id ? "md:text-white md:scale-110" : ""
                  }`}
                >
                  <Icon icon={item.icon} className="w-9 h-9 stroke-[1.1]" />
                </div>

                {/* Feature Label Typography */}
                <span
                  className={`text-xs md:text-sm tracking-wide font-medium relative z-10 transition-colors text-white md:text-white/70 ${
                    activeId === item.id ? "md:font-semibold md:text-white" : ""
                  }`}
                >
                  {item.title}
                </span>
              </button>
            ))}
          </div>

          {/* 4. Bottom closure separation divider line layout */}
          <div className="w-full h-[1px] bg-white/20" />
        </div>
      </div>
      <div className="hidden md:flex w-full md:w-[62%] relative z-10 flex-col justify-center items-center p-8 lg:p-16">
        {/* Floating Inner Minimal Canvas Block Layer Container */}
        <div className="w-full max-w-xl bg-black/30 border border-white/10 backdrop-blur-md rounded-xl p-8 lg:p-12 flex flex-col justify-between min-h-[340px] transition-all duration-500">
          {/* Selected Dynamic Header Node */}
          <div>
            <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl font-medium tracking-wide text-white mb-6 border-b border-white/10 pb-4">
              {currentItem.title}
            </h3>

            {/* Context Meta Paragraph Container */}
            <p className="text-stone-300 text-sm lg:text-base leading-relaxed font-light tracking-wide">
              {currentItem.description}
            </p>
          </div>

          {/* Bottom Fast Action Context Trigger Row Element */}
          <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between w-full">
            {/* Subtle branding metadata label */}
            <span className="text-[10px] uppercase font-mono tracking-widest text-white/30 hidden lg:inline">
              Archival Standards
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
