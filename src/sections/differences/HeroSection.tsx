"use client";
import GenericHeroSection from "@/components/sections/GenericHeroSection";
import { useI18n } from "@/i18n/context";

export default function HeroSection() {
  const { t } = useI18n();
  const hero = t.differences.hero;

  return (
    <GenericHeroSection
      imageSrc="/images/differnces_changment.jpg"
      imageAlt="Hero"
      title={hero.title}
      titleHighlight={hero.titleHighlight}
      description={hero.description}
      height="medium"
    />
  );
}
