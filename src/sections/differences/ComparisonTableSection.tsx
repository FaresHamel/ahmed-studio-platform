"use client";
import SimpleInfoSection from "@/src/components/sections/SimpleInfoSection";
import Image from "next/image";
import { useI18n } from "@/src/i18n/context";

type FeatureKey =
  | "streaming"
  | "restoration"
  | "practices"
  | "equipment"
  | "delivery"
  | "raw"
  | "female"
  | "infrastructure"
  | "formats"
  | "shareable"
  | "apple"
  | "android"
  | "usb";

interface ComparisonRow {
  featureKey: FeatureKey;
  ahmed: boolean | string;
  others: boolean | string;
}

// FIXED: Removed the stray property "Integrative: true" from the object definition
const COMPARISON_ROWS: ComparisonRow[] = [
  { featureKey: "streaming", ahmed: true, others: false },
  { featureKey: "restoration", ahmed: true, others: false },
  { featureKey: "practices", ahmed: true, others: false },
  { featureKey: "equipment", ahmed: false, others: true },
  { featureKey: "delivery", ahmed: true, others: false },
  { featureKey: "raw", ahmed: true, others: false },
  { featureKey: "female", ahmed: true, others: true },
  { featureKey: "infrastructure", ahmed: true, others: false },
  { featureKey: "formats", ahmed: true, others: false },
  { featureKey: "shareable", ahmed: true, others: false },
  { featureKey: "apple", ahmed: true, others: false },
  { featureKey: "android", ahmed: true, others: false },
  { featureKey: "usb", ahmed: true, others: true }
];

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5 md:w-6 md:h-6"
      fill="none"
      stroke="#00BC9C"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const XIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-5 h-5 md:w-6 md:h-6"
    fill="none"
    stroke="#F74354"
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

function CellValue({ val }: { val: boolean | string }) {
  if (typeof val === "boolean") return val ? <CheckIcon /> : <XIcon />;
  return (
    <span className="text-[11px] md:text-sm font-bold text-amber-900 text-center tracking-tight leading-tight px-1">
      {val}
    </span>
  );
}


export default function ComparisonTableSection() {
  const { t } = useI18n();
  const comp = t.differences.comparison;

  return (
    <section className="max-w-[1170px] mx-auto px-4 mt-16 md:mt-24">
      <SimpleInfoSection
        title={comp.title}
        description={comp.description}
        containerClassName="mb-10"
      />

      <div className="rounded-2xl overflow-hidden border border-amber-100 shadow-sm overflow-x-auto w-full">
        <div className="min-w-[550px] w-full">
          <div className="grid grid-cols-3 gap-1.5 md:gap-4 bg-[#D28F13] p-2 md:p-4 rounded-t-2xl items-center">
            <div className="flex items-center justify-center text-center">
              <span className="text-white font-semibold text-[11px] md:text-lg tracking-tight leading-tight">
                {comp.headerFeature}
              </span>
            </div>

            <div className="flex items-center justify-center gap-1 md:gap-3 bg-[#FFDC99] rounded-xl p-1 md:p-2 text-center h-full">
              <div className="relative w-5 h-5 md:w-10 md:h-10 flex-shrink-0 hidden sm:block">
                <Image
                  src="/images/logo-black.png"
                  alt="Brand Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-[11px] md:text-base text-black tracking-tight leading-tight">
                {comp.headerBrand}
              </span>
            </div>

            <div className="flex items-center justify-center bg-[#FFF0D5] rounded-xl p-1.5 md:p-3 text-center h-full">
              <span className="font-bold text-[11px] md:text-base text-black tracking-tight leading-tight">
                {comp.headerOthers}
              </span>
            </div>
          </div>

          {COMPARISON_ROWS.map((row, i) => (
            <div
              key={row.featureKey}
              className={`grid grid-cols-3 gap-1.5 md:gap-4 px-2 md:px-4 py-1.5 md:py-3 border-t-[3px] md:border-t border-amber-100 items-center ${
                i % 2 === 0 ? "bg-[#FFF0D5]/30" : "bg-white"
              }`}
            >
              <div className="flex items-center bg-[#D28F13] rounded-lg px-1.5 md:px-4 py-1.5 md:py-3 h-full">
                <span className="text-white font-medium text-[10px] md:text-sm leading-tight text-start tracking-tight w-full">
                  {comp.features[row.featureKey] || row.featureKey}
                </span>
              </div>

              <div className="flex items-center justify-center bg-[#FFDC99] rounded-lg py-1.5 md:py-3 h-full">
                <CellValue val={row.ahmed} />
              </div>

              <div className="flex items-center justify-center bg-[#FFF0D5] rounded-lg py-1.5 md:py-3 h-full">
                <CellValue val={row.others} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
