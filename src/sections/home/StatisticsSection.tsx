"use client";
import { useI18n } from "@/src/i18n/context";

const values = ["8+", "100%", "2,570,000", "22", "1,850,000+", "98%"];

export default function StatisticsSection() {
  const { t } = useI18n();
  const stats = values.map((value, i) => ({ value, label: t.home.statistics.labels[i] }));

  return (
    <section className="py-12 md:py-20 bg-white px-2 sm:px-4">
      <div className="text-center mb-8 md:mb-16">
        <h2 className="text-black text-[22px] sm:text-[30px] md:text-[40px] font-[500]">
          {t.home.statistics.title}
        </h2>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-3 border-b border-zinc-200">
        {stats.map((stat, index) => (
          <div key={index} className={`flex flex-col items-center justify-center text-center px-1 sm:px-3 md:px-6 py-4 md:py-12 ${index % 3 !== 2 ? "border-r border-zinc-200" : ""}`}>
            <span className="text-primary text-[12px] sm:text-[18px] md:text-[48px] font-[500] leading-none whitespace-nowrap">
              {stat.value}
            </span>
            <span className="text-black text-[9px] sm:text-[12px] md:text-[18px] font-[500] opacity-80 leading-tight mt-1">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
