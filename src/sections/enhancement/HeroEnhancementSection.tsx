import Image from "next/image";

export default function HeroEnhancementSection() {
  return (
    <div className="relative w-full h-[55vh] sm:h-[65vh] md:h-[90vh] mt-4 overflow-hidden rounded-[10px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/enhancemenentBg.jpg"
          alt="Hero"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
    </div>
  );
}
