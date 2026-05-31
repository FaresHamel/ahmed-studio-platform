import { Icon } from "@iconify/react";
import CardGrid, { CardItem } from "@/src/components/sections/CardGrid";

interface ConsultingService extends CardItem {
  id: number;
  icon: string;
  title: string;
  features: string[];
}

const services: ConsultingService[] = [
  {
    id: 1,
    icon: "hugeicons:workflow-01",
    title: "Workflow Design & Project Planning",
    features: [
      "Media assessment and prioritization",
      "Tape and film handling rules",
      "Digitization standards (RAW) Preservation Masters",
      "Quality control and validation steps"
    ]
  },
  {
    id: 2,
    icon: "hugeicons:view-01",
    title: "Archive Evaluation & Media Treatment",
    features: [
      "Media condition and risks",
      "Required treatments before digitization",
      "Best technical approach per format",
      "Preservation priorities"
    ]
  },
  {
    id: 3,
    icon: "hugeicons:note-01",
    title: "Technical Proposals & RFP Support",
    features: [
      "Writing and reviewing RFPs",
      "Defining technical specifications",
      "Setting quality and delivery benchmarks",
      "Avoiding vague or risky requirements"
    ]
  },
  {
    id: 4,
    icon: "hugeicons:tools-01",
    title: "Equipment Selection & Supply",
    features: [
      "Professional digitization machines",
      "Restoration and processing systems",
      "Storage and backup solutions",
      "Procurement support and validation"
    ]
  },
  {
    id: 5,
    icon: "hugeicons:clipboard-check",
    title: "Project Supervision & Quality Assurance",
    features: [
      "Monitoring workflows and outputs",
      "Ensuring compliance with international best practices",
      "Verifying file integrity, formats, and metadata",
      "Aligning the project with its original goals"
    ]
  }
];

export default function ConsultingServicesSection() {
  const renderServiceCard = (service: ConsultingService) => (
    <div className="bg-white/5 hover:bg-white/10 border-t-4 border-primary rounded-xl p-5 md:p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm text-sm sm:text-base h-full">
      <div className="text-primary text-2xl md:text-3xl mb-4 flex items-center justify-start">
        <Icon icon={service.icon} />
      </div>

      <h3 className="font-poppins font-[500] text-white text-[16px] sm:text-[18px] lg:text-[19px] leading-snug mb-4 min-h-[48px] lg:min-h-[60px]">
        {service.title}
      </h3>

      <ul className="space-y-2 flex-grow">
        {service.features.map((feature, idx) => (
          <li
            key={idx}
            className="font-poppins text-white/70 text-[12px] md:text-[14px] leading-relaxed relative pl-4 before:content-['•'] before:text-primary before:absolute before:left-0 before:font-bold"
          >
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-20 bg-[#111111] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-poppins text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-6xl leading-tight font-[500] text-center mb-12 md:mb-20">
          Our Consulting Services
        </h2>

        <CardGrid
          items={services}
          renderCard={renderServiceCard}
          columns={{ mobile: 1, tablet: 2, desktop: 5 }}
          gap="medium"
          containerClassName="items-stretch"
        />
      </div>
    </section>
  );
}
