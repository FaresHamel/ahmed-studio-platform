import DigitizationEquipmentSection from "@/sections/ourLab/DigitizationEquipmentSection";
import HeroOurLabSection from "@/sections/ourLab/HeroOurLabSection";
import OurEquipmentSection from "@/sections/ourLab/OurEquipmentSection";
import PreservationWorkflowSection from "@/sections/ourLab/PreservationWorkflowSection";

export default function OurLab() {
  return (
    <>
      <section
        className={
          "w-full px-4 md:px-16 py-20 md:py-20 space-y-12 md:space-y-24"
        }
      >
        <HeroOurLabSection />
      </section>
      <OurEquipmentSection />
      <DigitizationEquipmentSection />
      <PreservationWorkflowSection />
    </>
  );
}
