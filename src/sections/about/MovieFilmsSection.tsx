"use client";
import TapeGridSection from "@/src/components/sections/TapeGridSection";
import { movieFilmsData } from "@/src/data/tapes";
import { useI18n } from "@/src/i18n/context";

export default function MovieFilmsSection() {
  const { t } = useI18n();
  return (
    <TapeGridSection
      title={t.about.movieFilms.title}
      description={t.about.movieFilms.description}
      items={movieFilmsData}
      backgroundColor="bg-[#DFBFA4]"
      contentPosition="left"
    />
  );
}
