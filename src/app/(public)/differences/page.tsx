import HeroSection from "@/sections/differences/HeroSection";
import IntroSection from "@/sections/differences/IntroSection";
import TrustCardsSection from "@/sections/differences/TrustCardsSection";
import ComparisonTableSection from "@/sections/differences/ComparisonTableSection";
import FeaturesSection from "@/sections/differences/FeaturesSection";
import HardwareComparison from "@/sections/differences/HardwareComparison";
import IndustryComparison from "@/sections/differences/IndustryComparison";
import { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const language = cookieStore.get("language")?.value === "en" ? "en" : "ar";

  return language === "ar"
    ? {
        title: "توضيح الصور وزيادة دقة الصور | استوديو أحمد",
        description:
          "أدوات وتقنيات احترافية في توضيح الصور وزيادة دقة الصور الضبابية القديمة بدقة عالية.",
        keywords: ["توضيح الصور", "زيادة دقة الصور"]
      }
    : {
        title: "Image Clarification & Upscaling | Ahmed Studio",
        description:
          "Professional technology for image clarification and photo resolution upscaling for blurred or old media.",
        keywords: [
          "Image Clarification",
          "Photo Resolution Upscaling",
          "Image Upscaling"
        ]
      };
}
export default function DifferencesPage() {
  return (
    <>
      <section className={`w-full px-6 md:px-16 py-20`}>
        <HeroSection />
      </section>
      <IntroSection />
      <TrustCardsSection />
      <ComparisonTableSection />
      <HardwareComparison />
      <IndustryComparison/>
      <FeaturesSection />
    </>
  );
}
