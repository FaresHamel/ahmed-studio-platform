import Image from "next/image";
import SideByTwoLayout from "@/src/components/layouts/SideByTwoLayout";

export default function AboutSection() {
  return (
    <SideByTwoLayout
      imagePosition="left"
      gap="medium"
      margin="medium"
      leftContent={
        <div className="relative aspect-square w-full overflow-hidden rounded-[20px]">
          <Image
            src="/images/aboutImagePre.jpg"
            alt="VHS Digitization"
            fill
            className="object-cover"
          />
        </div>
      }
      rightContent={
        <div className="flex flex-col items-start">
          <h2 className="text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-6xl leading-tight font-[500]">
            One of the <br />
            region&apos;s most
          </h2>

          <p className="mt-6 md:mt-8 text-black text-[13px] sm:text-[15px] md:text-lg leading-relaxed">
            Trusted names in audiovisual digitization, preservation, and archival
            consulting in Saudi Arabia. We provide advanced, standards-driven
            solutions for converting and safeguarding legacy media, ensuring
            long-term preservation with the highest levels of quality, accuracy,
            and security. With years of experience and collaboration with leading
            local and international experts, we deliver workflows that meet global
            archival standards.
          </p>

          <button className="mt-8 md:mt-10 bg-primary text-white px-8 md:px-12 py-3 md:py-4 font-[500] text-[14px] md:text-base rounded-lg hover:bg-primary/90 transition-all">
            Read More
          </button>
        </div>
      }
    />
  );
}
