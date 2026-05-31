"use client";
import TapeGridSection from "@/src/components/sections/TapeGridSection";
import { audioTapesData } from "@/src/data/tapes";
import { useI18n } from "@/src/i18n/context";

export default function AudioTapesSection() {
  const { t } = useI18n();
  return (
    <TapeGridSection
      title={t.about.audioTapes.title}
      description={t.about.audioTapes.description}
      items={audioTapesData}
      backgroundColor="bg-[#F7F1EC]"
      contentPosition="left"
    />
  );
}
