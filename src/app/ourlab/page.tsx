import DigitizationEquipmentSection from "@/src/sections/ourLab/DigitizationEquipmentSection";
import HeroOurLabSection from "@/src/sections/ourLab/HeroOurLabSection";
import OurEquipmentSection from "@/src/sections/ourLab/OurEquipmentSection";
import PreservationWorkflowSection from "@/src/sections/ourLab/PreservationWorkflowSection";

export default function OurLab() {
  return (
    <>
      <section className={`w-full px-6 md:px-16 py-20`}>
        <HeroOurLabSection />
        <OurEquipmentSection />
      </section>
      <DigitizationEquipmentSection />
      <PreservationWorkflowSection/>
    </>
  );
}
