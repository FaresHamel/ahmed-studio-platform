"use client";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { useI18n } from "@/src/i18n/context";

const riskIcons = ["mdi:alert-circle", "mdi:cpu", "mdi:code-braces", "mdi:file-video", "mdi:camera-capture", "mdi:check-all"];

export default function WhatCanGoWrong({ topImage = "/images/consultantImg4.jpg" }: { topImage?: string }) {
  const { t } = useI18n();
  const wg = t.consultant.whatCanGoWrong;
  const risks = wg.items.map((item, i) => ({ icon: riskIcons[i] ?? "mdi:alert", title: item.title, description: item.desc }));

  return (
    <section className="w-full py-12 md:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="mb-12 md:mb-16">
          <h2 className="text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-6xl leading-tight font-[500] text-center mb-4">{wg.title}</h2>
        </div>
        <div className="mb-16 md:mb-24">
          <div className="relative w-full aspect-video md:aspect-auto md:h-[400px] rounded-2xl overflow-hidden shadow-xl mb-8">
            <Image src={topImage} alt="Risks of Unguided Digitization" fill className="object-cover" priority={false} />
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 flex flex-col items-start justify-center p-6 md:p-12">
              <h2 className="text-white text-[28px] sm:text-4xl md:text-5xl lg:text-6xl leading-tight font-[500] max-w-2xl">
                {wg.risksTitle}
              </h2>
              <p className="text-white text-sm md:text-base mt-4 max-w-xl leading-relaxed">{wg.risksDesc}</p>
            </div>
          </div>
        </div>

        <div className="mb-12 md:mb-16">
          <h3 className="text-2xl md:text-4xl font-bold text-black mb-12">{wg.subtitle}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {risks.map((risk, index) => (
              <div key={index} className="flex gap-4 md:gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Icon icon={risk.icon} width="24" height="24" className="text-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-base md:text-lg font-bold text-black mb-2">{risk.title}</h4>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">{risk.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6 md:p-8">
          <div className="flex gap-4 items-start">
            <Icon icon="mdi:alert-outline" width="28" height="28" className="text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-amber-900 text-lg md:text-xl mb-3">{wg.consequenceTitle}</h4>
              <p className="text-amber-800 text-sm md:text-base leading-relaxed">{wg.consequenceDesc}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
