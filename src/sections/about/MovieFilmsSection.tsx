import Image from "next/image";

interface FilmReel {
  id: number;
  sizeLabel: string;
  imageSrc: string;
  imageAlt: string;
  sizeClass: string;
  positionClass: string;
}

const filmReelsData: FilmReel[] = [
  {
    id: 1,
    sizeLabel: "35mm",
    imageSrc: "/images/film-35mm.png",
    imageAlt: "35mm Movie Film Reel",
    sizeClass: "w-[90px] md:w-[90px] lg:w-[150px]",
    positionClass: "-mt-10 md:-mt-20 z-30",
  },
  {
    id: 2,
    sizeLabel: "16mm",
    imageSrc: "/images/film-16mm.png",
    imageAlt: "16mm Movie Film Reel",
    sizeClass: "w-[70px] md:w-[100px] lg:w-[140px]",
    positionClass: "-mt-6 md:-mt-10 z-20",
  },
  {
    id: 3,
    sizeLabel: "8mm",
    imageSrc: "/images/film-8mm.png",
    imageAlt: "8mm Movie Film Reel",
    sizeClass: "w-[60px] md:w-[80px] lg:w-[120px]",
    positionClass: "-mt-6 md:-mt-10 -mb-10 md:-mb-20 z-10",
  },
];

export default function MovieFilmsSection() {
  return (
      <section className="max-w-7xl mx-auto bg-white md:my-[10px] w-full overflow-visible">
        {/* هذه الحاوية الآن تأخذ w-full (100% من عرض max-w-7xl) بشكل كامل وتطابق الأب تماماً */}
        <div className="w-full py-12 max-w-7xl flex flex-col bg-[#DFBFA4] lg:flex-row items-center justify-between gap-14 lg:gap-30 overflow-visible px-20">
          {/* Left Content */}
          <div className="w-full lg:w-1/2 z-10">
            <h2 className="font-poppins text-primary text-[34px] sm:text-[42px] md:text-[52px] font-semibold leading-tight mb-5">
              Movie Films
            </h2>

            <p className="font-poppins text-black/70 text-[15px] md:text-[17px] leading-relaxed max-w-xl">
              Old reels, new memories. Convert your 8mm, Super 8, and 16mm films
              into high-quality digital videos perfect for reliving every
              moment.
            </p>
          </div>

          {/* Right Reels */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-end relative">
            {filmReelsData.map((reel) => (
              <div
                key={reel.id}
                className={`relative flex items-center gap-3 md:gap-5 ${reel.positionClass}`}
              >
                {/* Reel Image */}
                <div
                  className={`relative ${reel.sizeClass} flex-shrink-0 drop-shadow-[0_12px_20px_rgba(0,0,0,0.28)]`}
                >
                  <Image
                    src={reel.imageSrc}
                    alt={reel.imageAlt}
                    width={300}
                    height={300}
                    className="w-full h-auto object-contain"
                    priority
                  />
                </div>

                {/* Label */}
                <span className="font-poppins text-black font-bold text-[15px] md:text-[20px] whitespace-nowrap">
                  {reel.sizeLabel}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
  );
}
