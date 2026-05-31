import GenericHeroSection from "@/src/components/sections/GenericHeroSection";

export default function HeroConsultantSection() {
  return (
    <GenericHeroSection
      imageSrc="/images/consultantImg.jpg"
      imageAlt="Consultant"
      title="Protect Your Archive"
      titleHighlight="Secure Your Legacy."
      description="From individual memories to national heritage—we ensure your digitization project is done right the first time."
      height="large"
    />
  );
}
