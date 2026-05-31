"use client";
import GenericHeroSection from "@/src/components/sections/GenericHeroSection";
import { useI18n } from "@/src/i18n/context";

export default function HeroOurLabSection() {
  const { t } = useI18n();
  const h = t.ourLab.hero;
  return (
    <GenericHeroSection
      imageSrc="/images/ourLabHero.jpg"
      imageAlt="Our Lab"
      title={h.title}
      titleHighlight={h.titleHighlight}
      description={h.description}
      height="medium"
    />
  );
}
