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
  const language = cookieStore.get("language")?.value === "en" ? "en" : "ar";

  return language === "ar"
    ? {
        title: "استشارات التحول الرقمي والرقمنة | استوديو أحمد",
        description:
          "تقديم استشارات تخصصة للمؤسسات في مجالات الرقمنة، التحول الرقمي، وإدارة البيانات.",
        keywords: ["استشارات", "استشارات رقمية"]
      }
    : {
        title: "Digital Transformation & IT Consulting | Ahmed Studio",
        description:
          "Expert digital consulting and technical advisory services for media digitization and strategy.",
        keywords: ["Digital Consulting", "IT Advisory", "Consulting"]
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
