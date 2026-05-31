import TapeGridSection from "@/src/components/sections/TapeGridSection";
import { audioTapesData } from "@/src/data/tapes";

export default function AudioTapesSection() {
  return (
    <TapeGridSection
      title="Audio Tapes"
      description="Our audio tapes include cassettes, vinyl, reel-to-reel recordings, and more. We digitize them with precision, preserving the original sound quality and detail for future generations."
      items={audioTapesData}
      backgroundColor="bg-[#F7F1EC]"
      contentPosition="left"
    />
  );
}
