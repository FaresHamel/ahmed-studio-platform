import CoreServicesEnhancement from '@/sections/enhancement/CoreServicesEnhancement';
import CustomeAiSolution from '@/sections/enhancement/CustomeAiSolution';
import HeroEnhancementSection from '@/sections/enhancement/HeroEnhancementSection';
import StorySection from '@/sections/enhancement/StorySection';
import TrainingToUnderstand from '@/sections/enhancement/TrainingToUnderstand';
import { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const isEn = cookieStore.get("language")?.value === "en";

  return isEn
    ? {
        title: "Ahmed Studio | Photo Quality Enhancement & Video Restoration",
        description:
          "Visual archive processing services to enhance old video quality, reduce noise, and adjust colors using modern digital restoration tools."
      }
    : {
        title: "Ahmed Studio | تحسين جودة الصور و ترميم الفيديو",
        description:
          "خدمات معالجة الأرشيف المرئي وتحسين جودة الفيديوهات القديمة، إزالة التشويش وتعديل الألوان باستخدام احدث تقنيات المعالجة الرقمية."
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
