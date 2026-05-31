"use client";
import GenericHeroSection from "@/src/components/sections/GenericHeroSection";
import { useI18n } from "@/src/i18n/context";

export default function HeroConsultantSection() {
  const { t } = useI18n();
  const h = t.consultant.hero;
  return (
    <GenericHeroSection
      imageSrc="/images/consultantImg.jpg"
      imageAlt="Consultant"
      title={h.title}
      titleHighlight={h.titleHighlight}
      description={h.description}
      height="large"
    />
  );
}
