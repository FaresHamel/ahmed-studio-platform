"use client";

import { Icon } from "@iconify/react";

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

interface BenefitsGridProps {
  title?: string;
  subtitle?: string;
  benefits?: Benefit[];
  containerLayout?: "grid" | "flex";
}

const defaultBenefits: Benefit[] = [
  {
    icon: "mdi:file-document",
    title:
      "Your content is preserved in authentic, preservation-grade master files",
    description: ""
  },
  {
    icon: "mdi:clock-outline",
    title:
      "Long-term preservation is ensured through correct formats and storage strategies",
    description: ""
  },
  {
    icon: "mdi:people",
    title: "Your archive remains accessible and usable for future generations",
    description: ""
  },
  {
    icon: "mdi:tag-multiple",
    title:
      "Metadata is properly applied, guaranteeing discoverability, context, and rights management",
    description: ""
  },
  {
    icon: "mdi:shield-check",
    title: "The risk of quality loss or re-digitization is eliminated",
    description: ""
  }
];

export default function BenefitsGrid({
  title = "Beyond Digitization",
  subtitle = "The Value of Professional Archival Consulting",
  benefits = defaultBenefits,
  containerLayout = "flex"
}: BenefitsGridProps) {
  return (
    <section className="w-full py-12 md:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Optional Header */}
        {title && (
          <div className="mb-12 md:mb-16">
            <h2 className="text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-6xl leading-tight font-[500] text-center mb-4">
              {title}
            </h2>
            {subtitle && (
              <p className="text-center text-gray-600 text-sm md:text-base">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Benefits Container - FLEX ROW (All in one line, wraps on smaller screens) */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} benefit={benefit} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface BenefitCardProps {
  benefit: Benefit;
}

function BenefitCard({ benefit }: BenefitCardProps) {
  return (
    <div className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(33.333%-1rem)] bg-gray-50 rounded-2xl p-6 md:p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center">
      {/* Icon */}
      <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center mb-4 md:mb-6">
        <Icon
          icon={benefit.icon}
          width="24"
          height="24"
          className="text-primary"
        />
      </div>

      {/* Title */}
      <h3 className="text-base md:text-lg font-semibold text-black leading-tight">
        {benefit.title}
      </h3>

      {/* Description (if provided) */}
      {benefit.description && (
        <p className="text-gray-600 text-sm md:text-base leading-relaxed mt-3">
          {benefit.description}
        </p>
      )}
    </div>
  );
}
