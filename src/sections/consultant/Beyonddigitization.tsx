"use client";
import Image from "next/image";

interface BeyondDigitizationProps {
  title?: string;
  mainTitle?: string;
  leftDescription?: string;
  rightQuote?: string;
  imageUrl?: string;
}

export default function BeyondDigitization({
  title = "Beyond Digitization",
  mainTitle = "The Value of Professional Archival Consulting",
  leftDescription = "A Professionally Consulted Project Guarantees That Every Bit Of Information Is Captured, Documented, And Preserved Correctly- Protecting Your Investment And Your Heritage. Be Smart. Invest In Your Project Once. Do It Right From The Beginning. And Ensure Your Archive Remains Accessible, Meaningful, And Preserved For Generations To Come.",
  rightQuote = "A Future-Proof Archive Digitization Is Not Simply About A VTR And Analog-to-Digital Converter. It Is A Complete Ecosystem Of Hardware, Software, Workflows, Standards, And Preservation Strategies.",
  imageUrl = "/images/beyond-digitization.jpg"
}: BeyondDigitizationProps) {
  return (
    <section className="w-full py-12 md:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Title */}
        <h2 className="text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-6xl leading-tight font-[500] text-center mb-12 md:mb-16">
          {title}
        </h2>
        <div className="relative w-full aspect-video md:aspect-auto md:h-[400px] rounded-3xl overflow-hidden shadow-xl my-[100px]">
          <Image
            src={imageUrl}
            alt="Professional Archival Consulting"
            fill
            className="object-cover"
            priority={false}
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Text Overlay */}
          <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-8">
            <h3 className="text-white text-3xl md:text-4xl lg:text-5xl leading-tight font-bold mb-4">
              {mainTitle}
            </h3>
            <p className="text-white/90 text-sm md:text-base leading-relaxed max-w-md">
              Professional oversight ensures that every piece of data is
              captured, documented, and preserved correctly.
            </p>
          </div>
        </div>
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left Image with Overlay Text */}

          {/* Right Content */}
          <div className="flex flex-col justify-center space-y-6">
            {/* Left Description */}
            <div className="border-l-4 border-primary pl-6">
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                {leftDescription}
              </p>
            </div>

            {/* Right Quote */}
            <div className="bg-gray-50 rounded-xl p-6 md:p-8">
              <blockquote className="text-gray-700 text-sm md:text-base leading-relaxed italic">
                "{rightQuote}"
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
