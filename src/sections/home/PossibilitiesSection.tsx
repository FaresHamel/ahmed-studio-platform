import Image from "next/image";

export default function PossibilitiesSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      {/* Left side: Image (Left Side: Image) */}
      <div className="relative aspect-square w-full overflow-hidden rounded-[20px]">
        <Image
          src="/images/PossibilitiesImg.jpg" // Make sure the image path matches in the public folder
          alt="The Possibilities Are Endless"
          fill
          className="object-cover"
        />
      </div>

      {/* Right side: Content (Right Side: Content) */}
      <div className="flex flex-col items-start">
        {/* Title - Playfair font and Primary color divided into two lines */}
        <h2
          className="
          font-poppins
          text-primary
          text-[28px]
          sm:text-[38px]
          md:text-5xl
          lg:text-6xl
          leading-tight
          font-[500]
        "
        >
          The Possibilities <br />
          Are Endless
        </h2>

        {/* Description - Poppins font and black color with spaces between paragraphs */}
        <div className="mt-8 space-y-6 font-poppins text-black text-[16px] md:text-lg leading-relaxed opacity-90">
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

        {/* Unified button for the project */}
        <button className="mt-10 bg-primary text-white px-12 py-4 font-poppins font-[400] rounded-lg hover:bg-primary/90 transition-all shadow-md">
          Read More
        </button>
      </div>
    </div>
  );
}
