"use client";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";

interface ServiceItem {
  title: string;
  description: string;
  points: string[];
  icon?: string;
}

interface ConsultingServicesProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  services?: ServiceItem[];
  enableAnimation?: boolean;
}

const defaultServices: ServiceItem[] = [
  {
    title: "Workflow Design & Project Planning",
    description: "Strategic project organization",
    points: [
      "Media assessment and prioritization",
      "Tape and film handling rules",
      "Digitization standards (RAW/ Preservation masters)",
      "Quality control and validation steps"
    ],
    icon: "📋"
  },
  {
    title: "Archive Evaluation & Media Treatment",
    description: "Professional assessment",
    points: [
      "Media condition and risks",
      "Required treatments before digitization",
      "Best technical approach per format",
      "Preservation priorities"
    ],
    icon: "🔍"
  },
  {
    title: "Technical Proposals & RFP Support",
    description: "Expert technical guidance",
    points: [
      "Writing and reviewing RFPs",
      "Defining technical specifications",
      "Setting quality and delivery benchmarks",
      "Avoiding vague or risky requirements"
    ],
    icon: "📝"
  },
  {
    title: "Equipment Selection & Supply",
    description: "Professional digitization solutions",
    points: [
      "Professional digitization machines",
      "Restoration and processing systems",
      "Storage and backup solutions",
      "Avoiding vague or risky requirements"
    ],
    icon: "⚙️"
  },
  {
    title: "Project Supervision & Quality Assurance",
    description: "Quality-focused oversight",
    points: [
      "Monitoring workflows and outputs",
      "Ensuring compliance with international best practices",
      "Verifying file integrity, formats, and metadata",
      "Aligning the project with its original goals"
    ],
    icon: "✅"
  }
];

export default function ConsultingServicesEnhanced({
  title = "Our Consulting Services",
  subtitle = "Comprehensive solutions tailored to your archive needs",
  backgroundImage = "/images/ConsultingImgbk.jpg",
  services = defaultServices,
  enableAnimation = true
}: ConsultingServicesProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enableAnimation) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [enableAnimation]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden"
    >
      {/* Title Section */}
      <div
        className={`max-w-7xl mx-auto px-6 md:px-8 mb-12 md:mb-16 lg:mb-20 transition-all duration-1000 ${
          enableAnimation && isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <h2 className="text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-6xl leading-tight font-[500] text-center mb-4">
          {title}
        </h2>
        {subtitle && (
          <p className="text-center text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      {/* Background Image Container */}
      <div className="relative w-full">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage}
            alt="Consulting Services Background"
            fill
            className="object-cover"
            priority={false}
            quality={85}
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-16 lg:py-20">
          {/* Mobile Layout - Horizontal Scroll (below sm) */}
          <div className="block sm:hidden -mx-4 px-4 pb-4">
            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory">
              {services.map((service, index) => (
                <div
                  key={index}
                  className={`snap-center transition-all duration-700 ${
                    enableAnimation && isVisible ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    transitionDelay:
                      enableAnimation && isVisible ? `${index * 100}ms` : "0ms"
                  }}
                >
                  <ServiceCardMobile service={service} />
                </div>
              ))}
            </div>
            <p className="text-gray-300 text-xs text-center mt-4">
              ← Swipe to see more →
            </p>
          </div>

          {/* Tablet Layout - 2 columns (sm to lg) */}
          <div className="hidden sm:grid lg:hidden grid-cols-2 gap-4 md:gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ${
                  enableAnimation && isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{
                  transitionDelay:
                    enableAnimation && isVisible ? `${index * 100}ms` : "0ms"
                }}
              >
                <ServiceCard service={service} />
              </div>
            ))}
          </div>

          {/* Desktop Layout - 5 columns (lg and above) */}
          <div className="hidden lg:grid grid-cols-5 gap-4 xl:gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ${
                  enableAnimation && isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{
                  transitionDelay:
                    enableAnimation && isVisible ? `${index * 100}ms` : "0ms"
                }}
              >
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface ServiceCardProps {
  service: ServiceItem;
}

function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div
      className={`
        group relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl
        transition-all duration-300 hover:bg-white/15 hover:border-white/40 hover:shadow-xl hover:shadow-black/50
        overflow-hidden h-full hover:-translate-y-2
      `}
    >
      {/* Gradient Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="relative z-10 p-6 md:p-7 lg:p-6 h-full flex flex-col">
        {/* Icon (if provided) */}
        {service.icon && (
          <div className="text-3xl md:text-2xl mb-3 group-hover:scale-110 transition-transform duration-300">
            {service.icon}
          </div>
        )}

        {/* Title */}
        <h3 className="text-white font-bold text-lg md:text-xl lg:text-lg leading-tight mb-2 group-hover:text-blue-300 transition-colors duration-300">
          {service.title}
        </h3>

        {/* Description */}
        <p className="hidden md:block text-gray-200 text-xs md:text-sm lg:text-xs leading-relaxed mb-4 text-opacity-80 group-hover:text-opacity-100 transition-all duration-300">
          {service.description}
        </p>

        {/* Points List */}
        <ul className="space-y-2 md:space-y-2 lg:space-y-2 flex-1">
          {service.points.map((point, idx) => (
            <li
              key={idx}
              className="flex gap-2 items-start text-white/90 text-xs md:text-sm lg:text-xs leading-relaxed group-hover:text-white transition-colors duration-300"
            >
              <span className="text-primary font-bold flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform duration-300">
                •
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>

        {/* Bottom Accent */}
        <div className="mt-4 pt-4 border-t border-white/10 group-hover:border-white/30 transition-colors duration-300">
          <div className="h-1 w-8 bg-gradient-to-r from-primary to-blue-400 group-hover:w-16 transition-all duration-300" />
        </div>
      </div>
    </div>
  );
}

function ServiceCardMobile({ service }: ServiceCardProps) {
  return (
    <div
      className={`
        group relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl
        transition-all duration-300 hover:bg-white/15 hover:border-white/40
        overflow-hidden w-60 flex-shrink-0
      `}
    >
      {/* Content */}
      <div className="relative z-10 p-5 h-full flex flex-col">
        {/* Icon */}
        {service.icon && <div className="text-2xl mb-2">{service.icon}</div>}

        {/* Title */}
        <h3 className="text-white font-bold text-base leading-tight mb-2">
          {service.title}
        </h3>

        {/* Points List */}
        <ul className="space-y-1.5 flex-1">
          {service.points.map((point, idx) => (
            <li
              key={idx}
              className="flex gap-1.5 items-start text-white/90 text-xs leading-relaxed"
            >
              <span className="text-primary font-bold flex-shrink-0 mt-0.5">
                •
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>

        {/* Bottom Accent */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="h-0.5 w-6 bg-gradient-to-r from-primary to-blue-400" />
        </div>
      </div>
    </div>
  );
}
