import TapeGridSection from "@/src/components/sections/TapeGridSection";
import { videoTapesData } from "@/src/data/tapes";

export default function VideoTapesSection() {
  return (
    <TapeGridSection
      title="Video Tapes"
      description="Our old VHS, MiniDV, Hi8, and camcorder tapes won't last forever but your memories can. We carefully digitize your video tapes into high-quality digital files, preserving every moment with clarity, safety and care."
      items={videoTapesData}
      backgroundColor="bg-white"
      contentPosition="left"
    />
  );
}
