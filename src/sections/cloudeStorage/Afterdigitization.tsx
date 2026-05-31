"use client";
import Image from "next/image";
import { useI18n } from "@/src/i18n/context";

const sectionImages = ["/images/streamlined-journey.jpg", "/images/cta-image.jpg"];

export default function AfterDigitization() {
  const { t } = useI18n();
  const ad = t.cloudStorage.afterDigitization;

  const sections = [
    {
      title: ad.title,
      description: ad.description,
      features: ad.devices.map((d) => ({ label: d.title, text: d.desc })),
      imageUrl: sectionImages[0],
      imagePosition: "left" as const
    },
    {
      title: ad.sharingTitle,
      description: ad.sharingDesc,
      features: ad.sharingFeatures.map((f) => ({ label: f.title, text: f.desc })),
      imageUrl: sectionImages[1],
      imagePosition: "right" as const
    }
  ];

  return (
    <section className="w-full py-12 md:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {sections.map((section, index) => (
          <div key={index} className={`mb-16 md:mb-24 lg:mb-32 ${index > 0 ? "pt-16 md:pt-24 lg:pt-32 border-t border-gray-200" : ""}`}>
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center`}>
              <div className={`relative w-full aspect-square md:aspect-auto md:h-[400px] rounded-2xl overflow-hidden shadow-xl ${section.imagePosition === "right" ? "lg:order-2" : "lg:order-1"}`}>
                <Image src={section.imageUrl} alt={section.title} fill className="object-cover" priority={false} />
              </div>
              <div className={`flex flex-col justify-center ${section.imagePosition === "right" ? "lg:order-1" : "lg:order-2"}`}>
                <h2 className="text-primary text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight font-bold mb-6 md:mb-8">{section.title}</h2>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-8 md:mb-10">{section.description}</p>
                <div className="space-y-4">
                  {section.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex gap-3 md:gap-4">
                      <span className="text-primary font-bold text-lg flex-shrink-0">•</span>
                      <div>
                        <span className="font-bold text-black text-sm md:text-base">{feature.label}:</span>
                        <span className="text-gray-700 text-sm md:text-base ml-1">{feature.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
