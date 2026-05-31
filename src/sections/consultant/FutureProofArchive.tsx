"use client";
import Image from "next/image";
import { useI18n } from "@/src/i18n/context";

export default function FutureProofArchive({ imageUrl = "/images/consultantImg02.jpg" }: { imageUrl?: string }) {
  const { t } = useI18n();
  const fp = t.consultant.futureProof;
  return (
    <section className="w-full py-12 md:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
          <div className="relative w-full aspect-square md:aspect-auto md:h-[500px] rounded-2xl overflow-hidden shadow-xl">
            <Image src={imageUrl} alt="Future Proof Archive" fill className="object-cover" priority={false} />
          </div>
          <div className="flex flex-col justify-start">
            <h2 className="text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-5xl leading-tight font-[500] mb-6 md:mb-8">
              {fp.title}
            </h2>
            <p className="text-gray-600 text-sm md:text-base mb-6">{fp.subtitle}</p>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-8">{fp.description}</p>
            <div className="space-y-4 md:space-y-5">
              {fp.pillars.map((point, index) => (
                <div key={index} className="flex gap-3 md:gap-4">
                  <div className="flex-shrink-0">
                    <div className="text-xs md:text-sm w-6 h-6 md:w-7 md:h-7 rounded-full bg-primary text-white font-[400] flex items-center justify-center text-lg">
                      {index + 1}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-black text-sm md:text-base mb-1">{point.label}:</h3>
                    <p className="text-gray-700 text-sm md:text-base">{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
