import CoreServicesEnhancement from '@/src/sections/enhancement/CoreServicesEnhancement';
import CustomeAiSolution from '@/src/sections/enhancement/CustomeAiSolution';
import HeroEnhancementSection from '@/src/sections/enhancement/HeroEnhancementSection';
import StorySection from '@/src/sections/enhancement/StorySection';
import TrainingToUnderstand from '@/src/sections/enhancement/TrainingToUnderstand';

const Enhancement = () => {
  return (
    <>
      <section className={`w-full px-6 md:px-16 py-20`}>
        <HeroEnhancementSection />
        <CoreServicesEnhancement />
        <StorySection />
        <CustomeAiSolution />
        <TrainingToUnderstand/>
      </section>
    </>
  );
}

export default Enhancement;
