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
    <section className="py-8 md:py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-primary text-[26px] sm:text-[34px] md:text-[40px] font-[500] text-center mb-8 md:mb-16">
          {t.home.subscription.title}
        </h2>
        <div className="md:hidden overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4">
          <div className="flex gap-3.5 w-max pb-4">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`min-w-[245px] max-w-[245px] snap-center relative p-5 rounded-xl transition-all duration-300 flex flex-col ${
                  plan.isMain
                    ? "bg-[#FFFBF0] border border-black"
                    : "bg-[#FFF1CC]"
                }`}
              >
                <h3 className="text-primary text-[16px] font-[600] mb-2">
                  {plan.name}
                </h3>

                <div className="flex items-baseline mb-2">
                  <span className="text-black text-[28px] font-[500]">
                    £{plan.price}
                  </span>
                  <span className="text-black/60 text-[12px] ms-1.5">
                    {t.home.subscription.perMonth}
                  </span>
                </div>

                <p className="text-primary text-[13px] mb-4 leading-relaxed min-h-[40px]">
                  {plan.desc}
                </p>

                <ul className="space-y-2.5 mb-5 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="bg-black/60 rounded-full p-0.5 mt-0.5 flex-shrink-0">
                        <Icon
                          icon="hugeicons:tick-01"
                          className="text-white text-[9px]"
                        />
                      </div>
                      <span className="text-black/80 text-[13px] leading-tight">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-2.5 rounded-lg font-[500] text-[15px] transition-all active:scale-95 ${
                    plan.isMain
                      ? "bg-black text-white hover:bg-black/80"
                      : "bg-primary text-white hover:opacity-90"
                  }`}
                >
                  {t.home.subscription.buyPlan}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* --- DESKTOP VIEW: Grid Layout (Untouched) --- */}
        <div className="hidden md:grid max-w-6xl mx-auto grid-cols-2 lg:grid-cols-3 items-center gap-8 lg:gap-10 md:px-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 lg:p-10 rounded-[20px] transition-all duration-300 flex flex-col ${
                plan.isMain
                  ? "bg-[#FFFBF0] border border-black scale-105 z-10 lg:h-[650px]"
                  : "bg-[#FFF1CC] lg:h-[600px]"
              }`}
            >
              <h3 className="text-primary text-[20px] font-[600] mb-4">
                {plan.name}
              </h3>
              <div className="flex items-baseline mb-4">
                <span className="text-black text-[42px] lg:text-[48px] font-[500]">
                  £{plan.price}
                </span>
                <span className="text-black/60 text-[16px] ms-2">
                  {t.home.subscription.perMonth}
                </span>
              </div>
              <p className="text-primary text-[16px] lg:text-[18px] mb-8 leading-snug">
                {plan.desc}
              </p>
              <ul className="space-y-4 mb-10 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="bg-black/60 rounded-full p-1 flex-shrink-0">
                      <Icon
                        icon="hugeicons:tick-01"
                        className="text-white text-xs"
                      />
                    </div>
                    <span className="text-black/80 text-[15px] lg:text-[16px]">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-4 rounded-xl font-[400] text-[18px] transition-all ${
                  plan.isMain
                    ? "bg-black text-white hover:bg-black/80"
                    : "bg-primary text-white hover:opacity-90"
                }`}
              >
                {t.home.subscription.buyPlan}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
