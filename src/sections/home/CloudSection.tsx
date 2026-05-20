import Image from "next/image";

export default function CloudSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      {/* Left side: Image (Left Side: Image) */}
      <div className="relative aspect-square w-full overflow-hidden rounded-[10px]">
        <Image
          src="/images/setUpDesktop.jpg" // Make sure to add the app image here
          alt="From your attic to our app"
          fill
          className="object-cover"
        />
      </div>

      {/* Right side: Content (Right Side: Content) */}
      <div className="flex flex-col items-start">
        {/* Title - Playfair font and Primary color */}
        <h2
          className="
  font-poppins
  text-primary
  text-[26px]
  sm:text-[36px]
  md:text-5xl
  lg:text-6xl
  leading-tight
  font-[500]
  capitalize
"
        >
          From your <br />
          attic to our app
        </h2>

        {/* Description - Poppins font and black color */}
        <p className="mt-8 font-poppins text-black text-[400] text-[16px]  leading-relaxed opacity-90">
          Immerse yourself in the world of your memories from any screen, at any
          time. The AS Cloud makes it easy to stream and share thousands of
          moments from our app across your TV, tablet, laptop, phone and more.
          we provide you a FREE Cloud Hosting for 10days! an amazing cloud
          hosting service for your home movies with many features. u can access
          memories any where, any time
        </p>

        {/* Button - with Primary background and white text */}
        <button className="mt-10 bg-primary text-white px-12 py-4 font-poppins font-bold rounded-lg hover:bg-primary/90 transition-all shadow-md">
          Find Out More
        </button>
      </div>
    </div>
  );
}
