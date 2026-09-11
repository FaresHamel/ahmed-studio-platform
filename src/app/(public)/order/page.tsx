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
        title: "Ahmed Studio | Convert Old Video Tapes to Digital Files & CD",
        description:
          "We provide media, archive, and photo digitization services to convert tapes, film, recordings, and photos into high-quality digital files.",
        alternates: { canonical: "https://ahmed-studio.com/order" },
        openGraph: {
          title: "Ahmed Studio | Convert Old Video Tapes to Digital Files & CD",
          description:
            "We provide media, archive, and photo digitization services to convert tapes, film, recordings, and photos into high-quality digital files.",
          url: "https://ahmed-studio.com/order",
          siteName: "Ahmed Studio",
          type: "website"
        },
        robots: { index: true, follow: true }
      }
    : {
        title: "Ahmed Studio | تحويل أشرطة الفيديو القديمة إلى رقمي سي دي",
        description:
          "نقدم خدمات رقمنة الوسائط ورقمنة الأرشيف ورقمنة الصور، لتحويل الأشرطة والأفلام والتسجيلات والصور إلى ملفات رقمية عالية الجودة مع حفظ آمن.",
        alternates: { canonical: "https://ahmed-studio.com/order" },
        openGraph: {
          title: "Ahmed Studio | تحويل أشرطة الفيديو القديمة إلى رقمي سي دي",
          description:
            "نقدم خدمات رقمنة الوسائط ورقمنة الأرشيف ورقمنة الصور، لتحويل الأشرطة والأفلام والتسجيلات والصور إلى ملفات رقمية عالية الجودة مع حفظ آمن.",
          url: "https://ahmed-studio.com/order",
          siteName: "Ahmed Studio",
          type: "website"
        },
        robots: { index: true, follow: true }
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
