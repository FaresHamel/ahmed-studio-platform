"use client";

import Image from "next/image";

interface ConsultingHeroProps {
  title?: string;
  subtitle?: string;
  mainText?: string;
  highlightText?: string;
  highlightValue?: string;
  imageUrl?: string;
  badgeIcon?: string;
  highlightSubtext?:string;
}

export default function ProfessionalConsulting({
  title = "Professional Consulting",
  subtitle = "Guaranteed Excellence",
  mainText = "A professionally consulted project ensures every bit of information is captured, documented, and preserved correctly–protecting your investment and heritage for generations.",
  highlightText = "Preserved for up to",
  highlightValue = "100 years",
  highlightSubtext = "through continuous preservation planning.",
  imageUrl = "/images/professional-consulting.jpg"
}: ConsultingHeroProps) {
  return (
    <section className="w-full py-12 md:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Hero with Background Image */}
        <div className="relative w-full aspect-video md:aspect-auto md:h-[450px] lg:h-[500px] rounded-3xl overflow-hidden shadow-xl">
          {/* Background Image */}
          <Image
            src={imageUrl}
            alt="Professional Consulting"
            fill
            className="object-cover"
            priority={false}
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10 lg:p-12">
            {/* Top Section: Title and Main Text */}
            <div className="max-w-2xl">
              <h2 className="font-playfair text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight font-bold mb-4 md:mb-6">
                {title} <br /> {subtitle}
              </h2>
              <p className="text-white/90 text-sm md:text-base lg:text-lg leading-relaxed max-w-xl">
                {mainText}
              </p>
            </div>

            {/* Bottom Section: Highlight Badge */}
            <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-xl px-6 md:px-8 py-4 md:py-5 w-fit">
              <div className="flex items-center gap-2">
                <span className="text-gray-700 text-sm md:text-base font-medium">
                  📅 {highlightText}{" "}
                  <span className="text-primary font-bold">
                    {highlightValue}
                  </span>
                </span>
              </div>
              {highlightSubtext && (
                <span className="text-gray-600 text-sm hidden sm:inline">
                  {highlightSubtext}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
