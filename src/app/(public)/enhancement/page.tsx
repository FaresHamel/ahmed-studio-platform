import CoreServicesEnhancement from '@/sections/enhancement/CoreServicesEnhancement';
import CustomeAiSolution from '@/sections/enhancement/CustomeAiSolution';
import HeroEnhancementSection from '@/sections/enhancement/HeroEnhancementSection';
import StorySection from '@/sections/enhancement/StorySection';
import TrainingToUnderstand from '@/sections/enhancement/TrainingToUnderstand';

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
