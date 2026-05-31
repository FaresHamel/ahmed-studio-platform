"use client";
import AppointmentModal from "@/src/components/ui/Modal/AppointmentModal";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { useI18n } from "@/src/i18n/context";

const pillarIcons = ["mdi:star-check", "mdi:wrench", "mdi:earth", "mdi:chart-timeline"];

export default function WhyAhmedStudio() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useI18n();
  const wa = t.consultant.whyAhmedStudio;
  const features = wa.pillars.map((p, i) => ({ icon: pillarIcons[i] ?? "mdi:check", title: p.title, description: p.desc }));

  return (
    <>
      <section className="w-full py-12 md:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="mb-12 md:mb-16">
            <h2 className="text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-6xl leading-tight font-[500] text-center mb-4">{wa.title}</h2>
            <p className="text-center text-gray-600 text-sm md:text-base max-w-2xl mx-auto">{wa.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16">
            {features.map((feature, index) => (
              <div key={index} className="bg-[#F7F1EC] rounded-2xl p-6 md:p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-[#B39174] rounded-xl flex items-center justify-center mb-6">
                  <Icon icon={feature.icon} width="32" height="32" className="text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-[600] text-primary mb-3">{feature.title}</h3>
                <p className="text-black font-[400] text-sm md:text-base leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#937052] hover:bg-primary/90 text-white px-8 md:px-10 py-4 md:py-5 rounded-lg font-bold md:text-lg transition-all duration-300 hover:shadow-lg active:scale-95"
            >
              {wa.cta}
            </button>
          </div>
        </div>
      </section>
      <AppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={(data) => console.log("Appointment booked:", data)} />
    </>
  );
}
