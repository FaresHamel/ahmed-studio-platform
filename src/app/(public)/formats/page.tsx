import AudioTapesSection from "@/sections/about/AudioTapesSection";
import DvdSection from "@/sections/about/DvdSection";
import FormatsChangeMemories from "@/sections/about/Formatschangememories";
import MediaTypes from "@/sections/about/Mediatypes";
import MoreServicesPricesSection from "@/sections/about/MoreServicesPricesSection";
import MovieFilmsSection from "@/sections/about/MovieFilmsSection";
import PhotosSlidesSection from "@/sections/about/PhotosSlidesSection";
import TapTratmentSections from "@/sections/about/TapTratmentSections";
import VideoTapesSection from "@/sections/about/VideoTapesSection";
// import HeroServicesSection from "@/sections/services/HeroServicesSection";
import { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const isEn = cookieStore.get("language")?.value === "en";

  return isEn
    ? {
        title:
          "Ahmed Studio | Converting Audiovisual Heritage to Digital Formats",
        description:
          "Discover key media types and video tapes used for heritage preservation along with solutions for digitized media enhancement.",
        alternates: {
          canonical: "https://ahmed-studio.com/formats"
        },
        openGraph: {
          title:
            "Ahmed Studio | Converting Audiovisual Heritage to Digital Formats",
          description:
            "Discover key media types and video tapes used for heritage preservation along with solutions for digitized media enhancement.",
          url: "https://ahmed-studio.com/formats",
          siteName: "Ahmed Studio",
          type: "website"
        },
        robots: {
          index: true,
          follow: true
        }
      }
    : {
        title: "Ahmed Studio | تحويل التراث السمعي و المرئي الى ملف رقمي",
        description:
          "اكتشف أهم الوسائط و انواع الاشرطة المستخدمة لحفظ التراث و الحلول في رقمنة و حفظ وتحسين الصور و الأفلام والأشرطة",
        alternates: {
          canonical: "https://ahmed-studio.com/formats"
        },
        openGraph: {
          title: "Ahmed Studio | تحويل التراث السمعي و المرئي الى ملف رقمي",
          description:
            "اكتشف أهم الوسائط و انواع الاشرطة المستخدمة لحفظ التراث و الحلول في رقمنة و حفظ وتحسين الصور و الأفلام والأشرطة",
          url: "https://ahmed-studio.com/formats",
          siteName: "Ahmed Studio",
          type: "website"
        },
        robots: {
          index: true,
          follow: true
        }
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
