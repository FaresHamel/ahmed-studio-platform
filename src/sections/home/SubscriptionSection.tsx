import { Icon } from "@iconify/react";

const plans = [
  {
    name: "Trial Plan",
    price: "0",
    desc: "Experience the magic of your digital history.",
    features: [
      "Secure 5GB Storage",
      "14 Days of Free Access",
      "4 free guest accounts",
      "Multi-Device Streaming",
      "Global Sharing"
    ],
    isMain: false
  },
  {
    name: "Standard Cloud",
    price: "24",
    desc: "Secure, long-term hosting for home movies.",
    features: [
      "Secure 10GB Storage",
      "AI Tagging & Indexing",
      "Deep Search Functionality",
      "Multi-Platform Access",
      "Extended Hosting"
    ],
    isMain: true
  },
  {
    name: "Pro Archival",
    price: "100",
    desc: "Enterprise-grade preservation for large collections.",
    features: [
      "Secure 20GB+ Storage",
      "RFP Development Support",
      "Comprehensive Archive",
      "Test Digitization Samples",
      "Unlimited Sharing"
    ],
    isMain: false
  }
];

export default function SubscriptionSection() {
  return (
    <section className="py-5 md:mb-15 px-4 bg-white overflow-hidden">
      <h2 className="text-primary text-[28px] md:text-[40px] font-[500] text-center mb-10 md:mb-16">
        Subscription Plan
      </h2>

      {/* MOBILE SCROLL */}
      <div className="md:hidden overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 w-max px-1">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`
            min-w-[280px]
            max-w-[280px]
            relative p-6 rounded-[20px]
            transition-all duration-300
            ${plan.isMain ? "bg-[#FFFBF0] border border-black" : "bg-[#FFF1CC]"}
            flex flex-col
          `}
            >
              <h3 className="text-primary text-[18px] font-[600] mb-3">
                {plan.name}
              </h3>

              <div className="flex items-baseline mb-3">
                <span className="text-black text-[36px] font-[500]">
                  £{plan.price}
                </span>

                <span className="text-black/60 text-[14px] ml-2">
                  /Month
                </span>
              </div>

              <p className="text-primary text-[14px] mb-6 leading-relaxed">
                {plan.desc}
              </p>

              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="bg-black/60 rounded-full p-1 mt-1">
                      <Icon
                        icon="hugeicons:tick-01"
                        className="text-white text-[10px]"
                      />
                    </div>

                    <span className="text-black/80 text-[14px]">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`
              w-full py-3 rounded-xl
              font-[400]
              text-[16px] transition-all
              ${
                plan.isMain
                  ? "bg-black text-white hover:bg-black/80"
                  : "bg-primary text-white hover:opacity-90"
              }
            `}
              >
                Buy Plan
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* TABLET + DESKTOP */}
      <div className="hidden md:grid max-w-6xl mx-auto grid-cols-2 lg:grid-cols-3 items-center gap-8 lg:gap-10">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`
          relative p-8 lg:p-10 rounded-[20px]
          transition-all duration-300
          ${
            plan.isMain
              ? "bg-[#FFFBF0] border border-black scale-105 z-10 lg:h-[650px]"
              : "bg-[#FFF1CC] lg:h-[600px]"
          }
          flex flex-col
        `}
          >
            <h3 className="text-primary text-[20px] font-[600] mb-4">
              {plan.name}
            </h3>

            <div className="flex items-baseline mb-4">
              <span className="text-black text-[42px] lg:text-[48px] font-[500]">
                £{plan.price}
              </span>

              <span className="text-black/60 text-[16px] ml-2">
                /Month
              </span>
            </div>

            <p className="text-primary text-[16px] lg:text-[18px] mb-8 leading-snug">
              {plan.desc}
            </p>

            <ul className="space-y-4 mb-10 flex-grow">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="bg-black/60 rounded-full p-1">
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
              className={`
            w-full py-4 rounded-xl
            font-[400]
            text-[18px] transition-all
            ${
              plan.isMain
                ? "bg-black text-white hover:bg-black/80"
                : "bg-primary text-white hover:opacity-90"
            }
          `}
            >
              Buy Plan
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
