"use client";
import TapeGridSection from "@/src/components/sections/TapeGridSection";
import { videoTapesData } from "@/src/data/tapes";
import { useI18n } from "@/src/i18n/context";

export default function VideoTapesSection() {
  const { t } = useI18n();
  return (
    <TapeGridSection
      title={t.about.videoTapes.title}
      description={t.about.videoTapes.description}
      items={videoTapesData}
      backgroundColor="bg-white"
      contentPosition="left"
    />
  );
}
