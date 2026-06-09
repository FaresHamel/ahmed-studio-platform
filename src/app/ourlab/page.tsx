import DigitizationEquipmentSection from "@/src/sections/ourLab/DigitizationEquipmentSection";
import HeroOurLabSection from "@/src/sections/ourLab/HeroOurLabSection";
import OurEquipmentSection from "@/src/sections/ourLab/OurEquipmentSection";
import PreservationWorkflowSection from "@/src/sections/ourLab/PreservationWorkflowSection";

export default function OurLab() {
  return (
    <>
      <section
        className={`w-full px-4 md:px-16 py-10 space-y-12 md:space-y-24 py-20`}
      >
        <HeroOurLabSection />
      </section>
      <OurEquipmentSection />
      <DigitizationEquipmentSection />
      <PreservationWorkflowSection />
    </>
  );
}
