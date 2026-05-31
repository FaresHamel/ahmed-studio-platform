"use client";
import { CardItem } from "@/src/components/sections/CardGrid";
import { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import Link from "next/link";

interface Service extends CardItem {
  id: number;
  category: string;
  title: string;
  image: string;
  description: string;
  points: string[];
}

const services: Service[] = [
  {
    id: 1,
    category: "VIDEO",
    title: "AV Digitization",
    image: "/images/video-service.jpg",
    description:
      "Archival-grade digitization of legacy audio-visual formats including magnetic tapes, film reels, and vintage media using international preservation standards.",
    points: [
      "RAW master archiving files",
      "Format conversion & migration",
      "Structural metadata generation"
    ]
  },
  {
    id: 2,
    category: "IMAGE",
    title: "Enhancement and Restoration",
    image: "/images/consult-service.jpg",
    description:
      "Advanced software and hardware restoration processes to repair video signal degradation, fix color shifts, and bring clarity back to damaged media files.",
    points: [
      "Signal processing & stabilization",
      "Dust, scratch, and noise reduction",
      "Color grading & tonal balance optimization"
    ]
  },
  {
    id: 3,
    category: "CONSULT",
    title: "Consulting",
    image: "/images/consult-service.jpg",
    description:
      "Helping organizations, cultural institutions, and individuals plan, design, and supervise archiving strategies according to international best practices.",
    points: [
      "End-to-end workflow planning",
      "RFP preparation & technical documentation",
      "Hardware & software stack selection"
    ]
  },
  {
    id: 4,
    category: "VISION",
    title: "AV Project Execution and Audit",
    image: "/images/image-service.jpg",
    description:
      "Complete supervision of large-scale audio-visual integration projects alongside rigorous technical auditing to guarantee quality control and compliance.",
    points: [
      "Quality control & output verification",
      "System integration oversight",
      "Compliance auditing and technical scoring"
    ]
  }
];

const pillars = [
  { id: "VIDEO", title: "AV Digitization", icon: "lucide:layers" },
  {
    id: "IMAGE",
    title: "Enhancement and Restoration",
    icon: "eos-icons:enhancement"
  },
  {
    id: "CONSULT",
    title: "Consulting",
    icon: "material-symbols-light:overview-outline"
  },
  {
    id: "VISION",
    title: "AV Project Execution and Audit",
    icon: "ix:project-server"
  }
];

export default function CoreServices() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("VIDEO");

  const handleOpenPillar = (id: string) => {
    setActiveTab(id);
    setIsOpen(true);
  };

  const currentData =
    services.find((s) => s.category === activeTab) || services[0];

  return (
    <>
      <section className="relative w-full min-h-[800px] py-20 md:py-28 overflow-hidden flex flex-col justify-around my-10">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/videoTool.jpg"
            alt="Our Services Background"
            fill
            priority
            className="object-cover object-center scale-105"
            sizes="100vw"
          />
          {/* Warm Heritage Dark Overlay Blends */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#112438]/85 via-[#112438]/90 to-[#112438]/95 mix-blend-multiply" />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content Area Grouping */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4">
          {/* Header Block */}
          <div className="text-center mb-24 md:mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-wide text-white font-serif drop-shadow-md">
              Our Services
            </h2>
            {/* Elegant warm underline accent matched to your branding */}
            <div className="w-24 h-[2px] bg-[#ebdcd0] mx-auto mt-4 opacity-60" />
          </div>

          {/* 4 Pillars Grid Container */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-0 gap-y-0 text-center relative">
            {/* HORIZONTAL DIVIDER LINE (Mobile/Tablet Only) */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/20 md:hidden transform -translate-y-1/2" />

            {pillars.map((pillar, index) => (
              <div
                key={pillar.id}
                className={`flex flex-col items-center px-4 py-8 md:p-6 text-center group relative
                ${
                  /* Vertical border between the two columns on mobile/tablet */ ""
                }
                ${
                  index % 2 === 0
                    ? "border-r border-white/20 md:border-r-0"
                    : ""
                }
                
                ${/* Desktop vertical border reset structure */ ""}
                ${index !== 0 ? "md:border-l md:border-white/20" : ""}
              `}
              >
                <div className="text-amber-200/80 mb-4 transition-transform duration-300 group-hover:scale-110">
                  <Icon icon={pillar.icon} className="w-10 h-10 stroke-[1.2]" />
                </div>

                {/* Title */}
                <h3 className="text-base md:text-xl font-[400] tracking-wide mb-6 text-stone-200 min-h-[48px] flex items-center justify-center">
                  {pillar.title}
                </h3>

                {/* Circular '+' Interactive Trigger */}
                <button
                  onClick={() => handleOpenPillar(pillar.id)}
                  className="w-10 h-10 rounded-full bg-[#ebdcd0] hover:bg-white text-[#112438] flex items-center justify-center transition-all duration-300 shadow-md active:scale-90 mt-auto"
                  aria-label="Open details modal"
                >
                  <Icon icon="lucide:plus" className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
            ))}
          </div>
          <div className="text-center mt-20 flex justify-center">
            <Link href="/services">
              <button className="bg-[#fff] text-black px-10 py-4 font-[400] rounded-lg hover:bg-primary/90 transition-all shadow-lg active:scale-95">
                Read More
              </button>
            </Link>
          </div>
        </div>
      </section>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/70 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn">
          <div
            className="relative w-full max-w-5xl bg-[#3c241c] rounded-2xl overflow-hidden shadow-2xl border border-stone-800 flex flex-col md:flex-row-reverse text-left"
            dir="ltr"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center transition-all"
              aria-label="Close modal"
            >
              <Icon icon="lucide:x" className="w-5 h-5" />
            </button>

            {/* RIGHT-HAND SIDE COLUMN: Vertical Navigation Menu Options */}
            <div className="w-full md:w-[32%] bg-[#2e1a14] p-6 flex flex-col gap-3 justify-center border-b md:border-b-0 md:border-r border-stone-800/40 shrink-0">
              <span className="text-amber-100/40 text-xs font-bold tracking-wider mb-2 block px-2">
                Our Community
              </span>
              {services.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.category)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm md:text-base font-semibold transition-all duration-200 ${
                    activeTab === tab.category
                      ? "bg-[#ebdcd0] text-[#3c241c] shadow-md transform translate-x-1" // Pushes left smoothly
                      : "bg-[#ebdcd0]/10 text-stone-300 hover:bg-[#ebdcd0]/20"
                  }`}
                >
                  {tab.title}
                </button>
              ))}
            </div>

            {/* LEFT-HAND SIDE COLUMN: Content Canvas Viewport Display */}
            <div className="w-full md:w-[68%] p-6 md:p-8 flex flex-col justify-between">
              {/* Media Block Wrapper */}
              <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-md mb-6 border border-stone-800/50">
                <Image
                  src={currentData.image}
                  alt={currentData.title}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              </div>

              {/* Text Meta Content Layer */}
              <div className="flex-1 flex flex-col justify-end">
                <h2 className="text-2xl md:text-3xl font-bold text-amber-100 mb-3">
                  {currentData.title}
                </h2>

                <p className="text-stone-300 text-sm md:text-base leading-relaxed mb-4 font-light">
                  {currentData.description}
                </p>

                {/* Bullets List Array Target Blocks */}
                <div className="border-t border-stone-700/50 pt-4 mt-2">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-400 text-xs md:text-sm">
                    {currentData.points.map((point, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-left"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400/70 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
