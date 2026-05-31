"use client";

import Image from "next/image";

interface AfterSection {
  title: string;
  description: string;
  features?: Array<{
    label: string;
    text: string;
  }>;
  imageUrl: string;
  imagePosition?: "left" | "right";
}

interface AfterDigitizationProps {
  sections?: AfterSection[];
}

const defaultSections: AfterSection[] = [
  {
    title: "Once your films are digitized",
    description:
      "The magic begins. AS Cloud creates a stunning, private online gallery for your entire collection. No more digging through boxes or finding old players—just instant access to your most precious moments.",
    features: [
      {
        label: "Smart TV",
        text: "Watch on the big screen with our dedicated app."
      },
      {
        label: "Mobile & Tablet",
        text: "Carry your memories in your pocket."
      },
      {
        label: "Computer",
        text: "High-definition streaming on any browser."
      },
      {
        label: "Secure Storage",
        text: "Your original files are protected in our encrypted cloud."
      }
    ],
    imageUrl: "/images/streamlined-journey.jpg",
    imagePosition: "left"
  },
  {
    title: "Memories are better when shared",
    description:
      "Every subscription includes 4 Free Guest Accounts, allowing you to invite loved ones across the globe to view, comment, and enjoy your family movies at no extra cost.",
    features: [
      {
        label: "4 Free Guests",
        text: "Invite family to join the fun for free."
      },
      {
        label: "Worldwide Access",
        text: "Share memories with anyone, anywhere."
      },
      {
        label: "Private & Secure",
        text: "You control exactly who can watch."
      }
    ],
    imageUrl: "/images/cta-image.jpg",
    imagePosition: "right"
  }
];

export default function AfterDigitization({
  sections = defaultSections
}: AfterDigitizationProps) {
  return (
    <section className="w-full py-12 md:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Render each section */}
        {sections.map((section, index) => (
          <div
            key={index}
            className={`mb-16 md:mb-24 lg:mb-32 ${
              index > 0
                ? "pt-16 md:pt-24 lg:pt-32 border-t border-gray-200"
                : ""
            }`}
          >
            {/* Grid with alternating layout */}
            <div
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center ${
                section.imagePosition === "right" ? "lg:auto-cols-fr" : ""
              }`}
            >
              {/* Image - Left or Right based on position */}
              <div
                className={`relative w-full aspect-square md:aspect-auto md:h-[400px] rounded-2xl overflow-hidden shadow-xl ${
                  section.imagePosition === "right"
                    ? "lg:order-2"
                    : "lg:order-1"
                }`}
              >
                <Image
                  src={section.imageUrl}
                  alt={section.title}
                  fill
                  className="object-cover"
                  priority={false}
                />
              </div>

              {/* Content - Right or Left based on position */}
              <div
                className={`flex flex-col justify-center ${
                  section.imagePosition === "right"
                    ? "lg:order-1"
                    : "lg:order-2"
                }`}
              >
                <h2 className="text-primary text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight font-bold mb-6 md:mb-8">
                  {section.title}
                </h2>

                <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-8 md:mb-10">
                  {section.description}
                </p>

                {/* Features List */}
                {section.features && (
                  <div className="space-y-4">
                    {section.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex gap-3 md:gap-4">
                        <span className="text-primary font-bold text-lg flex-shrink-0">
                          •
                        </span>
                        <div>
                          <span className="font-bold text-black text-sm md:text-base">
                            {feature.label}:
                          </span>
                          <span className="text-gray-700 text-sm md:text-base ml-1">
                            {feature.text}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
