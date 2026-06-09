"use client";
import React from "react";
import Image from "next/image";
import { useI18n } from "@/src/i18n/context";

interface CompareCardProps {
  imageSrc: string;
  zoomLabel?: string;
}

const CompareCard: React.FC<CompareCardProps> = ({
  imageSrc,
  zoomLabel = "Zoom in 5x"
}) => {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-[#008f43] p-0 shadow-md aspect-[4/3] sm:aspect-auto">
      <div className="relative w-full h-full min-h-[240px] md:min-h-[380px]">
        <Image
          src={imageSrc}
          alt="Digitization quality sample"
          fill
          priority
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover object-center"
        />
      </div>
      <div className="absolute top-4 right-4 left-4 flex justify-end z-10">
        <span className="text-white text-[10px] md:text-xs font-semibold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-wide">
          {zoomLabel}
        </span>
      </div>
    </div>
  );
};

type IndustryFeatureKey =
  | "sound"
  | "video"
  | "stabilization"
  | "recommended"
  | "lost"
  | "approved";

interface ComparisonRow {
  featureKey: IndustryFeatureKey;
  ahmed: boolean;
  others: boolean;
}

const COMPARISON_ROWS: ComparisonRow[] = [
  { featureKey: "sound", ahmed: true, others: false },
  { featureKey: "video", ahmed: true, others: false },
  { featureKey: "stabilization", ahmed: true, others: false },
  { featureKey: "recommended", ahmed: true, others: false },
  { featureKey: "lost", ahmed: false, others: true },
  { featureKey: "approved", ahmed: true, others: false }
];

export default function IndustryComparison() {
  const { t } = useI18n();
  const ind = t.differences.industry;

  const CheckIcon = () => (
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

  const CellValue = ({ val }: { val: boolean }) =>
    val ? <CheckIcon /> : <XIcon />;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-8 md:py-12 bg-white">
      <div className="text-center mb-8 md:mb-12 flex flex-col items-center">
        <h2 className="text-xl md:text-3xl font-bold text-[#6d4c17] leading-tight max-w-2xl">
          {ind.title1}
        </h2>
        <span className="text-lg md:text-xl font-black text-[#6d4c17] my-1 block">
          {"VS"}
        </span>
        <h2 className="text-xl md:text-3xl font-bold text-[#6d4c17] leading-tight max-w-2xl">
          {ind.title2}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 items-stretch mb-10">
        <CompareCard
          imageSrc="/images/InderstryEquipment.png"
          zoomLabel={ind.zoomLabel}
        />
        <CompareCard
          imageSrc="/images/homeEquipment.png"
          zoomLabel={ind.zoomLabel}
        />
      </div>

    <div className="rounded-2xl overflow-hidden border border-amber-100 shadow-sm overflow-x-auto w-full">
  <div className="min-w-[550px] w-full">
    {/* Header Row Layout */}
    <div className="grid grid-cols-3 gap-1.5 md:gap-4 bg-[#D28F13] p-2 md:p-4 rounded-t-2xl items-center">
      <div className="flex items-center justify-center text-center">
        <span className="text-white font-semibold text-[11px] md:text-lg tracking-tight leading-tight">
          {ind.headerFeature}
        </span>
      </div>
      <div className="flex items-center justify-center bg-[#FFDC99] rounded-xl p-1.5 md:p-2 text-center h-full">
        <span className="font-bold text-[11px] md:text-base text-black tracking-tight leading-tight">
          {ind.headerBrand}
        </span>
      </div>
      <div className="flex items-center justify-center bg-[#FFF0D5] rounded-xl p-1.5 md:p-2 text-center h-full">
        <span className="font-bold text-[11px] md:text-base text-black tracking-tight leading-tight">
          {ind.headerOthers}
        </span>
      </div>
    </div>

    {/* Content Rows Iterator */}
    {COMPARISON_ROWS.map((row, i) => (
      <div
        key={row.featureKey}
        className={`grid grid-cols-3 gap-1.5 md:gap-4 px-2 md:px-4 py-1.5 md:py-3 border-t-[3px] md:border-t border-amber-100 items-center ${
          i % 2 === 0 ? "bg-[#FFF0D5]/30" : "bg-white"
        }`}
      >
        {/* FIXED: Optimized mobile padding and text sizing for high-density reading */}
        <div className="flex items-center bg-[#D28F13] rounded-lg px-1.5 md:px-4 py-1.5 md:py-3 h-full">
          <span className="text-white font-medium text-[10px] md:text-sm leading-tight text-start tracking-tight w-full">
            {ind.features[row.featureKey] || row.featureKey}
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
