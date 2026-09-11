import DigitizationEquipmentSection from "@/sections/ourLab/DigitizationEquipmentSection";
import HeroOurLabSection from "@/sections/ourLab/HeroOurLabSection";
import OurEquipmentSection from "@/sections/ourLab/OurEquipmentSection";
//import PreservationWorkflowSection from "@/sections/ourLab/PreservationWorkflowSection";
import { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const isEn = cookieStore.get("language")?.value === "en";

  return isEn
    ? {
        title:
          "Ahmed Studio | Digital Preservation & Professional Equipment Lab",
        description:
          "Discover the Ahmed Studio lab equipped with professional hardware for high-fidelity tape, film, audio, and photo digitization."
      }
    : {
        title: "Ahmed Studio | الحفظ الرقمي ومعدات الرقمنة الاحترافية",
        description:
          "تعرّف على معمل أحمد ستوديو المتخصص في الحفظ الرقمي، مع معدات رقمنة احترافية لتحويل الأفلام والفيديو والصوت والصور بجودة عالية وحفظ موثوق."
      };
}
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
      {/* <PreservationWorkflowSection /> */}
    </>
  );
}
