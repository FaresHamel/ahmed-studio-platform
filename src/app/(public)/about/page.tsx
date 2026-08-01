import AudioTapesSection from "@/sections/about/AudioTapesSection";
import DvdSection from "@/sections/about/DvdSection";
import FormatsChangeMemories from "@/sections/about/Formatschangememories";
import MediaTypes from "@/sections/about/Mediatypes";
import MoreServicesPricesSection from "@/sections/about/MoreServicesPricesSection";
import MovieFilmsSection from "@/sections/about/MovieFilmsSection";
import PhotosSlidesSection from "@/sections/about/PhotosSlidesSection";
import TapTratmentSections from "@/sections/about/TapTratmentSections";
import VideoTapesSection from "@/sections/about/VideoTapesSection";

export default function AboutPage() {
  return (
    <>
      <FormatsChangeMemories />
      <MediaTypes />
      <MovieFilmsSection />
      <AudioTapesSection />
      <VideoTapesSection />
      <PhotosSlidesSection />
      <DvdSection />
      <TapTratmentSections />
      <MoreServicesPricesSection/>
    </>
  );
}
