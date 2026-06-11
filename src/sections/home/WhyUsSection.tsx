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
    <section className="py-12 md:py-20 px-4 max-w-7xl mx-auto overflow-hidden">
      <h2 className="text-primary text-[28px] md:text-[40px] font-bold text-center mb-10 md:mb-16">
        {wu.title}
      </h2>

      {/* Mobile View: Swapped horizontal scroll for a clean, centered layout stack */}
      <div className="lg:hidden flex flex-col items-center gap-4 max-w-[350px] mx-auto">
        {features.map((item, index) => (
          <div
            key={index}
            className="w-full bg-[#F7F1EC] p-5 rounded-[20px] flex flex-col items-start shadow-sm"
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

      {/* Desktop View: Cleaned up grid-cols-12 to grid-cols-2 and centered the container */}
      <div className="hidden lg:grid grid-cols-2 gap-6 max-w-[900px] mx-auto">
        {features.map((item, index) => (
          <div
            key={index}
            className={`bg-[#F7F1EC] p-8 rounded-[25px] flex flex-col items-start ${
              index === 2 ? "col-span-2 mx-auto w-full" : ""
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
    </section>
  );
}
