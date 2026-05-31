import { Icon } from "@iconify/react";

export default function PaymentSplitSection() {
  return (
    <section className="bg-dark-brown p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
      {/* Left side: Titles */}
      <div className="flex flex-col items-center text-center w-full justify-center">
        {/* Title sized 40px - Poppins text */}
        <h2
          className="
 
  text-[#F7F1EC]
  text-[24px]
  sm:text-[30px]
  md:text-[40px]
  font-[400]
  mb-4
  capitalize
  leading-tight
"
        >
          Split To 4 Payments
        </h2>

        {/* Paragraph sized 16px - Poppins text */}
        <p className="text-[#F7F1EC]/80 text-[12px] tracking-wide flex items-center justify-center gap-2">
          No Fees Or Interest
          <span className="text-primary">•</span>
          All Bank Cards Accepted
        </p>
      </div>

      {/* Right side: Payment methods (fully programmatic) */}
      <div className="flex flex-col items-center gap-4">
        <span className="text-[#fff]/60 text-xs md:text-sm uppercase tracking-[0.2em] font-medium">
          Available Via:
        </span>

        <div className="flex items-center gap-4">
          {/* Simulating Tabby logo programmatically */}
          <div className="bg-[#E8D4B5] px-6 py-2 rounded-[8px] flex items-center justify-center min-w-[110px] shadow-sm transition-transform hover:scale-105">
            <span className="text-[#23140C] font-black italic text-[16px] tracking-tighter">
              tabby
            </span>
          </div>

          {/* Simulating Tamara logo programmatically */}
          <div className="bg-[#B67B5F] px-6 py-2 rounded-[8px] flex items-center justify-center min-w-[110px] h-12 shadow-sm transition-transform hover:scale-105">
            <span className="text-white font-black italic text-[16px] tracking-tighter">
              tamara
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
