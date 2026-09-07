import DigitizationEquipmentSection from "@/sections/ourLab/DigitizationEquipmentSection";
import HeroOurLabSection from "@/sections/ourLab/HeroOurLabSection";
import OurEquipmentSection from "@/sections/ourLab/OurEquipmentSection";
//import PreservationWorkflowSection from "@/sections/ourLab/PreservationWorkflowSection";
import { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const language = cookieStore.get("language")?.value === "en" ? "en" : "ar";

  return language === "ar"
    ? {
        title: "معمل الحفظ الرقمي والأرشيف | استوديو أحمد",
        description:
          "معمل متخصص يمتلك أحدث تقنيات الحفظ الرقمي لحماية الأرشيف والتراث التاريخي من التلف.",
        keywords: ["الحفظ الرقمي", "معمل الرقمية"]
      }
    : {
        title: "Digital Preservation Lab | Ahmed Studio",
        description:
          "Specialized lab equipped with advanced digital preservation technologies to protect historical archives.",
        keywords: ["Digital Preservation", "Digital Archiving Lab"]
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
