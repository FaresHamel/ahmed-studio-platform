"use client";
import Image from "next/image";
import { Icon } from "@iconify/react";
import CardGrid, { CardItem } from "@/src/components/sections/CardGrid";
import QuoteModal from "@/src/components/ui/Modal/QuoteModal";
import { useState } from "react";

interface ServiceCard extends CardItem {
  id: number;
  tag: string;
  title: string;
  description: string;
  imageSrc: string;
  features: string[];
}

const servicesData: ServiceCard[] = [
  {
    id: 1,
    tag: "VIDEO",
    title: "Video Digitization",
    description:
      "Archival grade digitization of video tapes including VHS, Betacam, U-matic, and MiniDV...",
    imageSrc: "/images/video-service.jpg",
    features: [
      "RAW master file/High quality video",
      "Signal processing",
      "Metadata creation"
    ]
  },
  {
    id: 2,
    tag: "AUDIO",
    title: "Audio Digitization",
    description:
      'Professional Transfer of Analog Audio formats including 1/4" tape, cassettes, and vinyl to ...',
    imageSrc: "/images/audioOrganization.jpg",
    features: ["24-bit / 96KHZ", "Sound Restoration", "WAV/Flac"]
  },
  {
    id: 3,
    tag: "FILM",
    title: "Film Scanning",
    description:
      "Frame-by-frame scanning of 8mm, 16mm, and 35mm film reels up to 4k resolution.",
    imageSrc: "/images/filmScaning.jpg",
    features: ["SD / HD / FHD / 4K", "Accurate scanning", "Film cleaning"]
  },
  {
    id: 4,
    tag: "IMAGE",
    title: "Slides / Negative / Photo Scanning",
    description:
      "We scan every available detail to preserve color, contrast, and original image integrity for long-term preservation.",
    imageSrc: "/images/image-service.jpg",
    features: [
      "High-resolution",
      "Dust & defect reduction",
      "Accurate color reproduction & tonal balance",
      "Archival formats suitable for future access"
    ]
  },
  {
    id: 5,
    tag: "CONSULT",
    title: "Consulting",
    description:
      "Help organizations, institutions, and individuals plan, execute, and supervise projects according to international best practices.",
    imageSrc: "/images/consult-service.jpg",
    features: [
      "End-to-end workflow design",
      "RFP preparation & technical documentation",
      "Hardware & software selection",
      "Quality control & project supervision"
    ]
  },
  {
    id: 6,
    tag: "ENHANCEMENT & RESTORATION",
    title: "Enhancement & Restoration",
    description:
      "Professional enhancement and restoration of photos, videos, and audio to recover clarity, stability, and detail while respecting the authenticity of the original content.",
    imageSrc: "/images/aiImgProcessor.jpg",
    features: [
      "Image, video, and audio enhancement",
      "Noise, dust, scratch & flicker reduction",
      "Color correction & exposure balancing",
      "Preservation-safe outputs alongside original"
    ]
  }
];

export default function ServicesSectionCards() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderServiceCard = (service: ServiceCard, index: number) => (
    <div className="w-full h-full bg-white border border-[#EBE5DF] rounded-[10px] sm:rounded-[16px] p-2.5 sm:p-5 md:p-6 flex flex-col items-start text-left justify-between transition-all duration-300 hover:shadow-[0_10px_25px_rgba(132,99,75,0.08)] hover:-translate-y-1">
      <div className="w-full flex flex-col items-start">
        <div className="inline-block self-start mb-4">
          <span
            className={`text-xs font-[500] px-4 py-1 rounded-md tracking-widest ${
              index === 0
                ? "bg-primary text-white"
                : "bg-primary/20 text-primary"
            }`}
          >
            {service.tag}
          </span>
        </div>
        <div className="w-full aspect-[16/10] relative rounded-[6px] sm:rounded-[10px] overflow-hidden bg-[#FAFAFA] mb-2 sm:mb-4">
          <Image
            src={service.imageSrc}
            alt={service.title}
            fill
            className="w-full h-auto object-cover"
          />
        </div>

        <h3 className="font-serif text-[#1A1A1A] text-[12px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-[600] leading-snug mb-1 sm:mb-2 min-h-[32px] sm:min-h-[auto]">
          {service.title}
        </h3>

        <p className="text-[#555555] text-[9px] sm:text-[12px] md:text-[13px] leading-relaxed mb-3 opacity-90 line-clamp-3 sm:line-clamp-none">
          {service.description}
        </p>

        <ul className="w-full flex flex-col gap-0.5 sm:gap-1.5 mb-4 pl-2 sm:pl-4 list-disc text-[#444444]">
          {service.features.map((feature, i) => (
            <li
              key={i}
              className="text-[8px] sm:text-[11px] md:text-[12px] leading-tight opacity-80"
            >
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <button className="flex items-center gap-2 text-primary font-[500] text-sm group">
        LEARN MORE
        <Icon
          icon="heroicons:arrow-right-20-solid"
          className="text-lg transition-transform group-hover:translate-x-1"
        />
      </button>
    </div>
  );

  return (
    <>
      <section className="w-full bg-white py-12 md:py-20 px-4 sm:px-8 lg:px-16 overflow-visible flex flex-col items-center">
        <div className="max-w-7xl mx-auto w-full flex flex-col items-center text-center">
          <h2 className="font-serif text-[#84634B] text-[28px] sm:text-[36px] md:text-[44px] font-[600] leading-tight mb-2">
            Services
          </h2>
          <p className="text-[#666666] text-[12px] sm:text-[14px] md:text-[16px] tracking-wide mb-10 md:mb-14">
            Comprehensive solutions for every format in your collection.
          </p>

          <CardGrid
            items={servicesData}
            renderCard={renderServiceCard}
            columns={{ mobile: 2, tablet: 2, desktop: 3 }}
            gap="medium"
            containerClassName="justify-items-center items-stretch mb-12"
          />

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#84634B] hover:bg-[#6F503A] text-white font-[500] text-[13px] sm:text-[16px] px-8 py-3 sm:px-12 sm:py-4 rounded-md sm:rounded-lg transition-all duration-300 shadow-md hover:-translate-y-0.5"
          >
            Request A Quote
          </button>
        </div>
      </section>
      <QuoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
