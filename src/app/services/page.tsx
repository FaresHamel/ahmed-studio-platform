import CoreServicesServicesSections from "@/src/sections/services/CoreServicesServicesSections";
import HeroServicesSection from "@/src/sections/services/HeroServicesSection";
import ServicesSectionCards from "@/src/sections/services/ServicesSectionCards";

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
