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
  const isEn = cookieStore.get("language")?.value === "en";

  return isEn
    ? {
        title:
          "Ahmed Studio | Differences Between Professional & Home Digitization",
        description:
          "Learn the key differences between professional laboratory equipment and home digitization capture cards along with output comparisons.",
        alternates: {
          canonical: "https://ahmed-studio.com/differences"
        },
        openGraph: {
          title:
            "Ahmed Studio | Differences Between Professional & Home Digitization",
          description:
            "Learn the key differences between professional laboratory equipment and home digitization capture cards along with output comparisons.",
          url: "https://ahmed-studio.com/differences",
          siteName: "Ahmed Studio",
          type: "website"
        },
        robots: {
          index: true,
          follow: true
        }
      }
    : {
        title: "Ahmed Studio | الفروقات بين الرقمنة الإحترافية و المنزلية",
        description:
          "إحصل على الفروقات و وعي نفسك بأهم الإختلافات مابين الأجهزة الإحترافية و الوصلات المستخدمة في المعامل و الرقمنة المنزلية و مخرجاتها",
        alternates: {
          canonical: "https://ahmed-studio.com/differences"
        },
        openGraph: {
          title: "Ahmed Studio | الفروقات بين الرقمنة الإحترافية و المنزلية",
          description:
            "إحصل على الفروقات و وعي نفسك بأهم الإختلافات مابين الأجهزة الإحترافية و الوصلات المستخدمة في المعامل و الرقمنة المنزلية و مخرجاتها",
          url: "https://ahmed-studio.com/differences",
          siteName: "Ahmed Studio",
          type: "website"
        },
        robots: {
          index: true,
          follow: true
        }
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
