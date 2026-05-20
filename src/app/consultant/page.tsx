import BenefitsGrid from "@/src/sections/consultant/Benefitsgrid";
import BeyondDigitization from "@/src/sections/consultant/Beyonddigitization";
import CoreServicesConsultationSection from "@/src/sections/consultant/CoreServicesConsultationSection";
import FutureProofArchive from "@/src/sections/consultant/FutureProofArchive";
import HeroConsultantSection from "@/src/sections/consultant/HeroConsultantSection";
import ConsultingServicesEnhanced from "@/src/sections/consultant/OurConsultantServices";
import ProfessionalConsulting from "@/src/sections/consultant/Professionalconsulting";
import ReadyToPreserve from "@/src/sections/consultant/Readytopreserve";
import WhatDoes from "@/src/sections/consultant/WhatDoes";
import WhatCanGoWrong from "@/src/sections/consultant/Whatcangowrong";
import WhoWeServe from "@/src/sections/consultant/WhoWeServe";
import WhyConsultant from "@/src/sections/consultant/WhyConsultant";
import WhyAhmedStudio from "@/src/sections/consultant/Whyahmedstudio";

export default function Consultant() {
  return (
    <section className={`w-full px-6 md:px-16 py-20`}>
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
      <ProfessionalConsulting/>
    </section>
  );
}
