const stats = [
  { value: "8+", label: "Years in the Field" },
  { value: "100%", label: "RAW Accuracy" },
  { value: "2,570,000", label: "Minutes Captured" },
  { value: "22", label: "Cities Within Our Network" },
  { value: "1,850,000+", label: "Number of Visitors" },
  { value: "98%", label: "Client Satisfied" }
];

export default function StatisticsSection() {
  return (
    <section className="py-12 md:py-20 bg-white px-2 sm:px-4">
      {/* TITLE */}
      <div className="text-center mb-8 md:mb-16">
        <h2 className="font-poppins text-black text-[22px] sm:text-[30px] md:text-[40px] font-[500]">
          Statistics
        </h2>
      </div>

      {/* STATS */}
      <div className="max-w-6xl mx-auto grid grid-cols-3 border-b border-zinc-200">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`
          flex flex-col items-center justify-center text-center
          px-1 sm:px-3 md:px-6
          py-4 md:py-12
          ${index % 3 !== 2 ? "border-r border-zinc-200" : ""}
        `}
          >
            {/* VALUE */}
            <span
              className="
          font-poppins
          text-primary
          text-[12px] sm:text-[18px] md:text-[48px]
          font-[500]
          leading-none
          whitespace-nowrap
        "
            >
              {stat.value}
            </span>

            {/* LABEL */}
            <span
              className="
          font-poppins
          text-black
          text-[9px] sm:text-[12px] md:text-[18px]
          font-[500]
          opacity-80
          leading-tight
          mt-1
        "
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
