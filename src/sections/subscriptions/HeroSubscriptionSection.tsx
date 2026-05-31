"use client";
import GenericHeroSection from "@/src/components/sections/GenericHeroSection";
import { useI18n } from "@/src/i18n/context";

export default function HeroSubscriptionSection() {
  const { t } = useI18n();
  const h = t.subscriptions.hero;
  return (
    <GenericHeroSection
      imageSrc="/images/heroSubscription.jpg"
      imageAlt="Subscription"
      title={h.title}
      titleHighlight={h.titleHighlight}
      description={h.description}
      height="medium"
    />
  );
}
