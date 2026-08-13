export default function HeroEnhancementSection() {
  return (
    <div className="relative w-full h-[320px] sm:h-[450px] md:h-[90vh] mt-4 overflow-hidden rounded-[10px]">
      {/* Background Image Container */}
      <div className="absolute inset-0 w-full h-full">
        {/* <Image
          src="/images/enhancemenentBg.jpg"
          alt="Hero"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        /> */}
        <video
          src="/video/enhancement.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
    </div>
  );
}
