"use client";
import { Icon } from "@iconify/react";
import AppointmentModal from "@/src/components/ui/Modal/AppointmentModal";
import { useState } from "react";

interface ConsequencePoint {
  icon: string;
  text: string;
}
interface ApproachPoint {
  icon: string;
  text: string;
}
interface ReadyToPreserveProps {
  mainTitle?: string;
  mainDescription?: string;
  buttonText?: string;
  buttonHref?: string;
  onButtonClick?: () => void;
  consequencePoints?: ConsequencePoint[];
  approachPoints?: ApproachPoint[];
}
const defaultConsequencePoints: ConsequencePoint[] = [
  {
    icon: "mdi:trash-can",
    text: "Lost historical and cultural value"
  },
  {
    icon: "mdi:bug",
    text: "Technical incompatibility in the future"
  },
  {
    icon: "mdi:trending-up",
    text: "Increased long-term costs"
  },
  {
    icon: "mdi:lock",
    text: "Permanent damage to irreplaceable content"
  }
];
const defaultApproachPoints: ApproachPoint[] = [
  {
    icon: "mdi:archive-check",
    text: "Long-term preservation of your content"
  },
  {
    icon: "mdi:cloud-check",
    text: "Reliable and future access to your media"
  },
  {
    icon: "mdi:database-check",
    text: "Proper metadata application, enabling search, identification, rights management, and historical context"
  },
  {
    icon: "mdi:certificate",
    text: "Authentic, preservation-grade master files that will never need to be digitized again"
  }
];

export default function ReadyToPreserve({
  mainTitle = "Ready to Preserve Your Archives Properly?",
  mainDescription = "Get expert consultation to ensure your digitization project meets the highest preservation standards.",
  buttonText = "Schedule A Consultation",
  // buttonHref = "/consultation",
  // onButtonClick,
  consequencePoints = defaultConsequencePoints,
  approachPoints = defaultApproachPoints
}: ReadyToPreserveProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAppointmentSubmit = (data: any) => {
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
          {/* Two Column Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 mb-12 md:mb-16 lg:mb-20">
            {/* Left Card - Consequences */}
            <div className="border-2 border-gray-200 rounded-2xl p-8 md:p-10 hover:shadow-lg transition-all duration-300">
              <p className="text-primary font-bold text-xs md:text-sm uppercase tracking-widest mb-4">
                HIDDEN CONSEQUENCES
              </p>
              <h3 className="text-3xl md:text-4xl font-bold text-black mb-8 leading-tight">
                The True Cost of Doing It Wrong
              </h3>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-8">
                Poor digitization decisions may appear cost-effective at the
                beginning, but they often result in:
              </p>

              {/* Consequences List */}
              <div className="space-y-4">
                {consequencePoints.map((point, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <Icon
                      icon={point.icon}
                      width="20"
                      height="20"
                      className="text-red-500 flex-shrink-0 mt-0.5"
                    />
                    <span className="text-gray-700 text-sm md:text-base">
                      {point.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Card - Our Approach */}
            <div className="border-2 border-gray-200 rounded-2xl p-8 md:p-10 hover:shadow-lg transition-all duration-300">
              <p className="text-primary font-bold text-xs md:text-sm uppercase tracking-widest mb-4">
                OUR APPROACH
              </p>
              <h3 className="text-3xl md:text-4xl font-bold text-black mb-8 leading-tight">
                Digitization as a Preservation Strategy
              </h3>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-8">
                Digitization is not simply about a VTR and an analog-to-digital
                converter. It is a comprehensive system of hardware, software,
                workflows, standards, and preservation strategies designed to
                protect your archive for the long term.
              </p>

              {/* Approach List */}
              <div className="space-y-4">
                {approachPoints.map((point, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <Icon
                      icon={point.icon}
                      width="20"
                      height="20"
                      className="text-blue-500 flex-shrink-0 mt-0.5"
                    />
                    <span className="text-gray-700 text-sm md:text-base">
                      {point.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col items-center text-center">
            <h2 className="font-poppins text-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight font-[500] mb-6 md:mb-8">
              {mainTitle}
            </h2>
            <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto mb-8 md:mb-12">
              {mainDescription}
            </p>
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
