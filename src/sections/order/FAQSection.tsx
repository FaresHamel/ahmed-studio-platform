"use client";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { useI18n } from "@/src/i18n/context";

export default function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(null);
  const { t } = useI18n();
  const faq = t.order.faq;

  return (
    <section className="py-16 md:py-24 px-6 md:px-20 lg:px-32 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-primary text-[26px] sm:text-[30px] md:text-[30px] lg:text-[40px] leading-tight font-[500] text-center mb-16">
          {faq.title}
        </h2>
        <div className="space-y-0 border-t border-black/10">
          {faq.items.map((item, index) => {
            const id = index + 1;
            const isOpen = openId === id;
            return (
              <div key={id} className="border-b border-black/10 transition-colors duration-200">
                <button onClick={() => setOpenId(isOpen ? null : id)} className="w-full py-6 flex items-center justify-between text-left group gap-4">
                  <h3 className="text-primary text-[18px] sm:text-[22px] lg:text-[24px] font-[400] leading-snug transition-colors group-hover:opacity-80">
                    {id}. {item.question}
                  </h3>
                  <Icon icon="hugeicons:arrow-down-01" className={`text-primary text-2xl flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <div className={`grid transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "grid-rows-[1fr] opacity-100 pb-6" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <p className="text-black text-[14px] sm:text-[15px] md:text-[16px] leading-relaxed opacity-90 max-w-3xl">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
