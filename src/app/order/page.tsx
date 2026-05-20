import FAQSection from "@/src/sections/order/FAQSection";
import FinalStepsSection from "@/src/sections/order/FinalStepsSection";
import HowItsWorkSection from "@/src/sections/order/HowItsWorkSection";
import PlaceOrderSection from "@/src/sections/order/PlaceOrderSection";
import StepsSection from "@/src/sections/order/StepsSection";

export default function Order() {
  return (
    <>
      <section className={`w-full px-6 md:px-16`}>
       <HowItsWorkSection/>
      </section>
      <PlaceOrderSection />
      <StepsSection />
      <FinalStepsSection />
      <FAQSection/>
    </>
  );
}
