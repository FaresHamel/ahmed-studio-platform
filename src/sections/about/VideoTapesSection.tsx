import Image from "next/image";

interface VideoTapeImage {
  id: number;
  src: string;
  alt: string;
}

// قائمة بأسماء ومسارات أشرطة الفيديو الظاهرة في التصميم
const videoTapesData: VideoTapeImage[] = [
  { id: 1, src: "/images/video-betacam.png", alt: "Hi8 Video Tape" },
  { id: 2, src: "/images/video-camcorder.png", alt: "Sony Betacam Tape" },
  { id: 3, src: "/images/video-dvd.png", alt: "MP90 Camcorder Tape" },
  { id: 4, src: "/images/video-minidv.png", alt: "MiniDV Tape" },
  { id: 5, src: "/images/video-other1.png", alt: "Metal HG Video Tape" },
  {
    id: 6,
    src: "/images/video-other2.png",
    alt: "Siemens Compact Video Cassette"
  },
  { id: 7, src: "/images/video-other3.png", alt: "Sony DVCAM 34" },
  {
    id: 8,
    src: "/images/video-other11.png",
    alt: "Vintage Audio Open Reel"
  },
  { id: 9, src: "/images/tape-cassette.png", alt: "U-Matic Tape" },
];

export default function VideoTapesSection() {
  return (
    <section className="w-full bg-white py-6 md:py-14 px-6 md:px-12 lg:px-20 overflow-visible">
      <div className="max-w-7xl mx-auto flex flex-col items-start overflow-visible">
        {/* 1. العنوان الرئيسي العلوي للقسم */}
        <h2 className="font-poppins text-primary text-[32px] sm:text-[40px] lg:text-[48px] font-[600] leading-tight mb-10 md:mb-12">
          Video Tapes
        </h2>

        {/* الحاوية الكبرى التي تنقسم إلى حاويتين (يسار ويمين) */}
        <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-16 overflow-visible">
          {/* 2. الحاوية اليسرى: تحتوي على النص والوصف التفصيلي */}
          <div className="w-full lg:w-[40%] flex flex-col items-start z-10">
            <p className="font-poppins text-black text-[15px] sm:text-[16px] lg:text-[18px] leading-relaxed opacity-85 max-w-xl">
              Our old VHS, MiniDV, Hi8, and camcorder tapes won&apos;t last
              forever but your memories can. We carefully digitize your video
              tapes into high-quality digital files, preserving every moment
              with clarity, safety and care.
            </p>
          </div>

          {/* 3. الحاوية اليمنى: تحتوي على شبكة صور الأشرطة (Responsive Grid) */}
          <div className="w-full lg:w-[60%] overflow-visible">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6 items-center justify-center">
              {videoTapesData.map((tape) => (
                <div
                  key={tape.id}
                  className="relative group flex items-center justify-center bg-transparent transition-transform duration-300 hover:scale-105 drop-shadow-[0_8px_15px_rgba(0,0,0,0.12)]"
                >
                  <Image
                    src={tape.src}
                    alt={tape.alt}
                    width={140}
                    height={95}
                    className="w-full h-auto object-contain"
                    priority
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
