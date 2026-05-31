"use client";
import GenericHeroSection from "@/src/components/sections/GenericHeroSection";
import { useI18n } from "@/src/i18n/context";

export default function HeroSection() {
  const { t } = useI18n();
  return (
    <GenericHeroSection
      imageSrc="/images/hero.png"
      imageAlt="Hero"
      title={t.home.hero.title}
      titleHighlight={t.home.hero.titleHighlight}
      description={t.home.hero.description}
      height="large"
    />
  );
}
