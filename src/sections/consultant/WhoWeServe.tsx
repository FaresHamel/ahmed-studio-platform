"use client";
import Image from "next/image";
import { useI18n } from "@/src/i18n/context";

export default function WhoWeServe({ imageUrl = "/images/consultImg1.jpg" }: { imageUrl?: string }) {
  const { t } = useI18n();
  const wws = t.consultant.whoWeServe;
  return (
    <section className="w-full py-12 md:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          <div className="flex flex-col justify-center order-2 lg:order-1">
            <h2 className="text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-5xl leading-tight font-[500] mb-8 md:mb-12">
              {wws.title}
            </h2>
            <div className="space-y-6 md:space-y-8">
              {wws.groups.map((group, index) => (
                <div key={index} className="flex flex-col">
                  <h3 className="text-lg md:text-xl font-bold text-black mb-2">
                    <span className="text-primary">{group.label}</span>
                  </h3>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">{group.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative w-full aspect-square md:aspect-auto md:h-[500px] rounded-2xl overflow-hidden shadow-xl">
              <Image src={imageUrl} alt="Who We Serve" fill className="object-cover" priority={false} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
