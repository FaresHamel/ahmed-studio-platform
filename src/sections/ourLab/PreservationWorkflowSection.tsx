"use client";
import Image from "next/image";
import { useI18n } from "@/src/i18n/context";

export default function PreservationWorkflowSection() {
  const { t } = useI18n();
  const pw = t.ourLab.preservation;
  return (
    <section className="w-full bg-[#F8F8F8] py-16 md:py-24 px-6 md:px-12 lg:px-20 flex items-center justify-center overflow-visible">
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
        <div className="w-full lg:w-[45%] flex flex-col items-start z-10 text-left">
          <h2 className="text-black text-[32px] sm:text-[40px] md:text-[44px] lg:text-[48px] font-[600] leading-tight mb-6">{pw.title}</h2>
          <p className="text-[#555555] text-[14px] sm:text-[15px] lg:text-[16px] leading-relaxed max-w-xl">{pw.description}</p>
        </div>
        <div className="w-full lg:w-[55%] flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[640px] aspect-[16/10] rounded-[12px] overflow-hidden drop-shadow-[0_15px_30px_rgba(0,0,0,0.15)] group cursor-pointer">
            <Image src="/images/workflow-video-thumbnail.png" alt={pw.title} fill sizes="(max-w-1024px) 100vw, 55vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" priority />
            <div className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-black/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button aria-label={pw.playVideo} className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center border border-white/40 transition-all duration-300 transform group-hover:scale-110 shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-95">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
