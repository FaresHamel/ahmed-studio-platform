import Image from "next/image";

export default function HeroSection() {
  return (
    /* 1. أضفنا mt-24 لترك مساحة للـ Navbar الثابت */
    /* 2. أضفنا rounded-[20px] و overflow-hidden لقص الصورة عند الحواف */
    <div className="relative w-full h-[55vh] sm:h-[65vh] md:h-[90vh] mt-4 overflow-hidden rounded-[10px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero.png"
          alt="Hero"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-8 md:px-16 text-center">
        <div className="flex flex-col items-center max-w-4xl">
          {/* TITLE */}
          <h1 className="font-playfair text-white leading-tight text-[26px] sm:text-4xl md:text-6xl lg:text-7xl max-w-3xl">
            Every Archive <br />
            <span className="text-primary">tells a story</span>
          </h1>

          {/* DESCRIPTION */}
          <p className="mt-4 sm:mt-6 font-poppins text-white/90 leading-relaxed max-w-2xl text-[13px] sm:text-base md:text-xl">
            Professional audio, visual, and film digitization for museums,{" "}
            <br className="hidden md:block" />
            archives, and private collections.
          </p>
        </div>
      </div>
    </div>
  );
}
