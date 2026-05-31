"use client";
import Image from "next/image";
import { useI18n } from "@/src/i18n/context";

export default function AboutCloudStorage({ imageUrl = "/images/cloud-storage.jpg" }: { imageUrl?: string }) {
  const { t } = useI18n();
  const cs = t.cloudStorage.about;
  return (
    <section className="w-full py-12 md:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          <div className="relative w-full aspect-video md:aspect-auto md:h-[400px] rounded-3xl overflow-hidden shadow-xl">
            <Image src={imageUrl} alt="Cloud Storage" fill className="object-cover" priority={false} />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-5xl leading-tight font-[500] mb-6 md:mb-8">{cs.title}</h2>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-wrap">{cs.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
