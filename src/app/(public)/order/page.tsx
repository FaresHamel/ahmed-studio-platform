import FAQSection from "@/sections/order/FAQSection";
import FinalStepsSection from "@/sections/order/FinalStepsSection";
import HowItsWorkSection from "@/sections/order/HowItsWorkSection";
import PlaceOrderSection from "@/sections/order/PlaceOrderSection";
import StepsSection from "@/sections/order/StepsSection";
import { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const isEn = cookieStore.get("language")?.value === "en";

  return isEn
    ? {
        title: "Ahmed Studio | Convert Old Video Tapes to Digital CD/Files",
        description:
          "We provide media, archive, and photo digitization services to convert tapes, film, and recordings into high-quality digital files."
      }
    : {
        title: "Ahmed Studio | تحويل أشرطة الفيديو القديمة إلى رقمي سي دي",
        description:
          "نقدم خدمات رقمنة الوسائط ورقمنة الأرشيف ورقمنة الصور، لتحويل الأشرطة والأفلام والتسجيلات والصور إلى ملفات رقمية عالية الجودة مع حفظ آمن."
      };
}
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
