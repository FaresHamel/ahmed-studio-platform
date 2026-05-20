import CoreServicesServicesSections from "@/src/sections/services/CoreServicesServicesSections";
import HeroServicesSection from "@/src/sections/services/HeroServicesSection";
import ServicesSectionCards from "@/src/sections/services/ServicesSectionCards";

export default function Services() {
  return (
    <>
      <section className={`w-full px-6 md:px-16 py-20`}>
        <HeroServicesSection />
        <CoreServicesServicesSections />
        <ServicesSectionCards/>
      </section>
    </>
  );
}
