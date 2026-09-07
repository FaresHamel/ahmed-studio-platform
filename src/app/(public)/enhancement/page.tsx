import CoreServicesEnhancement from '@/sections/enhancement/CoreServicesEnhancement';
import CustomeAiSolution from '@/sections/enhancement/CustomeAiSolution';
import HeroEnhancementSection from '@/sections/enhancement/HeroEnhancementSection';
import StorySection from '@/sections/enhancement/StorySection';
import TrainingToUnderstand from '@/sections/enhancement/TrainingToUnderstand';
import { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const language = cookieStore.get("language")?.value === "en" ? "en" : "ar";

  return language === "ar"
    ? {
        title: "تحسين جودة الصورة والفيديو بالذكاء الاصطناعي | استوديو أحمد",
        description:
          "خدمات متقدمة لتنفيذ تحسين جودة الصورة وتحسين الصور بالذكاء الاصطناعي مع تحسين جودة الفيديو.",
        keywords: [
          "تحسين جودة الصورة",
          "تحسين الصور بالذكاء الاصطناعي",
          "تحسين جودة الفيديو"
        ]
      }
    : {
        title: "AI Image & Video Quality Enhancement | Ahmed Studio",
        description:
          "Advanced AI image restoration, image quality enhancement, and high-definition video enhancement.",
        keywords: [
          "Image Quality Enhancement",
          "AI Image Restoration",
          "Video Quality Enhancement"
        ]
      };
}
const Enhancement = () => {
  return (
    <>
      <section className={`w-full px-4  md:py-24 md:px-16 py-20`}>
        <HeroEnhancementSection />
        <CoreServicesEnhancement />
        <StorySection />
        <CustomeAiSolution />
        <TrainingToUnderstand />
      </section>
    </>
  );
}

export default Enhancement;
