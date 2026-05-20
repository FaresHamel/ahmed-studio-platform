import Image from "next/image";

export default function HeroServicesSection() {
  return (
    <div className="relative w-full h-[55vh] sm:h-[55vh] md:h-[80vh] mt-4 overflow-hidden rounded-[10px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/heroServicesBg.png"
          alt="Hero"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-start px-4 sm:px-8 md:px-16">
        <div className="flex flex-col items-center max-w-4xl">
          {/* TITLE */}
          <h1 className="font-playfair text-white leading-tight text-[26px] sm:text-4xl md:text-6xl lg:text-7xl max-w-3xl">
            Preserving Memories
            <br />
            <span className="text-white text-[26px] sm:text-4xl md:text-6xl lg:text-7xl">
            for the Future
            </span>
          </h1>

          {/* DESCRIPTION */}
          <p className="mt-4 px-[5px] sm:mt-6 font-poppins text-white/90 leading-relaxed max-w-2xl text-[13px] sm:text-base md:text-xl">
            Ahmed Studio offers professional digitization and consulting
            services for audio, <br className="hidden md:block" />
            video, photos, and film designed to protect your archives and ensure
            long-term access.
          </p>
        </div>
      </div>
    </div>
  );
}
