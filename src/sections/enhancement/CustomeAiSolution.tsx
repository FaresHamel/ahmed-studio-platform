import Image from "next/image";

export default function CustomeAiSolution() {
  return (
    <div className="my-[100px] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      <div className="flex flex-col items-start text-left">
        <h2
          className="
            font-poppins
            text-primary
            text-[18px]
            sm:text-[28px]
            md:text-5xl
            lg:text-6xl
            leading-tight
            font-[500]
        "
        >
          McKenzie™ is <br />a custom AI solution{" "}
        </h2>
        <div className="mt-8 space-y-6 font-poppins text-black text-[15px] md:text-[16px] leading-relaxed">
          <p className="opacity-80">
            designed to enhance specific memories by understanding the unique
            properties of various formats, such as: VHS tapes, Super 8 films
          </p>
          <p className="text-gray-700">
            <strong className="text-black font-[700] block sm:inline">
              Quality & Clarity :
            </strong>{" "}
            <span className="opacity-80">
              Enhanced quality, sharper detail, and crisper video clarity.
            </span>
          </p>
          <p className="text-gray-700">
            <strong className="text-black font-[700] block sm:inline">
              Color & Light :
            </strong>{" "}
            <span className="opacity-80">
              Better color accuracy, more vibrant colors, and cleaner visuals in
              low-light conditions.
            </span>
          </p>
          <p className="text-gray-700">
            <strong className="text-black font-[700] block sm:inline">
              Motion & Detail :
            </strong>{" "}
            <span className="opacity-80">
              Smoother playback, reduced motion blur from camera movement, and
              refined facial details.
            </span>
          </p>
        </div>
      </div>
      <div className="relative aspect-square w-full overflow-hidden rounded-[20px]">
        <Image
          src="/images/customAiSoltion.png"
          alt="The Possibilities Are Endless"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
