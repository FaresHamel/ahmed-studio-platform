"use client";
import AppointmentModal from "@/src/components/ui/Modal/AppointmentModal";
import { Icon } from "@iconify/react";
import { useState } from "react";


interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface WhyAhmedStudioProps {
  title?: string;
  subtitle?: string;
  features?: Feature[];
  buttonText?: string;
  buttonHref?: string;
  onButtonClick?: () => void;
}

const defaultFeatures: Feature[] = [
  {
    icon: "mdi:star-check",
    title: "High Quality",
    description: "Outputs built to last and exceed industry standards."
  },
  {
    icon: "mdi:wrench",
    title: "Clear Documentation",
    description: "Clear logs and documentation for every project step."
  },
  {
    icon: "mdi:earth",
    title: "International Standards",
    description: "Expert processes aligned with international benchmarks."
  },
  {
    icon: "mdi:chart-timeline",
    title: "Project Lifecycle",
    description: "Smooth, disciplined management from start to finish."
  }
];

export default function WhyAhmedStudio({
  title = "Why Ahmed Studio Consulting?",
  subtitle = "Industry-Leading Expertise and Commitment",
  features = defaultFeatures,
  buttonText = "Book Your Free 15-Min Consultation",
  buttonHref = "/consultation",
  onButtonClick
}: WhyAhmedStudioProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

   const handleAppointmentSubmit = (data:any) => {
     console.log("Appointment booked:", data);
     // Send to your API
     // await fetch('/api/appointments', {
     //   method: 'POST',
     //   body: JSON.stringify(data),
     // });
   };

  return (
    <>
      <section className="w-full py-12 md:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          {/* Title */}
          <div className="mb-12 md:mb-16">
            <h2 className="font-poppins text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-6xl leading-tight font-[500] text-center mb-4">
              {title}
            </h2>
            {subtitle && (
              <p className="text-center text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white px-8 md:px-10 py-4 md:py-5 rounded-lg font-bold text-base md:text-lg transition-all duration-300 hover:shadow-lg active:scale-95"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </section>
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAppointmentSubmit}
      />
    </>
  );
}

interface FeatureCardProps {
  feature: Feature;
}

function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <div className="bg-gray-50 rounded-2xl p-6 md:p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Icon Container */}
      <div className="w-16 h-16 md:w-20 md:h-20 bg-primary rounded-xl flex items-center justify-center mb-6">
        <Icon
          icon={feature.icon}
          width="32"
          height="32"
          className="text-white"
        />
      </div>

      {/* Content */}
      <h3 className="text-lg md:text-xl font-bold text-black mb-3">
        {feature.title}
      </h3>
      <p className="text-gray-600 text-sm md:text-base leading-relaxed">
        {feature.description}
      </p>
    </div>
  );
}
