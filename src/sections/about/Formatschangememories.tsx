"use client";
import Image from "next/image";
import { useI18n } from "@/i18n/context";
import GenericHeroSection from "@/components/sections/GenericHeroSection";

export default function FormatsChangeMemories({
  imageUrl = "/images/about_us_page.png"
}: {
  imageUrl?: string;
}) {
  const { t } = useI18n();
  return (
    <div className="relative w-full h-[55vh] sm:h-[55vh] md:h-[80vh] mt-4 overflow-hidden rounded-[10px]">
      <div className="absolute inset-0">
        <Image
          src="/images/about_us_page.png"
          alt="Hero"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className="relative z-10 h-full flex items-center justify-start px-4 sm:px-8 md:px-16">
        <div className="flex flex-col items-center max-w-4xl">
          <h1 className="text-white leading-tight text-[26px] sm:text-4xl md:text-6xl lg:text-7xl max-w-3xl">
            {t.about.formatsChange.title}
            <br />
          </h1>
          <p className="mt-4 px-[5px] sm:mt-6 text-white/90 leading-relaxed max-w-2xl text-[13px] sm:text-base md:text-xl">
            {t.about.formatsChange.description}
          </p>
        </div>
      </div>
    </div>
    // <section className="w-full relative h-[500px] md:h-[600px] overflow-hidden">
    //   <div className="absolute inset-0 z-0 ">
    //     <Image
    //       src={imageUrl}
    //       alt="Formats Change Memories Stay"
    //       fill
    //       className="object-contain md:object-contain"
    //       priority={false}
    //     />
    //     <div className="absolute inset-0 bg-black/50" />
    //   </div>
    //   <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 flex flex-col items-center justify-center h-full py-12 md:py-0">
    //     <div className="text-center max-w-[420px] sm:max-w-[450px] md:max-w-[550px] lg:max-w-[600px] mx-auto px-4">
    //       <p className="font-poppins text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-[500] mb-10 md:mb-8 break-words leading-[1.2] md:leading-[1.3]">
    //         {t.about.formatsChange.title}
    //       </p>
    //       <p className="text-white/90 text-sm md:text-base lg:text-lg max-w-prose mx-auto leading-relaxed md:leading-[1.6]">
    //         {t.about.formatsChange.description}
    //       </p>
    //     </div>
    //   </div>
    // </section>
  );
}

