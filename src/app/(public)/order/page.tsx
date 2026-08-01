import FAQSection from "@/sections/order/FAQSection";
import FinalStepsSection from "@/sections/order/FinalStepsSection";
import HowItsWorkSection from "@/sections/order/HowItsWorkSection";
import PlaceOrderSection from "@/sections/order/PlaceOrderSection";
import StepsSection from "@/sections/order/StepsSection";

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
