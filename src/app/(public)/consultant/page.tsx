import BenefitsGrid from "@/sections/consultant/Benefitsgrid";
import BeyondDigitization from "@/sections/consultant/Beyonddigitization";
import CoreServicesConsultationSection from "@/sections/consultant/CoreServicesConsultationSection";
import FutureProofArchive from "@/sections/consultant/FutureProofArchive";
import HeroConsultantSection from "@/sections/consultant/HeroConsultantSection";
import ConsultingServicesEnhanced from "@/sections/consultant/OurConsultantServices";
import ProfessionalConsulting from "@/sections/consultant/Professionalconsulting";
import ReadyToPreserve from "@/sections/consultant/Readytopreserve";
import WhatDoes from "@/sections/consultant/WhatDoes";
import WhatCanGoWrong from "@/sections/consultant/Whatcangowrong";
import WhoWeServe from "@/sections/consultant/WhoWeServe";
import WhyConsultant from "@/sections/consultant/WhyConsultant";
import WhyAhmedStudio from "@/sections/consultant/Whyahmedstudio";
import { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const isEn = cookieStore.get("language")?.value === "en";

  return isEn
    ? {
        title: "Ahmed Studio | Professional Digitization & Archival Consulting",
        description:
          "Get expert consulting for digitization and archiving projects, including archive assessment, workflow planning, and long-term preservation."
      }
    : {
        title: "Ahmed Studio | استشارات الرقمنة وحفظ الأرشيف باحترافية",
        description:
          "احصل على استشارات متخصصة لمشاريع الرقمنة والأرشفة، تشمل تقييم الأرشيف وتخطيط سير العمل واختيار الأجهزة والإشراف على الجودة والحفظ طويل الأمد."
      };
}
export default function Consultant() {
  return (
    <section
      className={"w-full px-4 md:px-16 py-20 md:py-20 space-y-12 md:space-y-24"}
    >
      <HeroConsultantSection />
      <CoreServicesConsultationSection />
      <WhatDoes />
      <WhyConsultant />
      <ConsultingServicesEnhanced />
      <WhoWeServe />
      <FutureProofArchive />
      <WhyAhmedStudio />
      <WhatCanGoWrong />
      <ReadyToPreserve />
      <BeyondDigitization />
      <BenefitsGrid />
      <ProfessionalConsulting />
    </section>
  );
}
