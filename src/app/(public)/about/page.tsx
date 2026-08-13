import AudioTapesSection from "@/sections/about/AudioTapesSection";
import DvdSection from "@/sections/about/DvdSection";
import FormatsChangeMemories from "@/sections/about/Formatschangememories";
import MediaTypes from "@/sections/about/Mediatypes";
import MoreServicesPricesSection from "@/sections/about/MoreServicesPricesSection";
import MovieFilmsSection from "@/sections/about/MovieFilmsSection";
import PhotosSlidesSection from "@/sections/about/PhotosSlidesSection";
import TapTratmentSections from "@/sections/about/TapTratmentSections";
import VideoTapesSection from "@/sections/about/VideoTapesSection";
import HeroServicesSection from "@/sections/services/HeroServicesSection";

export default function AboutPage() {
  return (
    <>
      <section
        className={
          "w-full px-4 md:px-16 py-20 md:py-20 space-y-12 md:space-y-24"
        }
      >
        <FormatsChangeMemories />
      </section>

      <MediaTypes />
      <MovieFilmsSection />
      <AudioTapesSection />
      <VideoTapesSection />
      <PhotosSlidesSection />
      <DvdSection />
      <TapTratmentSections />
      <MoreServicesPricesSection />
    </>
  );
}
