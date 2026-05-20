import AudioTapesSection from "@/src/sections/about/AudioTapesSection";
import DvdSection from "@/src/sections/about/DvdSection";
import FormatsChangeMemories from "@/src/sections/about/Formatschangememories";
import MediaTypes from "@/src/sections/about/Mediatypes";
import MoreServicesPricesSection from "@/src/sections/about/MoreServicesPricesSection";
import MovieFilmsSection from "@/src/sections/about/MovieFilmsSection";
import PhotosSlidesSection from "@/src/sections/about/PhotosSlidesSection";
import TapTratmentSections from "@/src/sections/about/TapTratmentSections";
import VideoTapesSection from "@/src/sections/about/VideoTapesSection";

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
