"use client";
import { CardItem } from "@/src/components/sections/CardGrid";
import { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useI18n } from "@/src/i18n/context";

const serviceImages = [
  "/images/video-service.jpg",
  "/images/aiImgProcessor.jpg",
  "/images/consult-service.jpg",
  "/images/image-service.jpg"
];

const pillarIcons = [
  { id: "VIDEO", icon: "ph:cassette-tape-light" },
  { id: "IMAGE", icon: "fluent:image-sparkle-16-regular" },
  { id: "CONSULT", icon: "material-symbols-light:overview-outline" },
  { id: "VISION", icon: "ix:project-server" }
];

interface Service extends CardItem {
  id: number;
  category: string;
  title: string;
  image: string;
  description: string;
  points: string[];
}

export default function CoreServices() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("VIDEO");
  const { t } = useI18n();
  const cs = t.home.coreServices;

  const services: Service[] = cs.services.map((s, i) => ({
    id: i + 1,
    category: s.category,
    title: s.title,
    image: serviceImages[i] ?? "/images/video-service.jpg",
    description: s.description,
    points: s.points
  }));

  const pillars = pillarIcons.map((p, i) => ({ ...p, title: cs.pillars[i] ?? p.id }));

  const currentData = services.find((s) => s.category === activeTab) || services[0];

  return (
    <>
      <section className="relative w-full min-h-[800px] py-20 md:py-28 overflow-hidden flex flex-col justify-around my-10">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/videoTool.jpg"
            alt="Our Services Background"
            fill
            priority
            className="object-cover object-center scale-105"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#112438]/85 via-[#112438]/90 to-[#112438]/95 mix-blend-multiply" />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4">
          <div className="text-center mb-16 md:mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-wide text-white font-serif drop-shadow-md">
              {cs.title}
            </h2>
            <div className="w-24 h-[2px] bg-[#ebdcd0] mx-auto mt-4 opacity-60" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 text-center relative">
            <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white/20 md:hidden transform -translate-x-1/2 z-0" />
            <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-white/20 md:hidden transform -translate-y-1/2 z-0" />
            {pillars.map((pillar, index) => (
              <div
                key={pillar.id}
                className={
                  "flex flex-col items-center px-4 py-8 md:p-6 text-center group relative z-10 md:border-l md:border-r md:border-white/20"
                }
              >
                <div className="text-amber-200/80 mb-4 transition-transform duration-300 group-hover:scale-110">
                  <Icon icon={pillar.icon} className="w-10 h-10 stroke-[1.2]" />
                </div>

                <h3 className="text-base md:text-xl font-[400] tracking-wide mb-6 text-stone-200 min-h-[48px] flex items-center justify-center">
                  {pillar.title}
                </h3>
                <button
                  onClick={() => {
                    setActiveTab(pillar.id);
                    setIsOpen(true);
                  }}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#ebdcd0] hover:bg-white text-[#112438] flex items-center justify-center transition-all duration-300 shadow-md active:scale-95 mt-auto"
                  aria-label="Open details modal"
                >
                  <Icon
                    icon="lucide:plus"
                    className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5]"
                  />
                </button>
              </div>
            ))}
          </div>
          <div className="text-center mt-16 md:mt-20 flex justify-center">
            <Link href="/services">
              <button className="bg-[#fff] text-black px-7 py-3 md:px-10 md:py-4 font-[400] text-sm md:text-base rounded-lg hover:bg-primary/90 transition-all shadow-lg active:scale-95">
                {cs.readMore}
              </button>
            </Link>
          </div>
        </div>
      </section>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/70 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn">
          <div
            className="relative w-full max-w-5xl max-h-[85vh] md:max-h-[90vh] bg-[#3c241c] rounded-2xl overflow-hidden shadow-2xl border border-stone-800 flex flex-col md:flex-row-reverse text-left"
            dir="ltr"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center transition-all"
              aria-label="Close modal"
            >
              <Icon icon="lucide:x" className="w-5 h-5" />
            </button>

            {/* LEFT SIDEBAR (Tabs): Made scrollable on mobile if there are many tabs, or row flexed */}
            <div className="w-full md:w-[32%] bg-[#2e1a14] p-5 flex flex-row md:flex-col gap-3 items-center md:justify-center border-b md:border-b-0 md:border-r border-stone-800/40 overflow-x-auto md:overflow-x-visible md:overflow-y-auto shrink-0 scrollbar-hide">
              <span className="text-amber-100/40 text-xs font-bold tracking-wider md:mb-2 block shrink-0 hidden md:block px-2">
                {cs.ourCommunity}
              </span>
              {services.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.category)}
                  className={`text-left px-4 py-2.5 md:py-3 rounded-lg text-xs md:text-base font-semibold transition-all duration-200 shrink-0 whitespace-nowrap md:w-full md:whitespace-normal ${
                    activeTab === tab.category
                      ? "bg-[#ebdcd0] text-[#3c241c] shadow-md md:transform md:translate-x-1"
                      : "bg-[#ebdcd0]/10 text-stone-300 hover:bg-[#ebdcd0]/20"
                  }`}
                >
                  {tab.title}
                </button>
              ))}
            </div>

            {/* RIGHT CONTENT SECTION: Added independent custom scrolling area */}
            <div className="w-full md:w-[68%] p-5 md:p-8 overflow-y-auto flex flex-col justify-between custom-scrollbar">
              <div>
                {/* Main Image Banner Container */}
              <div className="relative w-full aspect-[4/3] md:aspect-[16/10] rounded-xl overflow-hidden shadow-md mb-5 border border-stone-800/50">
                <Image
                  src={currentData.image}
                  alt={currentData.title}
                  fill
                  className="object-cover object-top transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              </div>

                <div className="flex-1 flex flex-col justify-end">
                  <h2 className="text-xl md:text-3xl font-bold text-amber-100 mb-2">
                    {currentData.title}
                  </h2>
                  <p className="text-stone-300 text-xs md:text-base leading-relaxed mb-4 font-light">
                    {currentData.description}
                  </p>
                </div>
              </div>

              {/* Feature Checkpoints Footer Section */}
              <div className="border-t border-stone-700/50 pt-4 mt-2">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-400 text-[11px] md:text-sm">
                  {currentData.points.map((point, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-left">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400/70 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
