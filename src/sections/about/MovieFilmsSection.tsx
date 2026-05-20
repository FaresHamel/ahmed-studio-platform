import TapeGridSection from "@/src/components/sections/TapeGridSection";
import { movieFilmsData } from "@/src/data/tapes";

export default function MovieFilmsSection() {
  return (
    <TapeGridSection
      title="Movie Films"
      description="Old reels, new memories. Convert your 8mm, Super 8, and 16mm films into high-quality digital videos perfect for reliving every moment."
      items={movieFilmsData}
      backgroundColor="bg-[#DFBFA4]"
      contentPosition="left"
    />
  );
}
