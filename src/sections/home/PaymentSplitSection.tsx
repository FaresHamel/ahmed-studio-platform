import { Icon } from "@iconify/react";

export default function PaymentSplitSection() {
  return (
    <section className="bg-dark-brown p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
      {/* الجزء الأيسر: العناوين */}
      <div className="flex flex-col items-center text-center w-full justify-center">
        {/* العنوان بمقاس 40px - نص Poppins */}
        <h2
          className="
  font-poppins
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

        {/* الفقرة بمقاس 16px - نص Poppins */}
        <p className="font-poppins text-[#F7F1EC]/80 text-[12px] tracking-wide flex items-center justify-center gap-2">
          No Fees Or Interest
          <span className="text-primary">•</span>
          All Bank Cards Accepted
        </p>
      </div>

      {/* الجزء الأيمن: طرق الدفع (برمجي بالكامل) */}
      <div className="flex flex-col items-center gap-4">
        <span className="font-poppins text-[#fff]/60 text-xs md:text-sm uppercase tracking-[0.2em] font-medium">
          Available Via:
        </span>

        <div className="flex items-center gap-4">
          {/* محاكاة شعار Tabby برمجياً */}
          <div className="bg-[#E8D4B5] px-6 py-2 rounded-[8px] flex items-center justify-center min-w-[110px] shadow-sm transition-transform hover:scale-105">
            <span className="text-[#23140C] font-poppins font-black italic text-[16px] tracking-tighter">
              tabby
            </span>
          </div>

          {/* محاكاة شعار Tamara برمجياً */}
          <div className="bg-[#B67B5F] px-6 py-2 rounded-[8px] flex items-center justify-center min-w-[110px] h-12 shadow-sm transition-transform hover:scale-105">
            <span className="text-white font-poppins font-black italic text-[16px] tracking-tighter">
              tamara
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
