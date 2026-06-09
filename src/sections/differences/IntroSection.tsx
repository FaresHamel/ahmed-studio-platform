"use client";
import SimpleInfoSection from "@/src/components/sections/SimpleInfoSection";
import { useI18n } from "@/src/i18n/context";

export default function IntroSection() {
  const { t } = useI18n();
  const intro = t.differences.intro;

  return (
    <SimpleInfoSection
      title={intro.title}
      description={intro.description}
      containerClassName="mt-10 md:mt-16 px-4"
    />
  );
}
