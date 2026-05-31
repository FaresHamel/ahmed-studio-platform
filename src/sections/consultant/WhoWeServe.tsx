"use client";

import Image from "next/image";

interface WhoWeServeItem {
  title: string;
  description: string;
}

interface WhoWeServeProps {
  title?: string;
  items?: WhoWeServeItem[];
  imageUrl?: string;
}

const defaultItems: WhoWeServeItem[] = [
  {
    title: "For Individuals",
    description:
      "Preserving family memories with future-proof formats and storage advice to ensure accessibility for generations."
  },
  {
    title: "For Companies",
    description:
      "Protecting your commercial archive by representing your technical interests and reducing operational risks."
  },
  {
    title: "For Government",
    description:
      "Supporting ministries with preservation policies, national RFPs, and large-scale program supervision."
  }
];

export default function WhoWeServe({
  title = "Who We Serve",
  items = defaultItems,
  imageUrl = "/images/consultImg1.jpg"
}: WhoWeServeProps) {
  return (
    <section className="w-full py-12 md:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Grid Layout: Mobile stacked, Desktop 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="flex flex-col justify-center order-2 lg:order-1">
            <h2 className="text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-5xl leading-tight font-[500] mb-8 md:mb-12">
              {title}
            </h2>

            <div className="space-y-6 md:space-y-8">
              {items.map((item, index) => (
                <div key={index} className="flex flex-col">
                  <h3 className="text-lg md:text-xl font-bold text-black mb-2">
                    <span className="text-primary">
                      {item.title.split(":")[0]}:
                    </span>
                    {item.title.includes(":") ? item.title.split(":")[1] : ""}
                  </h3>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="order-1 lg:order-2">
            <div className="relative w-full aspect-square md:aspect-auto md:h-[500px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={imageUrl}
                alt="Who We Serve"
                fill
                className="object-cover"
                priority={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
