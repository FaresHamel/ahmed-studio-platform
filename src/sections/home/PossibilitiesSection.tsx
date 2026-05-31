import Image from "next/image";
import SideByTwoLayout from "@/src/components/layouts/SideByTwoLayout";

export default function PossibilitiesSection() {
  return (
    <SideByTwoLayout
      imagePosition="left"
      gap="medium"
      margin="medium"
      leftContent={
        <div className="relative aspect-square w-full overflow-hidden rounded-[20px]">
          <Image
            src="/images/PossibilitiesImg.jpg"
            alt="The Possibilities Are Endless"
            fill
            className="object-cover"
          />
        </div>
      }
      rightContent={
        <div className="flex flex-col items-start">
          <h2 className="text-primary text-[28px] sm:text-[38px] md:text-5xl lg:text-6xl leading-tight font-[500]">
            The Possibilities <br />
            Are Endless
          </h2>

          <div className="mt-8 space-y-6 text-black text-[16px] md:text-lg leading-relaxed opacity-90">
            <p>
              When the moment calls for memories, open iMemories Cloud to
              effortlessly experience your family's digital library on your Apple
              TV, at any time.
            </p>
            <p>
              After we digitize your movies and photos, you can stream hours of
              home-made content directly from your TV, laptop, tablet or
              smartphone. We call it foreverizing—because only iMemories lets you
              relive your entire family history on demand.
            </p>
          </div>

          <button className="mt-10 bg-primary text-white px-12 py-4 font-[400] rounded-lg hover:bg-primary/90 transition-all shadow-md">
            Read More
          </button>
        </div>
      }
    />
  );
}
