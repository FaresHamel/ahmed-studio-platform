"use client";
import Image from "next/image";
import { useI18n } from "@/src/i18n/context";

export default function FormatsChangeMemories({ imageUrl = "/images/formats-memories.jpg" }: { imageUrl?: string }) {
  const { t } = useI18n();
  return (
    <section className="w-full relative h-[500px] md:h-[600px] overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src={imageUrl}
          alt="Formats Change Memories Stay"
          fill
          className="object-cover md:object-contain md:rotate-270 md:scale-250"
          priority={false}
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 flex flex-col items-center justify-center h-full py-12 md:py-0">
        <div className="text-center max-w-[420px] sm:max-w-[450px] md:max-w-[550px] lg:max-w-[600px] mx-auto px-4">
          <p className="font-poppins text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-[500] mb-10 md:mb-8 break-words leading-[1.2] md:leading-[1.3]">
            {t.about.formatsChange.title}
          </p>
          <p className="text-white/90 text-sm md:text-base lg:text-lg max-w-prose mx-auto leading-relaxed md:leading-[1.6]">
            {t.about.formatsChange.description}
          </p>
        </div>
      </div>
    </section>
  );
}
