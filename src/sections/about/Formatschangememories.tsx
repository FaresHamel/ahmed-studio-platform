"use client";
import Image from "next/image";

interface FormatsChangeMemoriesProps {
  title?: string;
  description?: string;
  imageUrl?: string;
}

export default function FormatsChangeMemories({
  title = "Formats change, Memories stay",
  description = "Old tapes fade, discs scratch, but memories last forever. Convert your media with us and keep your moments alive in crystal-clear digital quality",
  imageUrl = "/images/formats-memories.jpg"
}: FormatsChangeMemoriesProps) {
  return (
    <section className="w-full relative py-20 md:py-32 lg:py-40">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl}
          alt="Formats Change Memories Stay"
          fill
          className="object-cover"
          priority={false}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 flex flex-col items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight font-bold mb-6 md:mb-8">
            {title}
          </h1>
          <p className="text-white/90 text-sm md:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
