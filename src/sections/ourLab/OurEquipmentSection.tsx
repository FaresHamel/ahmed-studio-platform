import CardGrid, { CardItem } from "@/src/components/sections/CardGrid";

interface EquipmentStep extends CardItem {
  id: number;
  title: string;
  description: string;
  icon: string;
}

const steps: EquipmentStep[] = [
  {
    id: 1,
    title: "Full Refurbished",
    description:
      "We make sure each device are fully component replaced to meet manifacture specifications.",
    icon: "1"
  },
  {
    id: 2,
    title: "Calibrated",
    description:
      "Aligned head drum and sound tracking to match manifacture reading.",
    icon: "2"
  },
  {
    id: 3,
    title: "Low Hours",
    description:
      "Replace device by low hours drum is one of most important thing to reach highest quality for the data stored in tapes.",
    icon: "3"
  }
];

export default function OurEquipmentSection() {
  const renderEquipmentCard = (step: EquipmentStep) => (
    <div className="bg-[#FFEDDE] rounded-[20px] p-8 flex flex-col items-center text-center w-full min-h-[260px]">
      <div className="bg-[#FFD7D3] rounded-[30px] w-10 h-10 flex items-center justify-center mb-6 shrink-0">
        <span className="font-poppins text-[#EB2725] font-semibold text-[20px]">
          {step.icon}
        </span>
      </div>

      <h3 className="font-poppins text-black font-[500] text-lg mb-3 mt-[10px]">
        {step.title}
      </h3>

      <p className="font-poppins text-black text-[10px] leading-relaxed">
        {step.description}
      </p>
    </div>
  );

  return (
    <div className="flex flex-col items-center my-[100px]">
      <div className="mb-16 text-center">
        <h2 className="font-poppins text-black text-[26px] sm:text-[32px] md:text-5xl font-[500]">
          Our Equipment
        </h2>
      </div>

      <div className="w-full max-w-5xl">
        <CardGrid
          items={steps}
          renderCard={renderEquipmentCard}
          columns={{ mobile: 1, tablet: 2, desktop: 3 }}
          gap="medium"
          containerClassName="justify-items-center justify-center items-stretch"
        />
      </div>
    </div>
  );
}
