"use client";
import { Icon } from "@iconify/react";
import AppointmentModal from "@/src/components/ui/Modal/AppointmentModal";
import { useState } from "react";
import { useI18n } from "@/src/i18n/context";

const consequenceIcons = ["mdi:trash-can", "mdi:bug", "mdi:trending-up", "mdi:lock"];
const approachIcons = ["mdi:archive-check", "mdi:cloud-check", "mdi:database-check", "mdi:certificate"];

export default function ReadyToPreserve() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useI18n();
  const r = t.consultant.readyToPreserve;

  const consequencePoints = r.hiddenItems.map((text, i) => ({ icon: consequenceIcons[i] ?? "mdi:close", text }));
  const approachPoints = r.approachItems.map((text, i) => ({ icon: approachIcons[i] ?? "mdi:check", text }));

  return (
    <>
      <section className="w-full py-12 md:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 mb-12 md:mb-16 lg:mb-20">
            <div className="border-2 border-gray-200 rounded-2xl p-8 md:p-10 hover:shadow-lg transition-all duration-300">
              <p className="text-primary font-bold text-xs md:text-sm uppercase tracking-widest mb-4">{r.hiddenLabel}</p>
              <h3 className="text-3xl md:text-4xl font-bold text-black mb-8 leading-tight">{r.hiddenTitle}</h3>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-8">{r.hiddenIntro}</p>
              <div className="space-y-4">
                {consequencePoints.map((point, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <Icon icon={point.icon} width="20" height="20" className="text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm md:text-base">{point.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-2 border-gray-200 rounded-2xl p-8 md:p-10 hover:shadow-lg transition-all duration-300">
              <p className="text-primary font-bold text-xs md:text-sm uppercase tracking-widest mb-4">{r.approachLabel}</p>
              <h3 className="text-3xl md:text-4xl font-bold text-black mb-8 leading-tight">{r.approachTitle}</h3>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-8">{r.approachDesc}</p>
              <div className="space-y-4">
                {approachPoints.map((point, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <Icon icon={point.icon} width="20" height="20" className="text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm md:text-base">{point.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center text-center">
            <h2 className="text-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight font-[500] mb-6 md:mb-8">
              {r.ctaTitle}
            </h2>
            <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto mb-8 md:mb-12">{r.ctaDesc}</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white px-8 md:px-10 py-4 md:py-5 rounded-lg font-bold text-base md:text-lg transition-all duration-300 hover:shadow-lg active:scale-95"
            >
              {r.ctaButton}
            </button>
          </div>
        </div>
      </section>
      <AppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={(data) => console.log("Appointment booked:", data)} />
    </>
  );
}
