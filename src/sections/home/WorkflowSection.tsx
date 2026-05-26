import { Icon } from "@iconify/react";
const steps = [
  {
    title: "Place an Order",
    description: "Place an order from our store/whatsapp.",
    icon: "solar:cart-large-minimalistic-bold-duotone" // Shopping cart icon
  },
  {
    title: "Shipment",
    description: "Your shipment will be picked up by our trusted logistic Co.",
    icon: "solar:delivery-bold-duotone" // Delivery truck icon
  },
  {
    title: "Digitization",
    description:
      "Professional-grade media conversion with private content handled by trained female staff.",
    icon: "solar:scanner-bold-duotone"
  },
  {
    title: "Instant Access",
    description: "View your digitized memories instantly on our secure cloud.",
    icon: "solar:cloud-upload-bold-duotone"
  },
  {
    title: "Safely Returned",
    description:
      "Your original media is returned to you via our tracked truck service.",
    icon: "solar:verified-check-bold-duotone"
  }
];

export default function WorkflowSection() {
  return (
    <div className="flex flex-col items-center">
      {/* Section 1: Main title */}
      <div className="mb-16 text-center">
        <h2
          className="
          font-poppins
          text-primary
          text-[26px]
          sm:text-[32px]
          md:text-5xl
          font-[500]
        "
        >
          How It Works
        </h2>
      </div>

      {/* Section 2: Five cards container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 w-full">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-[#F7F1EC] rounded-[20px] p-8 flex flex-col items-center text-center"
          >
            {/* Small icon box with rounded-[10px] and primary color */}
            <div className="bg-[#B39174] rounded-[10px] w-20 h-20 flex items-center justify-center mb-6">
              <Icon icon={step.icon} className="text-white text-3xl" />
            </div>

            {/* Step title in primary color */}
            <h3 className="font-poppins text-primary font-[400] text-lg mb-3">
              {step.title}
            </h3>

            {/* Step description in black */}
            <p className="font-poppins text-black text-[10px] leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
