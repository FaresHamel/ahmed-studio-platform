"use client";
import Image from "next/image";

interface GenericHeroSectionProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  titleHighlight?: string;
  description: string;
  height?: "small" | "medium" | "large";
}

export default function GenericHeroSection({
  imageSrc,
  imageAlt,
  title,
  titleHighlight,
  description,
  height = "large"
}: GenericHeroSectionProps) {
  const heightClass = {
    small: "h-[40vh] sm:h-[50vh] md:h-[60vh]",
    medium: "h-[55vh] sm:h-[65vh] md:h-[80vh]",
    large: "h-[55vh] sm:h-[65vh] md:h-[90vh]"
  }[height];

  return (
    <div className={`relative w-full ${heightClass} mt-4 overflow-hidden rounded-[10px]`}>
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-8 md:px-16 text-center">
        <div className="flex flex-col items-center max-w-4xl">
          {/* Title */}
          <h1 className="font-playfair text-white leading-tight text-[26px] sm:text-4xl md:text-6xl lg:text-7xl max-w-3xl">
            {title}
            {titleHighlight && (
              <>
                <br />
                <span className="text-primary">{titleHighlight}</span>
              </>
            )}
          </h1>

          {/* Description */}
          <p className="mt-4 sm:mt-6 font-poppins text-white/90 leading-relaxed max-w-2xl text-[13px] sm:text-base md:text-xl">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
