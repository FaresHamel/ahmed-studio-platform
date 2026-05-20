import Image from "next/image";

interface FilmReel {
  id: number;
  imageSrc: string;
  imageAlt: string;
  sizeClass: string;
  positionClass: string;
}

export default function AudioTapesSection() {

  const filmReelsData: FilmReel[] = [
  {
    id: 1,
    imageSrc: "/images/tape-cassette.png",
    imageAlt: "35mm Movie Film Reel",
    sizeClass: "w-[90px] md:w-[90px] lg:w-[150px]",
    positionClass: "-mt-10 md:-mt-20 z-30"
  },
  {
    id: 2,
    imageSrc: "/images/video-other11.png",
    imageAlt: "16mm Movie Film Reel",
    sizeClass: "w-[70px] md:w-[100px] lg:w-[140px]",
    positionClass: "-mt-6 md:-mt-10 z-20"
  },
  {
    id: 3,
    imageSrc: "/images/tape-vinyl.png",
    imageAlt: "8mm Movie Film Reel",
    sizeClass: "w-[60px] md:w-[80px] lg:w-[120px]",
    positionClass: "-mt-6 md:-mt-10 -mb-10 md:-mb-20 z-10"
  }
];

  return (
    <section className="max-w-7xl mx-auto bg-[#F7F1EC] my-10 sm:my-16 md:my-[100px] w-full overflow-visible">
      {/* هذه الحاوية الآن تأخذ w-full (100% من عرض max-w-7xl) بشكل كامل وتطابق الأب تماماً */}
      <div className="w-full py-12 max-w-7xl flex flex-row lg:flex-row items-center justify-between gap-4 md:gap-14 px-5 lg:gap-30 overflow-visible  lg:px-20">
        {/* أضفنا space-y-4 أو space-y-6 للشاشات الكبيرة لخلق مسافة رأسية متناسقة بين البكرات */}
        <div className="w-full lg:w-1/2 flex flex-col lg:items-start relative space-y-14 md:space-y-16 lg:space-y-18">
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
            </div>
          ))}
        </div>
        <div className="w-full lg:w-1/2 z-10">
          <h2 className="font-poppins text-primary text-[34px] sm:text-[42px] md:text-[52px] font-semibold leading-tight mb-5">
            Movie Films
          </h2>
          <p className="font-poppins text-black/70 text-[15px] md:text-[17px] leading-relaxed max-w-xl">
            Old reels, new memories. Convert your 8mm, Super 8, and 16mm films
            into high-quality digital videos perfect for reliving every moment.
          </p>
        </div>
      </div>
    </section>
  );
}
