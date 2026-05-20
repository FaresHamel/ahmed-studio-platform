import { Icon } from "@iconify/react";
const steps = [
  {
    title: "Full Refurbished",
    description:
      "We make sure each device are fully component replaced to meet manifacture specifications.",
    icon: "1" // أيقونة سلة تسوق
  },
  {
    title: "Calibrated",
    description:
      "Aligned head drum and sound tracking to match manifacture reading.",
    icon: "2" // أيقونة شاحنة
  },
  {
    title: "Low Hours",
    description:
      "Replace device by low hours drum is one of most important thing to reach highest quality for the data stored in tapes.",
    icon: "3"
  }
];

export default function OurEquipmentSection() {
  return (
    <div className="flex flex-col items-center my-[100px]">
      {/* الجزء الأول: العنوان الرئيسي */}
      <div className="mb-16 text-center">
        <h2
          className="
              font-poppins
              text-black
              text-[26px]
              sm:text-[32px]
              md:text-5xl
              font-[500]
            "
        >
          Our Equipment
        </h2>
      </div>

      <div className="w-full flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-row lg:flex-wrap lg:justify-center gap-6 justify-items-center justify-center items-center">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-[#FFEDDE] rounded-[20px] p-8 flex flex-col items-center text-center w-full sm:w-auto lg:w-[220px] xl:w-[220px] min-h-[260px]"
          >
            {/* صندوق الأيقونة الصغير بحدود دائرية 10 ولون أساسي */}
            <div className="bg-[#FFD7D3] rounded-[30px] w-10 h-10 flex items-center justify-center mb-6-shrink-0">
              <span className="font-poppins text-[#EB2725] font-semibold text-[20px]">
                {step.icon}
              </span>
            </div>

            {/* عنوان الخطوة ولون أساسي */}
            <h3 className="font-poppins text-[black] font-[500] text-lg mb-3 mt-[10px]">
              {step.title}
            </h3>

            {/* وصف الخطوة ولون أسود */}
            <p className="font-poppins text-black text-[10px] leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
