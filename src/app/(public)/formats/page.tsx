import AudioTapesSection from "@/sections/about/AudioTapesSection";
import DvdSection from "@/sections/about/DvdSection";
import FormatsChangeMemories from "@/sections/about/Formatschangememories";
import MediaTypes from "@/sections/about/Mediatypes";
import MoreServicesPricesSection from "@/sections/about/MoreServicesPricesSection";
import MovieFilmsSection from "@/sections/about/MovieFilmsSection";
import PhotosSlidesSection from "@/sections/about/PhotosSlidesSection";
import TapTratmentSections from "@/sections/about/TapTratmentSections";
import VideoTapesSection from "@/sections/about/VideoTapesSection";
import { Metadata } from "next";
import { cookies } from "next/headers";
// import HeroServicesSection from "@/sections/services/HeroServicesSection";
export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const language = cookieStore.get("language")?.value === "en" ? "en" : "ar";

  return language === "ar"
    ? {
        title: "إدارة المحفوظات وتحسين جودة الصور | استوديو أحمد",
        description:
          "متخصصون في حفظ وإدارة المحفوظات مع ضمان أفضل مستوى من جودة الصورة وتحسين الصور.",
        keywords: ["المحفوظات", "جودة الصورة", "تحسين الصور"]
      }
    : {
        title: "Archives Management & Image Quality | Ahmed Studio",
        description:
          "Experts in archives management, preserving digital records, and enhancing image quality.",
        keywords: ["Archives", "Image Quality", "Image Enhancement"]
      };
}
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
