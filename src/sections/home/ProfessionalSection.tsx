import Image from "next/image";
import SideByTwoLayout from "@/src/components/layouts/SideByTwoLayout";

export default function ProfessionalSection() {
  return (
    <SideByTwoLayout
      imagePosition="right"
      reverseOnMobile={true}
      gap="medium"
      margin="large"
      leftContent={
        <div className="flex flex-col items-start">
          <h2 className="font-poppins text-primary text-[26px] sm:text-[36px] md:text-5xl lg:text-6xl leading-tight font-[500]">
            We operate at a <br />
            professional archival
          </h2>

          <div className="mt-8 space-y-6 font-poppins text-black text-[16px] md:text-lg leading-relaxed opacity-90">
            <p>
              Grade to guarantee the highest possible quality during digitization.
              Our workflows are designed to capture every single bit of
              information from video, audio, and photographic materials—without
              compression, processing loss, or data reduction.
            </p>
            <p>
              By digitizing content in true RAW / preservation formats, we ensure
              that the digital files remain an authentic and complete
              representation of the original media. This approach avoids
              irreversible data loss and preserves maximum detail, accuracy, and
              integrity.
            </p>
            <p>
              Our main purpose is long-term preservation. All digitization is
              performed in accordance with internationally recognized best
              practices, ensuring your archive remains stable, accessible, and
              future-ready for decades to come.
            </p>
          </div>

          <button className="mt-10 bg-primary text-white px-12 py-4 font-poppins font-[400] rounded-lg hover:bg-primary/90 transition-all shadow-md">
            Read More
          </button>
        </div>
      }
      rightContent={
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px]">
          {/* Left: Compressed */}
          <div className="absolute left-0 top-0 flex-1 overflow-hidden h-full w-1/2">
            <Image
              src="/images/before.jpg"
              alt="Compressed Quality"
              fill
              className="object-cover"
            />
            <div className="absolute top-6 left-6 z-20">
              <span className="text-white font-poppins font-bold text-sm md:text-lg tracking-widest uppercase bg-black/30 px-3 py-1 rounded">
                Compressed
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="absolute left-1/2 w-[1px] h-full bg-white/30 z-30" />

          {/* Right: RAW */}
          <div className="absolute right-0 top-0 flex-1 overflow-hidden h-full w-1/2">
            <Image
              src="/images/after.jpg"
              alt="RAW Quality"
              fill
              className="object-cover"
            />
            <div className="absolute top-6 right-6 z-20">
              <span className="text-white font-poppins font-bold text-sm md:text-lg tracking-widest uppercase bg-black/30 px-3 py-1 rounded">
                RAW
              </span>
            </div>
          </div>
        </div>
      }
    />
  );
}
