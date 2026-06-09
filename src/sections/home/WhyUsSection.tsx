"use client";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useI18n } from "@/src/i18n/context";

const featureIcons = [
  "hugeicons:award-02",
  "clarity:world-line",
  "bi:filetype-raw"
];

export default function WhyUsSection() {
  const { t } = useI18n();
  const wu = t.home.whyUs;
  const features = wu.features.map((f, i) => ({
    ...f,
    id: i + 1,
    icon: featureIcons[i]
  }));

  return (
    /* FIXED: Changed px-4 to px-0 on mobile, keeping md:px-4 on desktop */
    <section className="py-12 md:py-20 px-0 md:px-4 max-w-7xl mx-auto overflow-hidden">
      <h2 className="text-primary text-[28px] md:text-[40px] font-bold text-center mb-10 md:mb-16 px-4">
        {wu.title}
      </h2>

      {/* Mobile */}
      <div className="lg:hidden">
        <div className="overflow-x-auto scrollbar-hide mb-6">
          {/* Added structural padding adjustments here so cards line up neatly on scroll */}
          <div className="flex gap-4 w-max px-4 pb-2">
            {features.map((item, index) => (
              <div
                key={index}
                className="min-w-[250px] max-w-[250px] bg-[#F7F1EC] p-5 rounded-[20px] flex flex-col items-start shadow-sm"
              >
                <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center mb-4">
                  <Icon icon={item.icon} className="text-xl text-black/80" />
                </div>
                <h3 className="text-primary text-[18px] font-[500] mb-3">
                  {item.title}
                </h3>
                <p className="text-black text-[14px] leading-relaxed opacity-90">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Added px-4 wrapper around the consultation box so it keeps its side spacing */}
        <div className="px-4">
          <div className="bg-[#F7F1EC] p-6 rounded-[20px] flex flex-col">
            <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center mb-4">
              <Icon
                icon="hugeicons:message-01"
                className="text-xl text-black/80"
              />
            </div>
            <h3 className="text-primary text-[20px] font-[500] mb-4">
              {wu.consultation.title}
            </h3>
            <div className="text-black text-[14px] space-y-4 opacity-90 leading-relaxed flex-grow">
              <p>{wu.consultation.p1}</p>
              <p>{wu.consultation.p2}</p>
            </div>
            {/* Added standard active scale interaction down below */}
            <button className="mt-6 bg-primary text-white px-6 py-3 rounded-lg font-[500] w-full hover:bg-primary/90 transition-all active:scale-95">
              {wu.consultation.cta}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:grid grid-cols-12 gap-6">
        <div className="col-span-8 grid grid-cols-2 gap-6">
          {features.map((item, index) => (
            <div
              key={index}
              className={`bg-[#F7F1EC] p-8 rounded-[25px] flex flex-col items-start ${
                index === 2 ? "col-span-2" : ""
              }`}
            >
              <div className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center mb-6">
                <Icon icon={item.icon} className="text-2xl text-black/80" />
              </div>
              <h3 className="text-primary text-[24px] font-[500] mb-4">
                {item.title}
              </h3>
              <p className="text-black text-[16px] leading-relaxed opacity-90">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
        <div className="col-span-4 bg-[#F7F1EC] p-8 rounded-[25px] flex flex-col">
          <div className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center mb-6">
            <Icon
              icon="hugeicons:message-01"
              className="text-2xl text-black/80"
            />
          </div>
          <h3 className="text-primary text-[24px] font-[500] mb-4">
            {wu.consultation.title}
          </h3>
          <div className="text-black text-[16px] space-y-6 opacity-90 flex-grow leading-relaxed">
            <p>{wu.consultation.p1}</p>
            <p>{wu.consultation.p2}</p>
          </div>
          <Link
            href="/consultant"
            className="mt-10 bg-primary text-white px-8 py-3 rounded-lg font-[500] w-fit hover:bg-primary/90 transition-all"
          >
            {wu.consultation.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
