import Image from "next/image";

export default function StorySection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      {/* Left side: Image (Left Side: Image) */}
      <div className="relative aspect-square w-full overflow-hidden rounded-[20px]">
        <Image
          src="/images/storySection.png" // Make sure the image path matches in the public folder
          alt="The Possibilities Are Endless"
          fill
          className="object-cover"
        />
      </div>

      {/* Right side: Content (Right Side: Content) */}
      <div className="flex flex-col items-start text-left">
        {/* Main title - applied with the same luxurious settings */}
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
          Yesterday’s tools <br />
          captured your stories
        </h2>

        {/* Text container - general opacity reduced and lines and dots adjusted precisely based on design */}
        <div className="mt-8 space-y-6 font-poppins text-black text-[15px] md:text-[16px] leading-relaxed">
          {/* First normal descriptive paragraph */}
          <p className="opacity-80">
            McKenzie AI brings them to life. As the most innovative solution in
            memory preservation, McKenzie resolves the limitations of
            decades-old technology to show you every detail as it really
            happened.
          </p>

          {/* First point: 3X Visual Clarity */}
          <p className="text-gray-700">
            <strong className="text-black font-[700] block sm:inline">
              3X Visual Clarity:
            </strong>{" "}
            <span className="opacity-80">
              Get up to three times the visual clarity compared to the original
              video or photo.
            </span>
          </p>

          {/* Second point: Custom Training */}
          <p className="text-gray-700">
            <strong className="text-black font-[700] block sm:inline">
              Custom Training:
            </strong>{" "}
            <span className="opacity-80">
              The first truly custom AI solution trained to enhance specific
              formats from VHS tapes to Super 8 films
            </span>
          </p>

          {/* Third point: Intelligent Assessment */}
          <p className="text-gray-700">
            <strong className="text-black font-[700] block sm:inline">
              Intelligent Assessment:
            </strong>{" "}
            <span className="opacity-80">
              Instantly assesses where to add sharpness and remove imperfections
              while preserving a natural look.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
