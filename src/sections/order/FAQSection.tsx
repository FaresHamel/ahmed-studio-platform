"use client";
import { useState } from "react";
import { Icon } from "@iconify/react";

const faqData = [
  {
    id: 1,
    question: "What services do you offer?",
    answer:
      "We provide professional audiovisual digitization, legacy media restoration, and archival consulting. This includes transferring magnetic tapes, film reels, and vintage audio formats into high-grade uncompressed RAW digital files safely."
  },
  {
    id: 2,
    question: "How do I book a session?",
    answer:
      "You can book a session or get a direct consultation by visiting our physical store, using the 'Place an Order' sequence on our cloud interface, or by reaching out directly to our support team through WhatsApp."
  },
  {
    id: 3,
    question: "Can you shoot on location?",
    answer:
      "For specialized enterprise archival collections or highly sensitive historic materials, we offer professional on-site evaluation and custom consultation setups to securely map out the preservation process."
  },
  {
    id: 4,
    question: "How long will it take to get my photos or videos?",
    answer:
      "The timeline depends closely on the volume and overall physical condition of the assets. Once the digitization, cleaning, and indexing process is completed, you receive instant secure private download access."
  },
  {
    id: 5,
    question: "Can I request revisions?",
    answer:
      "Yes, absolute technical accuracy is our priority. We offer test digitization samples beforehand so you can evaluate technical compatibility and output quality before your primary project officially begins."
  }
];

export default function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-16 md:py-24 px-6 md:px-20 lg:px-32 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* العنوان الرئيسي للقسم */}
        <h2
          className="font-poppins
          text-primary
          text-[26px]
          sm:text-[30px]
          md:text-[30px]
          lg:text-[40px]
          leading-tight
          font-[500]
          text-center mb-16"
        >
          Frequently Asked Question
        </h2>

        {/* قائمة الأسئلة */}
        <div className="space-y-0 border-t border-black/10">
          {faqData.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="border-b border-black/10 transition-colors duration-200"
              >
                {/* زر السؤال الضغاط */}
                <button
                  onClick={() => toggleFaq(item.id)}
                  className="w-full py-6 flex items-center justify-between text-left group gap-4"
                >
                  <h3 className="font-poppins text-primary text-[18px] sm:text-[22px] lg:text-[24px] font-[400] leading-snug transition-colors group-hover:opacity-80">
                    {item.id}. {item.question}
                  </h3>

                  {/* أيقونة السهم التفاعلية للتكبير/التصغير */}
                  <Icon
                    icon="hugeicons:arrow-down-01"
                    className={`text-primary text-2xl flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* جزء الإجابة - يفتح وينغلق بسلاسة */}
                <div
                  className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100 pb-6"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="font-poppins text-black text-[14px] sm:text-[15px] md:text-[16px] leading-relaxed opacity-90 max-w-3xl">
                      {item.answer}
                    </p>
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
