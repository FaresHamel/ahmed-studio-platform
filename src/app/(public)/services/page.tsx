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
          "Explore comprehensive services for digitizing video tapes, audio recordings, films, and photos with expert image and video restoration."
      }
    : {
        title: "Ahmed Studio | خدمات التحول الرقمي وتعديل الصور والترميم",
        description:
          "اكتشف خدمات أحمد ستوديو المتكاملة لرقمنة أشرطة الفيديو والتسجيلات والأفلام والصور، مع تحسين و ترميم وتعديل للصور و الفيديو والاستشارات المتخصصة."
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
