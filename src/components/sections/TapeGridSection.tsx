"use client";

import Image from "next/image";

export interface TapeItem {
  id: number;
  src: string;
  alt: string;
}

interface TapeGridSectionProps {
  title: string;
  description: string;
  items: TapeItem[];
  backgroundColor?: string;
  contentPosition?: "left" | "right";
}

export default function TapeGridSection({
  title,
  description,
  items,
  backgroundColor = "bg-white",
  contentPosition = "left"
}: TapeGridSectionProps) {
  const textOrder = contentPosition === "left" ? "order-1" : "order-2";
  const imageOrder = contentPosition === "left" ? "order-2" : "order-1";

  return (
    <section className={`w-full ${backgroundColor} py-6 md:py-14 px-6 md:px-12 lg:px-20 overflow-visible`}>
      <div className="max-w-7xl mx-auto flex flex-col items-start overflow-visible">
        {/* Title */}
        <h2 className="text-primary text-[32px] sm:text-[40px] lg:text-[48px] font-[600] leading-tight mb-10 md:mb-12">
          {title}
        </h2>

        {/* Content + Grid Layout */}
        <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-16 overflow-visible">
          {/* Text Content */}
          <div className={`w-full lg:w-[40%] flex flex-col items-start z-10 ${textOrder}`}>
            <p className="text-black text-[15px] sm:text-[16px] lg:text-[18px] leading-relaxed opacity-85 max-w-xl">
              {description}
            </p>
          </div>

          {/* Image Grid */}
          <div className={`w-full lg:w-[60%] overflow-visible ${imageOrder}`}>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 gap-4 md:gap-6 items-center justify-center">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="relative group flex items-center justify-center bg-transparent transition-transform duration-300 hover:scale-105 drop-shadow-[0_8px_15px_rgba(0,0,0,0.12)]"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={140}
                    height={95}
                    className="w-full h-auto object-contain"
                    priority={item.id <= 3}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
