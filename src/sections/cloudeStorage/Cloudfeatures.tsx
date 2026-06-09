"use client";
import Image from "next/image";
import { useI18n } from "@/src/i18n/context";

const featureImages = [
  "/images/feature-1.jpg",
  "/images/feature-2.jpg",
  "/images/feature-3.jpg",
  "/images/feature-4.jpg"
];

export default function CloudFeatures() {
  const { t } = useI18n();
  const cf = t.cloudStorage.features;
  const features = cf.items.map((item, i) => ({
    title: item.title,
    description: item.desc,
    imageUrl: featureImages[i] ?? "/images/feature-1.jpg"
  }));

  return (
    <section className="w-full py-8 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto md:px-8">
        <h2 className="text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-6xl leading-tight font-[500] text-center mb-8 md:mb-16">
          {cf.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col h-full">
              <div className="relative w-full aspect-video rounded-lg md:rounded-2xl overflow-hidden shadow-lg mb-4 md:mb-6">
                <Image
                  src={feature.imageUrl}
                  alt={feature.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  priority={false}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <h3 className="text-xl md:text-2xl font-bold text-black mb-2 md:mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
