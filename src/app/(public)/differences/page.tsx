import HeroSection from "@/sections/differences/HeroSection";
import IntroSection from "@/sections/differences/IntroSection";
import TrustCardsSection from "@/sections/differences/TrustCardsSection";
import ComparisonTableSection from "@/sections/differences/ComparisonTableSection";
import FeaturesSection from "@/sections/differences/FeaturesSection";
import HardwareComparison from "@/sections/differences/HardwareComparison";
import IndustryComparison from "@/sections/differences/IndustryComparison";

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
