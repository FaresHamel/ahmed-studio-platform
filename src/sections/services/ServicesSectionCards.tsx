"use client";
import Image from "next/image";
import { Icon } from "@iconify/react";
import CardGrid, { CardItem } from "@/src/components/sections/CardGrid";
import QuoteModal from "@/src/components/ui/Modal/QuoteModal";
import { useState } from "react";
import { useI18n } from "@/src/i18n/context";

const serviceImages = [
  "/images/video-service.jpg",
  "/images/audioOrganization.jpg",
  "/images/filmScaning.jpg",
  "/images/image-service.jpg",
  "/images/consult-service.jpg",
  "/images/aiImgProcessor.jpg"
];

interface ServiceCard extends CardItem {
  id: number;
  tag: string;
  title: string;
  description: string;
  imageSrc: string;
  features: string[];
}

export default function ServicesSectionCards() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useI18n();
  const cards = t.services.cards;

  const servicesData: ServiceCard[] = cards.services.map((s, i) => ({
    id: i + 1,
    tag: s.tag,
    title: s.title,
    description: s.description,
    imageSrc: serviceImages[i] ?? "/images/video-service.jpg",
    features: s.features
  }));

  const renderServiceCard = (service: ServiceCard, index: number) => (
    <div className="w-full h-full bg-white border border-[#EBE5DF] rounded-[10px] sm:rounded-[16px] p-2.5 sm:p-5 md:p-6 flex flex-col items-start text-left justify-between transition-all duration-300 hover:shadow-[0_10px_25px_rgba(132,99,75,0.08)] hover:-translate-y-1">
      <div className="w-full flex flex-col items-start">
        <div className="inline-block self-start mb-4">
          <span className={`text-xs font-[500] px-4 py-1 rounded-md tracking-widest ${index === 0 ? "bg-primary text-white" : "bg-primary/20 text-primary"}`}>{service.tag}</span>
        </div>
        <div className="w-full aspect-[16/10] relative rounded-[6px] sm:rounded-[10px] overflow-hidden bg-[#FAFAFA] mb-2 sm:mb-4">
          <Image src={service.imageSrc} alt={service.title} fill className="w-full h-auto object-cover" />
        </div>
        <h3 className="font-serif text-[#1A1A1A] text-[12px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-[600] leading-snug mb-1 sm:mb-2 min-h-[32px] sm:min-h-[auto]">{service.title}</h3>
        <p className="text-[#555555] text-[9px] sm:text-[12px] md:text-[13px] leading-relaxed mb-3 opacity-90 line-clamp-3 sm:line-clamp-none">{service.description}</p>
        <ul className="w-full flex flex-col gap-0.5 sm:gap-1.5 mb-4 pl-2 sm:pl-4 list-disc text-[#444444]">
          {service.features.map((feature, i) => (
            <li key={i} className="text-[8px] sm:text-[11px] md:text-[12px] leading-tight opacity-80">{feature}</li>
          ))}
        </ul>
      </div>
      <button className="flex items-center gap-2 text-primary font-[500] text-sm group">
        {cards.learnMore}
        <Icon icon="heroicons:arrow-right-20-solid" className="text-lg transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );

  return (
    <>
      <section className="w-full bg-white py-12 md:py-20 px-4 sm:px-8 lg:px-16 overflow-visible flex flex-col items-center">
        <div className="max-w-7xl mx-auto w-full flex flex-col items-center text-center">
          <CardGrid items={servicesData} renderCard={renderServiceCard} columns={{ mobile: 2, tablet: 2, desktop: 3 }} gap="medium" containerClassName="justify-items-center items-stretch mb-12" />
          <button onClick={() => setIsModalOpen(true)} className="bg-[#84634B] hover:bg-[#6F503A] text-white font-[500] text-[13px] sm:text-[16px] px-8 py-3 sm:px-12 sm:py-4 rounded-md sm:rounded-lg transition-all duration-300 shadow-md hover:-translate-y-0.5">
            {cards.requestQuote}
          </button>
        </div>
      </section>
      <QuoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
