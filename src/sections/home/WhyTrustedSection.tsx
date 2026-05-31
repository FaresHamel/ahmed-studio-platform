"use client";
import { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";

interface TrustItem {
  id: string;
  title: string;
  icon: string;
  description: string;
}

// Exactly mapping your 6 required fields with custom descriptive contexts
const trustItems: TrustItem[] = [
  {
    id: "CALIBRATED",
    title: "Calibrated Equipment",
    icon: "hugeicons:camera-lens",
    description:
      "Our digitization systems and decks undergo rigorous technical calibrations to guarantee absolute signal fidelity and accurate archival capturing output values."
  },
  {
    id: "SIGNAL",
    title: "Signal Processing",
    icon: "carbon:ibm-event-processing",
    description:
      "Advanced broadcast-grade time base correctors (TBC) and hardware signal processors optimize tape tracking stability, correct color vectors, and clean up source distortions."
  },
  {
    id: "FEMALE",
    title: "Female Staff",
    icon: "mdi:account-tie-woman",
    description:
      "We provide dedicated, secure private processing environments supervised entirely by specialized female technical experts to handle family archives with ultimate comfort."
  },
  {
    id: "TEAM",
    title: "Experience & Certified Team",
    icon: "ph:seal-check-light",
    description:
      "Your historical assets are cataloged, treated, and preserved by certified audio-visual archiving professionals trained in international collection management standards."
  },
  {
    id: "AFTER_SALE",
    title: "After Sale Service",
    icon: "streamline:phone-actions-24-hours-call",
    description:
      "Our commitment continues post-delivery. We provide secure master file cloud storage backups, formatting technical support, and easy adjustments to match your playback systems."
  },
  {
    id: "PRIVACY",
    title: "Confidentiality & Privacy",
    icon: "hugeicons:file-lock",
    description:
      "Strict non-disclosure compliance protocols, safe vault storage infrastructure, and air-gapped workstations guarantee your high-profile media contents stay completely secure."
  }
];

export default function WhyTrustedSection() {
  const [activeId, setActiveId] = useState<string>("CALIBRATED");

  const currentItem =
    trustItems.find((item) => item.id === activeId) || trustItems[0];

  return (
    <section className="w-full flex flex-col mb-20 md:flex-row min-h-[700px] bg-[#ebdcd0] md:bg-[#112438] overflow-hidden">
      {/* LEFT COLUMN PANEL */}
      <div className="w-full md:w-[38%] bg-[#ebdcd0] pt-12 pb-10 flex flex-col justify-between text-[#112438]">
        <div>
          {/* 1. Title on a single line with precise spacing */}
          <h2 className="font-poppins text-primary text-xl md:text-2xl lg:text-3xl font-[550] text-center whitespace-nowrap px-4 mb-8">
            Why We Are Trusted
          </h2>

          {/* 2. Top solid separation divider */}
          <div className="w-full h-[1px] bg-[#112438]/30" />

          {/* 3. Core 2x2 Interactive Grid */}
          <div className="grid grid-cols-2 gap-0 relative">
            {/* Continuous center horizontal line separating Row 1 and Row 2 */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#112438]/30 pointer-events-none" />

            {trustItems.slice(0, 4).map((item, index) => (
              <button
                key={item.id}
                // MODIFIED: On mobile, clicking does nothing because the right panel is hidden anyway
                onClick={() => setActiveId(item.id)}
                // MODIFIED: Removed 'group' on mobile to disable hover effects on touch screens
                className={`flex flex-col items-center justify-center p-6 text-center transition-all duration-300 relative min-h-[155px] md:group
              ${index % 2 === 0 ? "border-r border-[#112438]/30" : ""}
              cursor-default md:cursor-pointer
            `}
              >
                <div
                  className={`absolute inset-0 bg-[#112438]/5 transition-opacity duration-300 hidden md:block ${
                    activeId === item.id
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-40"
                  }`}
                />

                {/* Minimal Line Icon - Normal uniform styling on mobile, interactive on desktop */}
                <div
                  className={`mb-3 transition-transform duration-300 text-[#112438] md:text-[#112438]/60 md:group-hover:scale-105 ${
                    activeId === item.id ? "md:text-[#112438] md:scale-110" : ""
                  }`}
                >
                  <Icon icon={item.icon} className="w-9 h-9 stroke-[1.2]" />
                </div>

                {/* Grid Title - Always standard layout color on mobile */}
                <span
                  className={`text-xs md:text-sm tracking-wide text-[#112438] relative z-10 transition-colors md:text-[#112438]/70 ${
                    activeId === item.id
                      ? "md:font-bold md:text-[#112438]"
                      : "font-medium"
                  }`}
                >
                  {item.title}
                </span>
              </button>
            ))}
          </div>

          {/* 4. Bottom solid separation divider closing the grid */}
          <div className="w-full h-[1px] bg-[#112438]/30" />

          {/* 5. Bottom Subtitle supporting area containing combined remaining features */}
          <div className="mt-8 px-6 text-center flex flex-col items-center justify-center">
            {/* Decorative center accent line grid emblem from image */}
            <div className="flex flex-col items-center mb-4 opacity-50">
              <div className="w-12 h-[1px] bg-[#112438]" />
              <Icon
                icon="simple-line-icons:diamonds"
                className="w-5 h-5 my-0.5 text-[#112438]"
              />
              <div className="w-12 h-[1px] bg-[#112438]" />
            </div>

            {/* Grid footer buttons enabling selection of remaining points */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-center max-w-xs mx-auto">
              {trustItems.slice(4, 6).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveId(item.id)}
                  // MODIFIED: Kept fonts standard on mobile device screens without active underlines
                  className={`text-xs md:text-sm tracking-wide font-medium transition-all duration-200 text-[#112438]/70 md:hover:text-[#112438]
                cursor-default md:cursor-pointer
                ${
                  activeId === item.id
                    ? "md:text-[#112438] md:font-bold md:border-b md:border-[#112438]"
                    : ""
                }
              `}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN PANEL (Hidden completely on mobile viewports) */}
      <div className="hidden md:flex w-full md:w-[62%] flex-col relative justify-between bg-[#112438]">
        {/* UPPER ROW Canvas Area */}
        <div className="relative w-full h-[320px] md:h-[60%] overflow-hidden border-b border-white/5">
          <Image
            src="/images/beyond-digitization.jpg"
            alt={currentItem.title}
            fill
            priority
            className="object-cover object-center transition-transform duration-700 scale-100 ease-out"
            sizes="65vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#112438] via-transparent to-black/20" />
        </div>

        {/* LOWER ROW Canvas Area */}
        <div className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-12 flex-1">
          <div className="w-full md:w-[45%] shrink-0">
            <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium tracking-wide text-white leading-tight">
              {currentItem.title}
            </h3>
          </div>

          <div className="hidden md:block w-[1px] h-20 bg-white/20 self-center shrink-0" />
          <div className="flex-1 flex flex-col justify-center gap-4 w-full overflow-hidden">
            <p className="text-stone-300 text-sm md:text-base leading-relaxed font-light">
              {currentItem.description || currentItem.title}
            </p>

            <a
              href="mailto:old-to-new@hotmail.com"
              className="flex items-center gap-3 mt-2 group cursor-pointer w-max max-w-full text-left select-none"
            >
              <div className="w-9 h-9 rounded-full bg-[#ebdcd0] text-[#112438] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-sm">
                <Icon icon="lucide:mail" className="w-4 h-4 stroke-[2]" />
              </div>
              <span className="text-xs lg:text-sm font-medium tracking-wide text-stone-200 group-hover:text-white transition-colors border-b border-transparent group-hover:border-white/40 pb-0.5 truncate max-w-[160px] sm:max-w-[220px] md:max-w-[140px] lg:max-w-none">
                For contact and inquiries
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
