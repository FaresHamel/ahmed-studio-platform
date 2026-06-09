"use client";
import { useI18n } from "@/src/i18n/context";

const values = ["8", "100%", "2,570,000", "22", "1,850,000", "98%"];

export default function StatisticsSection() {
  const { t } = useI18n();
  const stats = values.map((value, i) => ({ value, label: t.home.statistics.labels[i] }));

  return (
    <section className="py-8 lg:py-20 bg-white px-2 sm:px-4">
      <div className="text-center mb-6 lg:mb-16">
        <h2 className="text-black text-[22px] sm:text-[30px] lg:text-[40px] font-[500]">
          {t.home.statistics.title}
        </h2>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-3">
        {stats.map((stat, index) => {
          const totalItems = stats.length;
          const isLastColumn = (index + 1) % 3 === 0;
          const totalRows = Math.ceil(totalItems / 3);
          const currentRow = Math.floor(index / 3) + 1;
          const isLastRow = currentRow === totalRows;

          // COMPACT NUMBER FORMATTER FOR MOBILE & TABLET
          const formatMobileValue = (valStr: string) => {
            const hasPlus = valStr.includes("+");
            const numericValue = parseFloat(valStr.replace(/,/g, ""));

            if (isNaN(numericValue)) return valStr;

            let formatted = valStr;

            if (numericValue >= 1000000) {
              formatted = parseFloat((numericValue / 1000000).toFixed(2)) + "M";
            } else if (numericValue >= 1000) {
              formatted = parseFloat((numericValue / 1000).toFixed(1)) + "K";
            }

            return hasPlus ? `${formatted}+` : formatted;
          };

          return (
            <div
              key={index}
              className={`flex flex-col items-center justify-center text-center py-6 px-2 lg:py-12 lg:px-6 relative
            ${!isLastColumn ? "border-e border-zinc-200" : ""}
            ${!isLastRow ? "border-b border-zinc-200" : ""}
          `}
            >
              {/* Value Section */}
              <span className="text-primary text-[16px] sm:text-[22px] lg:text-[48px] font-[500] leading-none block w-full truncate px-1">
                {/* Show shortened text on mobile/tablet, and original value on desktop (lg) */}
                <span className="lg:hidden">
                  {formatMobileValue(stat.value)}
                </span>
                <span className="hidden lg:inline">{stat.value}</span>
              </span>

              {/* Label Section */}
              <span className="text-black text-[10px] sm:text-[13px] lg:text-[18px] font-[400] opacity-80 leading-tight mt-1.5 block w-full break-words">
                {stat.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
