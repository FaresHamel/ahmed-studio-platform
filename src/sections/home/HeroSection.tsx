import GenericHeroSection from "@/src/components/sections/GenericHeroSection";

export default function HeroSection() {
  return (
    <GenericHeroSection
      imageSrc="/images/hero.png"
      imageAlt="Hero"
      title="Every Archive"
      titleHighlight="tells a story"
      description="Professional audio, visual, and film digitization for museums, archives, and private collections."
      height="large"
    />
  );
}
