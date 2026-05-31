"use client";
import { Icon } from "@iconify/react";
import { useI18n } from "@/src/i18n/context";

const prices = ["0", "24", "100"];
const isMainFlags = [false, true, false];

export default function SubscriptionSection() {
  const { t } = useI18n();
  const plans = t.home.subscription.plans.map((plan, i) => ({
    ...plan,
    price: prices[i],
    isMain: isMainFlags[i]
  }));

  return (
    <section className="py-5 md:mb-15 px-4 bg-white overflow-hidden">
      <h2 className="text-primary text-[28px] md:text-[40px] font-[500] text-center mb-10 md:mb-16">
        {t.home.subscription.title}
      </h2>
      {/* Mobile scroll */}
      <div className="md:hidden overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 w-max px-1">
          {plans.map((plan, index) => (
            <div key={index} className={`min-w-[280px] max-w-[280px] relative p-6 rounded-[20px] transition-all duration-300 ${plan.isMain ? "bg-[#FFFBF0] border border-black" : "bg-[#FFF1CC]"} flex flex-col`}>
              <h3 className="text-primary text-[18px] font-[600] mb-3">{plan.name}</h3>
              <div className="flex items-baseline mb-3">
                <span className="text-black text-[36px] font-[500]">£{plan.price}</span>
                <span className="text-black/60 text-[14px] ms-2">{t.home.subscription.perMonth}</span>
              </div>
              <p className="text-primary text-[14px] mb-6 leading-relaxed">{plan.desc}</p>
              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="bg-black/60 rounded-full p-1 mt-1">
                      <Icon icon="hugeicons:tick-01" className="text-white text-[10px]" />
                    </div>
                    <span className="text-black/80 text-[14px]">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-xl font-[400] text-[16px] transition-all ${plan.isMain ? "bg-black text-white hover:bg-black/80" : "bg-primary text-white hover:opacity-90"}`}>
                {t.home.subscription.buyPlan}
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Desktop */}
      <div className="hidden md:grid max-w-6xl mx-auto grid-cols-2 lg:grid-cols-3 items-center gap-8 lg:gap-10">
        {plans.map((plan, index) => (
          <div key={index} className={`relative p-8 lg:p-10 rounded-[20px] transition-all duration-300 ${plan.isMain ? "bg-[#FFFBF0] border border-black scale-105 z-10 lg:h-[650px]" : "bg-[#FFF1CC] lg:h-[600px]"} flex flex-col`}>
            <h3 className="text-primary text-[20px] font-[600] mb-4">{plan.name}</h3>
            <div className="flex items-baseline mb-4">
              <span className="text-black text-[42px] lg:text-[48px] font-[500]">£{plan.price}</span>
              <span className="text-black/60 text-[16px] ms-2">{t.home.subscription.perMonth}</span>
            </div>
            <p className="text-primary text-[16px] lg:text-[18px] mb-8 leading-snug">{plan.desc}</p>
            <ul className="space-y-4 mb-10 flex-grow">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="bg-black/60 rounded-full p-1">
                    <Icon icon="hugeicons:tick-01" className="text-white text-xs" />
                  </div>
                  <span className="text-black/80 text-[15px] lg:text-[16px]">{feature}</span>
                </li>
              ))}
            </ul>
            <button className={`w-full py-4 rounded-xl font-[400] text-[18px] transition-all ${plan.isMain ? "bg-black text-white hover:bg-black/80" : "bg-primary text-white hover:opacity-90"}`}>
              {t.home.subscription.buyPlan}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
