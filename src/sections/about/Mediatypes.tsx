"use client";
import SimpleInfoSection from "@/src/components/sections/SimpleInfoSection";
import { useI18n } from "@/src/i18n/context";

export default function MediaTypes() {
  const { t } = useI18n();
  return (
    <section className="w-full bg-white">
      <SimpleInfoSection
        title={t.about.intro.title}
        description={t.about.intro.description}
        titleClassName="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-8 md:mb-12"
        descriptionClassName="text-gray-700 text-sm md:text-base leading-relaxed"
        containerClassName="py-12 md:py-20 lg:py-24"
        maxWidth="max-w-5xl"
      />
    </section>
  );
}
