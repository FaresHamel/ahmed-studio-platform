"use client";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/src/i18n/context";

export default function StreamlinedJourney({
  imageUrl = "/images/streaming.jpg",
  ctaImageUrl = "/images/enjoy.jpg"
}: {
  imageUrl?: string;
  ctaImageUrl?: string;
}) {
  const { t } = useI18n();
  const sj = t.cloudStorage.streamlined;

  return (
    <section className="w-full bg-white">
      <div className="py-12 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <h2 className="text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-6xl leading-tight font-[500] text-center mb-12 md:mb-16">{sj.title}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            <div className="relative w-full aspect-square md:aspect-auto md:h-[450px] rounded-3xl overflow-hidden shadow-xl order-2 lg:order-1">
              <Image src={imageUrl} alt="Streamlined Journey" fill className="object-cover" priority={false} />
            </div>
            <div className="space-y-8 order-1 lg:order-2">
              {sj.steps.map((step, index) => (
                <div key={index} className="flex gap-4 md:gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary text-white font-bold flex items-center justify-center text-lg md:text-xl">{index + 1}</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold text-black mb-2">{step.title}:</h3>
                    <p className="text-gray-700 text-sm md:text-base leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative py-12 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="relative w-full min-h-[480px] md:h-[500px] rounded-3xl overflow-hidden shadow-xl flex flex-col">
            <Image src={ctaImageUrl} alt="Claim Your Days" fill className="object-cover" priority={false} />
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 md:p-12 lg:p-16 z-10">
              <div>
                <h2 className="text-white text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight font-bold mb-4 md:mb-6">{sj.ctaTitle}</h2>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-end sm:gap-6 gap-6 mt-auto">
                <p className="text-white/90 text-sm md:text-base leading-relaxed max-w-md flex-1">{sj.ctaDesc}</p>
                <Link href="/subscription" className="bg-primary hover:bg-primary/90 text-white px-8 md:px-10 py-4 md:py-5 rounded-lg font-bold text-base md:text-lg transition-all duration-300 hover:shadow-lg active:scale-95 whitespace-nowrap flex-shrink-0 text-center">
                  {sj.ctaButton}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
