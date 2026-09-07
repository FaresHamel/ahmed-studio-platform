import CoreServicesServicesSections from "@/sections/services/CoreServicesServicesSections";
import HeroServicesSection from "@/sections/services/HeroServicesSection";
import ServicesSectionCards from "@/sections/services/ServicesSectionCards";
import { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const language = cookieStore.get("language")?.value === "en" ? "en" : "ar";

  return language === "ar"
    ? {
        title: "خدمات التسجيل الصوتي وتعديل الصور | استوديو أحمد",
        description:
          "خدمات احترافية تشمل تسجيل صوتي عالي النقاء وإجراء كافة عمليات تعديل الصور بأعلى معايير.",
        keywords: ["تسجيل صوتي", "تعديل الصور"]
      }
    : {
        title: "Audio Recording & Photo Editing Services | Ahmed Studio",
        description:
          "Professional studio services offering crystal-clear audio recording and advanced photo editing.",
        keywords: ["Audio Recording", "Photo Editing", "Audio Services"]
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
