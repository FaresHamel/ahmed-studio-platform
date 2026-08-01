import SubscriptionSection from "@/sections/home/SubscriptionSection";
import CoreServicesSubscriptionSection from "@/sections/subscriptions/CoreServicesSubscriptionSection";
import HeroSubscriptionSection from "@/sections/subscriptions/HeroSubscriptionSection";

export default function Subscription() {
  return (
    <>
      <section className={"w-full px-4 md:px-16 py-10 md:py-20 space-y-12 md:space-y-24"}>
        <HeroSubscriptionSection />
        <CoreServicesSubscriptionSection />
      </section>
      <SubscriptionSection />
    </>
  );
}
