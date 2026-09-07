import FAQSection from "@/sections/order/FAQSection";
import FinalStepsSection from "@/sections/order/FinalStepsSection";
import HowItsWorkSection from "@/sections/order/HowItsWorkSection";
import PlaceOrderSection from "@/sections/order/PlaceOrderSection";
import StepsSection from "@/sections/order/StepsSection";
import { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const language = cookieStore.get("language")?.value === "en" ? "en" : "ar";

  return language === "ar"
    ? {
        title: "طلب رقمنة الوسائط والأرشيف | استوديو أحمد",
        description:
          "اطلب خدماتنا المخصصة في رقمنة الوسائط، رقمنة الأرشيف، ورقمنة الصور بدقة عالية.",
        keywords: ["رقمنة الوسائط", "رقمنة الأرشيف", "رقمنة الصور"]
      }
    : {
        title: "Order Media & Archive Digitization | Ahmed Studio",
        description:
          "Order custom media digitization, archive digitization, and high-resolution photo scanning services.",
        keywords: [
          "Media Digitization",
          "Archive Digitization",
          "Photo Digitization"
        ]
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
