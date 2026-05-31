"use client";
import Image from "next/image";
import { useI18n } from "@/src/i18n/context";

export default function BeyondDigitization({ imageUrl = "/images/beyond-digitization.jpg" }: { imageUrl?: string }) {
  const { t } = useI18n();
  const b = t.consultant.beyond;
  return (
    <section className="w-full py-12 md:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <h2 className="text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-6xl leading-tight font-[500] text-center mb-12 md:mb-16">
          {b.title}
        </h2>
        <div className="relative w-full aspect-video md:aspect-auto md:h-[400px] rounded-3xl overflow-hidden shadow-xl my-[100px]">
          <Image src={imageUrl} alt="Professional Archival Consulting" fill className="object-cover" priority={false} />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-8">
            <h3 className="text-white text-3xl md:text-4xl lg:text-5xl leading-tight font-bold mb-4">{b.subtitle}</h3>
            <p className="text-white/90 text-sm md:text-base leading-relaxed max-w-md">{b.oversight}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          <div className="flex flex-col justify-center space-y-6">
            <div className="border-l-4 border-primary pl-6">
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">{b.quote}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 md:p-8">
              <blockquote className="text-gray-700 text-sm md:text-base leading-relaxed italic">
                &ldquo;{b.futureProof}&rdquo;
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
