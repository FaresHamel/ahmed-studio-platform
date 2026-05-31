"use client";

import Image from "next/image";

interface ArchivePoint {
  label: string;
  description: string;
}

interface FutureProofArchiveProps {
  title?: string;
  subtitle?: string;
  mainDescription?: string;
  points?: ArchivePoint[];
  imageUrl?: string;
}

const defaultPoints: ArchivePoint[] = [
  {
    label: "Technology",
    description: "The right technologies are selected"
  },
  {
    label: "Workflow",
    description: "The correct workflows are applied."
  },
  {
    label: "Outputs",
    description: "The final outputs meet international best practices"
  },
  {
    label: "Preservation",
    description:
      "Long-term preservation is achieved, not just short-term delivery"
  }
];

export default function FutureProofArchive({
  title = "A Future-Proof Archive",
  subtitle = "Ensuring Your Archive Stands the Test of Time",
  mainDescription = "We do not just deliver files—we help you build a future-proof archive. Start with a Consultation Whether you are planning a new project, correcting an existing one, or preparing a large-scale national initiative, our consulting team is ready to support you. Contact us today to schedule a consultation and protect your archive the right way.",
  points = defaultPoints,
  imageUrl = "/images/consultantImg02.jpg"
}: FutureProofArchiveProps) {
  return (
    <section className="w-full py-12 md:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Grid Layout: Mobile stacked, Desktop 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
          {/* Left Image */}
          <div className="relative w-full aspect-square md:aspect-auto md:h-[500px] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src={imageUrl}
              alt="Future Proof Archive"
              fill
              className="object-cover"
              priority={false}
            />
          </div>

          {/* Right Content */}
          <div className="flex flex-col justify-start">
            <h2 className="text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-5xl leading-tight font-[500] mb-6 md:mb-8">
              {title}
            </h2>

            {subtitle && (
              <p className="text-gray-600 text-sm md:text-base mb-6">
                {subtitle}
              </p>
            )}

            <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-8">
              {mainDescription}
            </p>

            {/* Points List */}
            <div className="space-y-4 md:space-y-5">
              {points.map((point, index) => (
                <div key={index} className="flex gap-3 md:gap-4">
                  <div className="flex-shrink-0">
                    <div className="text-xs md:text-sm w-6 h-6 md:w-7 md:h-7 rounded-full bg-primary text-white font-[400] flex items-center justify-center text-lg">
                      {index + 1}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-black text-sm md:text-base mb-1">
                      {point.label}:
                    </h3>
                    <p className="text-gray-700 text-sm md:text-base">
                      {point.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
