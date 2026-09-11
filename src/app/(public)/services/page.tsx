import CoreServicesServicesSections from "@/sections/services/CoreServicesServicesSections";
import HeroServicesSection from "@/sections/services/HeroServicesSection";
import ServicesSectionCards from "@/sections/services/ServicesSectionCards";
import { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const isEn = cookieStore.get("language")?.value === "en";
  return isEn
    ? {
        title:
          "Ahmed Studio | Digital Transformation, Image Editing & Restoration",
        description:
          "Explore comprehensive services for digitizing video tapes, audio recordings, films, and photos with expert image and video restoration.",
        alternates: { canonical: "https://ahmed-studio.com/services" },
        openGraph: {
          title:
            "Ahmed Studio | Digital Transformation, Image Editing & Restoration",
          description:
            "Explore comprehensive services for digitizing video tapes, audio recordings, films, and photos with expert image and video restoration.",
          url: "https://ahmed-studio.com/services",
          siteName: "Ahmed Studio",
          type: "website"
        },
        robots: { index: true, follow: true }
      }
    : {
        title: "Ahmed Studio | خدمات التحول الرقمي وتعديل الصور والترميم",
        description:
          "اكتشف خدمات أحمد ستوديو المتكاملة لرقمنة أشرطة الفيديو والتسجيلات والأفلام والصور، مع تحسين وترميم وتعديل للصور والفيديو والاستشارات المتخصصة.",
        alternates: { canonical: "https://ahmed-studio.com/services" },
        openGraph: {
          title: "Ahmed Studio | خدمات التحول الرقمي وتعديل الصور والترميم",
          description:
            "اكتشف خدمات أحمد ستوديو المتكاملة لرقمنة أشرطة الفيديو والتسجيلات والأفلام والصور، مع تحسين وترميم وتعديل للصور والفيديو والاستشارات المتخصصة.",
          url: "https://ahmed-studio.com/services",
          siteName: "Ahmed Studio",
          type: "website"
        },
        robots: { index: true, follow: true }
      };
}
export default function Services() {
  return (
    <>
      <section className={"w-full px-4 md:px-16 py-20 md:py-20 space-y-12 md:space-y-24"}>
        <HeroServicesSection />
        <CoreServicesServicesSections />
        <ServicesSectionCards />
      </section>
    </>
  );
}
