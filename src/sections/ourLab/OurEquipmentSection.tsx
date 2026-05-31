"use client";
import { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { useI18n } from "@/src/i18n/context";

const equipmentIcons: Record<string, string> = {
  REFURBISHED: "clarity:recycle-line",
  CALIBRATED: "hugeicons:camera-lens",
  LOW_HOURS: "fluent:clock-arrow-download-20-regular",
  HIGH_END: "ph:star-light"
};

export default function OurEquipmentSection() {
  const [activeId, setActiveId] = useState<string>("REFURBISHED");
  const { t } = useI18n();
  const oe = t.ourLab.ourEquipment;

  const equipmentItems = oe.items.map((item) => ({ ...item, icon: equipmentIcons[item.id] ?? "ph:star-light" }));
  const currentItem = equipmentItems.find((item) => item.id === activeId) || equipmentItems[0];

  return (
    <section className="w-full md:px-16 py-20 relative min-h-[700px] flex flex-col md:flex-row mb-20 overflow-hidden text-white">
      <div className="absolute inset-0 z-0">
        <Image src="/images/heroServicesBg.png" alt="Our Equipment Background" fill priority className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-black/75 md:bg-black/65 backdrop-blur-[2px]" />
      </div>
      <div className="w-full md:w-[38%] relative z-10 pt-12 pb-12 px-6 lg:px-8 flex flex-col justify-between border-r border-white/5">
        <div>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-[550] text-center whitespace-nowrap px-2 mb-8 tracking-wide">{oe.title}</h2>
          <div className="w-full h-[1px] bg-white/20" />
          <div className="grid grid-cols-2 gap-0 relative">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/20 pointer-events-none" />
            {equipmentItems.map((item, index) => (
              <button key={item.id} onClick={() => setActiveId(item.id)} className={`flex flex-col items-center justify-center p-6 text-center transition-all duration-300 relative min-h-[160px] md:group ${index % 2 === 0 ? "border-r border-white/20" : ""} cursor-default md:cursor-pointer`}>
                <div className={`absolute inset-0 bg-white/5 transition-opacity duration-300 hidden md:block ${activeId === item.id ? "opacity-100" : "opacity-0 group-hover:opacity-40"}`} />
                <div className={`mb-3 transition-transform duration-300 text-white md:text-white/60 md:group-hover:scale-105 ${activeId === item.id ? "md:text-white md:scale-110" : ""}`}>
                  <Icon icon={item.icon} className="w-9 h-9 stroke-[1.1]" />
                </div>
                <span className={`text-xs md:text-sm tracking-wide font-medium relative z-10 transition-colors text-white md:text-white/70 ${activeId === item.id ? "md:font-semibold md:text-white" : ""}`}>
                  {item.title}
                </span>
              </button>
            ))}
          </div>
          <div className="w-full h-[1px] bg-white/20" />
        </div>
      </div>
      <div className="hidden md:flex w-full md:w-[62%] relative z-10 flex-col justify-center items-center p-8 lg:p-16">
        <div className="w-full max-w-xl bg-black/30 border border-white/10 backdrop-blur-md rounded-xl p-8 lg:p-12 flex flex-col justify-between min-h-[340px] transition-all duration-500">
          <div>
            <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl font-medium tracking-wide text-white mb-6 border-b border-white/10 pb-4">{currentItem.title}</h3>
            <p className="text-stone-300 text-sm lg:text-base leading-relaxed font-light tracking-wide">{currentItem.description}</p>
          </div>
          <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between w-full">
            <span className="text-[10px] uppercase font-mono tracking-widest text-white/30 hidden lg:inline">{oe.archivalStandards}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
