"use client";
import { useI18n } from "@/src/i18n/context";

export default function SupportFormatsSection() {
  const { t } = useI18n();
  const sf = t.home.supportFormats;
  return (
    <section className="bg-bg-soft p-12 mb-[50px]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 flex flex-col items-start">
          <h2 className="text-[#242E42] text-[24px] sm:text-[30px] md:text-[36px] font-[500] mb-4 md:mb-6">
            {sf.title}
          </h2>
          <p className="text-[#444647] text-[13px] sm:text-[14px] md:text-[16px] font-[400] mb-8 md:mb-10 leading-relaxed">
            {sf.description}
          </p>
          <button className="bg-primary text-white px-10 py-4 font-[400] rounded-lg hover:bg-primary/90 transition-all">
            {sf.cta}
          </button>
        </div>
        <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-8">
          {[
            { label: sf.audio, items: sf.audioFormats },
            { label: sf.video, items: sf.videoFormats },
            { label: sf.film, items: sf.filmFormats }
          ].map(({ label, items }) => (
            <div key={label}>
              <h3 className="text-[#CC8C33] text-[16px] md:text-[18px] font-[400] mb-3 md:mb-4 border-b border-[#D5D7DD] pb-2">
                {label}
              </h3>
              <ul className="space-y-1 md:space-y-2 text-[#444647] text-[12px] md:text-sm">
                {items.map((fmt) => <li key={fmt}>{fmt}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
