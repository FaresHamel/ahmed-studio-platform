import React from "react";
import Image from "next/image";

interface CompareCardProps {
  imageSrc: string;
  zoomLabel?: string;
}

// Reusable Sub-Component for individual cards
const CompareCard: React.FC<CompareCardProps> = ({
  imageSrc,
  zoomLabel = "Zoom in 5x"
}) => {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-[#008f43] p-0 shadow-md aspect-[4/3] sm:aspect-auto">
      {/* Main Base Image */}
      <div className="relative w-full h-full min-h-[280px] md:min-h-[380px]">
        <Image
          src={imageSrc}
          alt="Digitization quality sample"
          fill
          priority
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover object-center"
        />
      </div>

      {/* Picture-in-Picture Zoom Preview Box */}
      <div className="absolute top-4 right-4 w-[38%] md:w-[35%] max-w-[160px] flex flex-col gap-1 z-10">
        <span className="text-white text-right text-[10px] md:text-xs font-semibold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-wide pr-1">
          {zoomLabel}
        </span>
      </div>
    </div>
  );
};

export default function HardwareComparison() {
    interface ComparisonRow {
      feature: string;
      ahmed: boolean | string;
      others: boolean | string;
    }

    const COMPARISON_ROWS: ComparisonRow[] = [
      { feature: "single bit captured", ahmed: true, others: false },
      { feature: "Data loss during capture", ahmed: false, others: true },
      {
        feature: "Compressed file",
        ahmed: false,
        others: true
      },
      {
        feature: "international standard",
        ahmed: true,
        others: false
      },
      {
        feature: "data rate",
        ahmed: "Very Hight",
        others: "Low"
      },
      { feature: "accuracy", ahmed: true, others: false },
      { feature: "easy to use", ahmed: false, others: true },
      {
        feature: "maintenance required",
        ahmed: "Hight",
        others: "Low"
      },
      { feature: "cost", ahmed: "Hight", others: "Low" },
      {
        feature: "required complementary Hardware",
        ahmed: true,
        others: false
      },
      { feature: "Hardware complexity", ahmed: "Hard", others: "Easy" },
      {
        feature: "same quality after 100 years",
        ahmed: "original quality",
        others: "loss quality"
      },
      { feature: "long term preservation", ahmed: true, others: false },
      {
        feature: "Accepted by Archive institutions",
        ahmed: true,
        others: false
      }
    ];

    function CheckIcon() {
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6"
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

    function XIcon() {
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6"
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
    }

    function CellValue({ val }: { val: boolean | string }) {
      if (typeof val === "boolean") return val ? <CheckIcon /> : <XIcon />;
      return <span className="text-sm font-medium text-amber-900">{val}</span>;
    }
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-12 bg-white font-sans">
      {/* Main Comparative Titles */}
      <div className="text-center mb-8 md:mb-12 flex flex-col items-center">
        <h2 className="text-2xl md:text-3.5xl font-bold text-[#6d4c17] leading-tight max-w-2xl">
          Professional Digitization HW
        </h2>
        <span className="text-xl md:text-2xl font-black text-[#6d4c17] my-1 block">
          VS
        </span>
        <h2 className="text-2xl md:text-3.5xl font-bold text-[#6d4c17] leading-tight max-w-2xl">
          Home Video digitization HW
        </h2>
      </div>

      {/* Two-Column Responsive Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-8 items-stretch">
        {/* Left Side: Professional Hardware Render */}
        <CompareCard imageSrc="/images/right.png" />
        <CompareCard imageSrc="/images/left.png" />
      </div>
      <div className="rounded-2xl overflow-hidden border border-amber-100 mt-10 shadow-sm">
        <div className="grid grid-cols-3 gap-4 bg-[#D28F13] p-4 rounded-t-2xl">
          <div className="flex items-center justify-center">
            <span className="text-white font-semibold text-lg">Feature</span>
          </div>
          <div className="flex items-center justify-center gap-3 bg-[#FFDC99] rounded-xl p-2">
            <span className="font-semibold text-base text-black">
              Professional digitization HW
            </span>
          </div>
          <div className="flex items-center justify-center bg-[#FFF0D5] rounded-xl p-2">
            <span className="font-semibold text-base text-black">
              Home video digitzation HW
            </span>
          </div>
        </div>
        {COMPARISON_ROWS.map((row, i) => (
          <div
            key={row.feature}
            className={`grid grid-cols-3 gap-4 px-4 py-3 border-t border-amber-100 ${
              i % 2 === 0 ? "bg-[#FFF0D5]/30" : "bg-white"
            }`}
          >
            <div className="flex items-center justify-center  bg-[#D28F13] rounded-lg px-4 py-3">
              <span className="text-white text-center font-medium text-sm leading-snug">
                {row.feature}
              </span>
            </div>
            <div className="flex items-center justify-center bg-[#FFDC99] rounded-lg py-3">
              <CellValue val={row.ahmed} />
            </div>
            <div className="flex items-center justify-center bg-[#FFF0D5] rounded-lg py-3">
              <CellValue val={row.others} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
