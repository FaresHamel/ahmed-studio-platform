import AboutSection from "../sections/home/AboutSection";
import CloudSection from "../sections/home/CloudSection";
import CoreServices from "../sections/home/CoreServicesSection";
import EnhancementSection from "../sections/home/EnhancementSection";
import HeroSection from "../sections/home/HeroSection"
import PaymentSplitSection from "../sections/home/PaymentSplitSection";
import PossibilitiesSection from "../sections/home/PossibilitiesSection";
import ProfessionalSection from "../sections/home/ProfessionalSection";
import StatisticsSection from "../sections/home/StatisticsSection";
import SubscriptionSection from "../sections/home/SubscriptionSection";
import SupportFormatsSection from "../sections/home/SupportFormatsSection";
import WhyTrustedSection from "../sections/home/WhyTrustedSection";
import WhyUsSection from "../sections/home/WhyUsSection";
import WorkflowSection from "../sections/home/WorkflowSection";

export default function Home() {
  return (
    <>
      <section className={"w-full px-4 md:px-16 py-10 space-y-12 md:space-y-24 py-20"}>
        <HeroSection />
        <AboutSection />
        <WorkflowSection />
      </section>
      <CoreServices />
      <SupportFormatsSection />
      <section className={"w-full px-4 md:px-16 py-10 space-y-12 md:space-y-24 py-20"}>
        <CloudSection />
        <ProfessionalSection />
        <PossibilitiesSection />
      </section>
      <PaymentSplitSection />
      <section className={"w-full px-4 md:px-16 py-10 space-y-12 md:space-y-24 py-20"}>
        <EnhancementSection />
        <StatisticsSection />
        <WhyUsSection />
      </section>
      <WhyTrustedSection />
      <section className={"w-full px-4 md:px-16 py-10 space-y-12 md:space-y-24 py-20"}>
        <SubscriptionSection />
      </section>
    </>
  );
}
