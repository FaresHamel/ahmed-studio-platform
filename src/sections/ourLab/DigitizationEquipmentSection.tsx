import Image from "next/image";

interface EquipmentItem {
  id: number;
  src: string;
  alt: string;
}

// List of eight images data for professional equipment as shown in the design
const equipmentData: EquipmentItem[] = [
  {
    id: 1,
    src: "/images/reel-to-reel-1.png",
    alt: "Professional Audio Reel Machine"
  },
  {
    id: 2,
    src: "/images/film-scanner.png",
    alt: "Vintage Film Multi-Reel Digitizer"
  },
  {
    id: 3,
    src: "/images/rack-mounts.png",
    alt: "Broadcast Tape Deck Racks"
  },
  {
    id: 4,
    src: "/images/studio-audio-deck.png",
    alt: "High-End Audio Restoration Console"
  },
  {
    id: 5,
    src: "/images/vhs-player-monitor.png",
    alt: "CRT Monitor and Tape Deck System"
  },
  {
    id: 6,
    src: "/images/flatbed-editor.png",
    alt: "Horizontal Film Editing Table"
  },
  {
    id: 7,
    src: "/images/audio-turntable.png",
    alt: "Specialized Grooved Disc Player"
  },
  {
    id: 8,
    src: "/images/mixing-board.png",
    alt: "Analog Video Mastering Control Board"
  }
];

export default function DigitizationEquipmentSection() {
  return (
    <section className="w-full bg-white overflow-visible flex flex-col items-center">
      {/* 1. Upper section: Colored background #FFEDDE with titles and texts */}
      <div className="w-full bg-[#FFEDDE] pt-16 pb-24 md:pt-24 md:pb-36 px-6 md:px-12 lg:px-20 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <h2 className="font-poppins text-black text-[28px] sm:text-[34px] md:text-[42px] lg:text-[46px] font-[600] leading-tight mb-6">
            Our Professional Digitization Equipment
          </h2>

          <p className="font-poppins text-black text-[14px] sm:text-[15px] md:text-[16px] leading-relaxed opacity-75 max-w-3xl">
            Our studio is equipped with specialized machines for film, video,
            audio, and photo conversion ensuring accurate playback, high quality
            scanning and reliable long term preservation.
          </p>
        </div>
      </div>

      {/* 2. Bottom section: Grid of images overlapping with the top section (Overlapping Images) */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 w-full overflow-visible">
        {/* Negative margin -mt-16 raises the top row to overlap the white edge and cream background */}
        {/* Fixed grid-cols-4 and adjusted gap to be small on mobile to fit images horizontally on screen */}
        <div className="w-full grid grid-cols-4 gap-2 sm:gap-6 md:gap-8 justify-items-center items-center -mt-16 md:-mt-24 pb-16 md:pb-24 overflow-visible">
          {equipmentData.map((item) => (
            <div
              key={item.id}
              className="w-full aspect-square relative bg-gray-100 rounded-[6px] sm:rounded-[16px] overflow-hidden drop-shadow-[0_4px_10px_rgba(0,0,0,0.12)] md:drop-shadow-[0_12px_24px_rgba(0,0,0,0.14)] transition-all duration-300 hover:scale-[1.03]"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-w-640px) 25vw, 25vw"
                className="object-cover"
                priority={item.id <= 4}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
