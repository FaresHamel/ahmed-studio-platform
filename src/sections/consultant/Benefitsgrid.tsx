"use client";
import { Icon } from "@iconify/react";
import { useI18n } from "@/src/i18n/context";

const benefitIcons = [
  "mdi:file-document",
  "mdi:clock-outline",
  "mdi:people",
  "mdi:tag-multiple",
  "mdi:shield-check"
];

export default function BenefitsGrid() {
  const { t } = useI18n();
  const b = t.consultant.benefits;
  const benefits = b.items.map((text, i) => ({ icon: benefitIcons[i] ?? "mdi:check", title: text }));

  return (
    <section className="w-full py-12 md:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="mb-12 md:mb-16">
          <h2 className="text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-6xl leading-tight font-[500] text-center mb-4">
            {b.title}
          </h2>
          <p className="text-center text-gray-600 text-sm md:text-base">{b.subtitle}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(33.333%-1rem)] bg-gray-50 rounded-2xl p-6 md:p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center mb-4 md:mb-6">
                <Icon icon={benefit.icon} width="24" height="24" className="text-primary" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-black leading-tight">{benefit.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
