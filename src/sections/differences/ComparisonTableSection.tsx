interface ComparisonRow {
  feature: string;
  ahmed: boolean | string;
  others: boolean | string;
}

const COMPARISON_ROWS: ComparisonRow[] = [
  { feature: "Native Streaming App", ahmed: true, others: false },
  { feature: "Video Treatment & Restoration", ahmed: true, others: false },
  { feature: "Best International Practices Workflow", ahmed: true, others: false },
  { feature: "Home Video Digitization Equipment", ahmed: false, others: true },
  { feature: "Door to Door Free Pick Up & Delivery", ahmed: true, others: false },
  { feature: "Raw Capture", ahmed: true, others: false },
  { feature: "Female Staff", ahmed: true, others: true },
  { feature: "High Capabilities Infrastructure", ahmed: true, others: false },
  { feature: "All Tapes Format Supported", ahmed: true, others: false },
  { feature: "URL Shareable Content", ahmed: true, others: false },
  { feature: "More", ahmed: true, others: false },
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

export default function ComparisonTableSection() {
  return (
    <section className="max-w-[1170px] mx-auto px-4 mt-24">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-semibold text-[#77510A] mb-6">
          Comparison
        </h2>
        <p className="text-base md:text-lg text-[#3C3C3C] leading-relaxed max-w-2xl mx-auto text-center">
          Not All Digitization is Created Equal. When you're choosing who to trust with your
          only copies of irreplaceable moments, the details matter. Many \"bargain\" services
          outsource their labor or use automated machines that can eat your tapes. Here is how
          Ahmed Studio stands alone in the industry.
        </p>
      </div>

      <div className="rounded-2xl overflow-hidden border border-amber-100 shadow-sm">
        <div className="grid grid-cols-3 gap-4 bg-[#D28F13] p-4 rounded-t-2xl">
          <div className="flex items-center justify-center">
            <span className="text-white font-semibold text-lg">Feature</span>
          </div>
          <div className="flex items-center justify-center gap-3 bg-[#FFDC99] rounded-xl p-2">
            <span className="w-10 h-10 rounded-lg bg-amber-700 flex items-center justify-center text-white font-bold text-sm">AS</span>
            <span className="font-semibold text-base text-black">Ahmed Studio</span>
          </div>
          <div className="flex items-center justify-center bg-[#FFF0D5] rounded-xl p-2">
            <span className="font-semibold text-base text-black">Other Stores</span>
          </div>
        </div>

        {COMPARISON_ROWS.map((row, i) => (
          <div
            key={row.feature}
            className={`grid grid-cols-3 gap-4 px-4 py-3 border-t border-amber-100 ${
              i % 2 === 0 ? "bg-[#FFF0D5]/30" : "bg-white"
            }`}
          >
            <div className="flex items-center bg-[#D28F13] rounded-lg px-4 py-3">
              <span className="text-white font-medium text-sm leading-snug">{row.feature}</span>
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
