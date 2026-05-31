import HeroSection from "@/src/sections/differences/HeroSection";
import IntroSection from "@/src/sections/differences/IntroSection";
import TrustCardsSection from "@/src/sections/differences/TrustCardsSection";
import ComparisonTableSection from "@/src/sections/differences/ComparisonTableSection";
import FeaturesSection from "@/src/sections/differences/FeaturesSection";
import HardwareComparison from "@/src/sections/differences/HardwareComparison";
import IndustryComparison from "@/src/sections/differences/IndustryComparison";

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
