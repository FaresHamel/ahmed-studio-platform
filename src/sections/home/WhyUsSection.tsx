"use client";
import { Icon } from "@iconify/react";
import Link from "next/link";
import CardGrid, { CardItem } from "@/src/components/sections/CardGrid";

interface Feature extends CardItem {
  id: number;
  icon: string;
  title: string;
  desc: string;
}

const features: Feature[] = [
  {
    id: 1,
    icon: "hugeicons:award-02",
    title: "Since 2017 years",
    desc: "Over 8+ years of global expertise in preserving audiovisual heritage to the highest international standards."
  },
  {
    id: 2,
    icon: "clarity:world-line",
    title: "Best practices",
    desc: "Every project we supervise aligns with international standards, including high end legacy machines and professional grade equipments."
  },
  {
    id: 3,
    icon: "bi:filetype-raw",
    title: "RAW Capture",
    desc: "We guarantee an uncompressed, authentic RAW capture of your original content, preserving every bit of information. Our lab uses industry-leading technology to deliver quality that home-grade equipment simply cannot match."
  }
];

export default function WhyUsSection() {
  const renderFeatureCard = (item: Feature, isMobile?: boolean) => (
    <div className={`bg-[#F7F1EC] rounded-[20px] flex flex-col items-start ${isMobile ? "p-5" : "p-8"}`}>
      <div className={`rounded-full border border-black/10 flex items-center justify-center mb-${isMobile ? "4" : "6"} ${isMobile ? "w-10 h-10" : "w-12 h-12"}`}>
        <Icon icon={item.icon} className={`text-black/80 ${isMobile ? "text-xl" : "text-2xl"}`} />
      </div>

      <h3 className={`font-poppins text-primary font-[500] mb-${isMobile ? "3" : "4"} ${isMobile ? "text-[18px]" : "text-[24px]"}`}>
        {item.title}
      </h3>

      <p className={`font-poppins text-black leading-relaxed opacity-90 ${isMobile ? "text-[14px]" : "text-[16px]"}`}>
        {item.desc}
      </p>
    </div>
  );

  const renderConsultationCard = (isMobile?: boolean) => (
    <div className={`bg-[#F7F1EC] rounded-[20px] flex flex-col ${isMobile ? "p-6" : "p-8"}`}>
      <div className={`rounded-full border border-black/10 flex items-center justify-center mb-${isMobile ? "4" : "6"} ${isMobile ? "w-10 h-10" : "w-12 h-12"}`}>
        <Icon icon="hugeicons:message-01" className={`text-black/80 ${isMobile ? "text-xl" : "text-2xl"}`} />
      </div>

      <h3 className={`font-poppins text-primary font-[500] mb-${isMobile ? "4" : "4"} ${isMobile ? "text-[20px]" : "text-[24px]"}`}>
        Free Consultation
      </h3>

      <div className={`font-poppins text-black opacity-90 leading-relaxed flex-grow ${isMobile ? "text-[14px] space-y-4" : "text-[16px] space-y-6"}`}>
        <p>
          First Meeting is Free: Start your journey with a complimentary
          15-minute consultation to discuss your specific technical needs.
        </p>

        <p>
          Support for Individuals: We guide families with the same expert
          methods used for large institutions to ensure their personal
          memories are protected for decades.
        </p>
      </div>

      {isMobile ? (
        <button className="mt-6 bg-primary text-white px-6 py-3 rounded-lg font-poppins font-[500] w-full hover:bg-primary/90 transition-all">
          Read More
        </button>
      ) : (
        <Link
          href="/consultant"
          className="mt-10 bg-primary text-white px-8 py-3 rounded-lg font-poppins font-[500] w-fit hover:bg-primary/90 transition-all"
        >
          Read More
        </Link>
      )}
    </div>
  );

  return (
    <section className="py-12 md:py-20 px-4 max-w-7xl mx-auto overflow-hidden">
      <h2 className="font-poppins text-primary text-[28px] md:text-[40px] font-bold text-center mb-10 md:mb-16">
        Why Us
      </h2>

      {/* Mobile View */}
      <div className="lg:hidden">
        <CardGrid
          items={features}
          renderCard={(item) => renderFeatureCard(item as Feature, true)}
          variant="horizontal-scroll"
          containerClassName="mb-6"
        />
        {renderConsultationCard(true)}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:grid grid-cols-12 gap-6">
        <div className="col-span-8 grid grid-cols-2 gap-6">
          {features.map((item, index) => (
            <div key={item.id} className={index === 2 ? "col-span-2" : ""}>
              {renderFeatureCard(item, false)}
            </div>
          ))}
        </div>

        <div className="col-span-4">
          {renderConsultationCard(false)}
        </div>
      </div>
    </section>
  );
}
