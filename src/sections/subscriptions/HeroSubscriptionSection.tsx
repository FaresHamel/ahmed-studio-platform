import Image from "next/image";

export default function HeroSubscriptionSection() {
  return (
    /* 1. أضفنا mt-24 لترك مساحة للـ Navbar الثابت */
    /* 2. أضفنا rounded-[20px] و overflow-hidden لقص الصورة عند الحواف */
    <div className="relative w-full h-[55vh] sm:h-[55vh] md:h-[80vh] mt-4 overflow-hidden rounded-[10px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/heroSubscription.jpg"
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
            Your Priceless
            <br />
            <span className="text-white text-[26px] sm:text-4xl md:text-6xl lg:text-7xl">
              Memories Digitized
            </span>
          </h1>

          {/* DESCRIPTION */}
          <p className="mt-4 sm:mt-6 px-[30px] font-poppins text-white/90 leading-relaxed max-w-2xl text-[13px] sm:text-base md:text-xl">
            Beyond mere conversion—we provide a master-class restoration for
            your family’s visual heritage, <br className="hidden md:block" />
            From the grain of vintage 8mm film to the nostalgic hum of VHS, we
            treat every frame as a work of art, bridging the gap between your
            most cherished yesterdays and the high-definition clarity of today.
          </p>
        </div>
      </div>
    </div>
  );
}
