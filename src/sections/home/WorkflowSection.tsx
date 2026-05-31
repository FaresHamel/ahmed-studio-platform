"use client";
import { Icon } from "@iconify/react";
import { useI18n } from "@/src/i18n/context";

const icons = [
  "solar:cart-large-minimalistic-bold-duotone",
  "solar:delivery-bold-duotone",
  "solar:scanner-bold-duotone",
  "solar:cloud-upload-bold-duotone",
  "solar:verified-check-bold-duotone"
];

export default function WorkflowSection() {
  const { t } = useI18n();
  const steps = t.home.workflow.steps.map((step, i) => ({ ...step, icon: icons[i] }));

  return (
    <div className="flex flex-col items-center px-4 py-12 max-w-7xl mx-auto w-full">
      <div className="mb-16 text-center">
        <h2 className="text-primary text-[26px] sm:text-[32px] md:text-5xl font-[500]">
          {t.home.workflow.title}
        </h2>
      </div>

      {/* Mobile/Tablet Timeline */}
      <div className="relative flex flex-col items-center w-full max-w-md lg:hidden">
        <div className="absolute top-4 bottom-4 left-1/2 -translate-x-1/2 w-[2px] bg-[#B39174]/40" />
        {steps.map((step, index) => {
          const isEven = index % 2 === 0;
          return (
            <div key={index} className="relative flex items-center justify-between w-full mb-12 last:mb-0">
              <div className={`w-[42%] flex flex-col justify-center ${isEven ? "text-right items-end" : "opacity-0 pointer-events-none select-none hidden sm:flex"}`}>
                {isEven && (
                  <div className="bg-[#F7F1EC] rounded-[16px] p-4 shadow-sm border border-[#B39174]/10 w-full">
                    <h3 className="text-primary font-medium text-sm mb-1">{step.title}</h3>
                    <p className="text-black text-[10px] leading-tight">{step.description}</p>
                  </div>
                )}
              </div>
              <div className="relative flex items-center justify-center w-[16%] z-10">
                <div className={`absolute top-1/2 -translate-y-1/2 h-[2px] bg-[#B39174]/40 w-6 hidden sm:block ${isEven ? "right-1/2 mr-5" : "left-1/2 ml-5"}`} />
                <div className="bg-[#B39174] mr-3 border-2 border-white shadow-sm rounded-full w-10 h-10 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[9px] mb-1 text-white/80 font-mono tracking-tighter uppercase leading-none -mb-0.5">Step</span>
                  <span className="text-xs font-bold text-white leading-none">0{index + 1}</span>
                </div>
              </div>
              <div className={`w-[42%] sm:w-[42%] flex-1 sm:flex-none flex flex-col justify-center ${!isEven ? "text-left items-start" : "sm:opacity-0 sm:pointer-events-none sm:select-none sm:hidden"}`}>
                <div className="bg-[#F7F1EC] rounded-[16px] p-4 shadow-sm border border-[#B39174]/10 w-full flex gap-3 items-center sm:block">
                  <div className="bg-[#B39174] rounded-[8px] w-10 h-10 flex items-center justify-center shrink-0 sm:mb-2">
                    <Icon icon={step.icon} className="text-white text-lg" />
                  </div>
                  <div>
                    <h3 className="text-primary font-medium text-sm mb-1">{step.title}</h3>
                    <p className="text-black text-[10px] leading-tight">{step.description}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Grid */}
      <div className="hidden lg:grid grid-cols-5 gap-6 w-full">
        {steps.map((step, index) => (
          <div key={index} className="bg-[#F7F1EC] rounded-[20px] p-6 xl:p-8 flex flex-col items-center text-center border border-transparent hover:border-[#B39174]/20 transition-all duration-300 group">
            <div className="bg-[#B39174] rounded-[10px] w-20 h-20 flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-105">
              <Icon icon={step.icon} className="text-white text-3xl" />
            </div>
            <h3 className="text-primary font-[400] text-base xl:text-lg mb-3">{step.title}</h3>
            <p className="text-black text-[10px] leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
