"use client";

import Image from "next/image";
import { Icon } from "@iconify/react";

interface Risk {
  icon: string;
  title: string;
  description: string;
}

interface WhatCanGoWrongProps {
  topTitle?: string;
  topSubtitle?: string;
  topDescription?: string;
  topImage?: string;
  mainTitle?: string;
  risks?: Risk[];
  consequenceText?: string;
  onCTAClick?: () => void;
}

const defaultRisks: Risk[] = [
  {
    icon: "mdi:alert-circle",
    title: "Low Quality Outputs",
    description:
      "Incorrect digitization workflows or consumer-grade processes result in outputs that fail to meet archival standards."
  },
  {
    icon: "mdi:cpu",
    title: "Wrong Hardware Selection",
    description:
      "Directly impacts signal accuracy, color integrity, and audio fidelity of your preserved media."
  },
  {
    icon: "mdi:code-braces",
    title: "Non Recommend Software",
    description:
      "Results in improper processing and permanent loss of original detail from your source materials."
  },
  {
    icon: "mdi:file-video",
    title: "Incorrect Codecs, Container",
    description:
      "Produces files that are compressed, unstable, or unsuitable for long-term preservation."
  },
  {
    icon: "mdi:camera-capture",
    title: "Inaccurate Capture Methods",
    description:
      "Fails to preserve all the original data (bits) from the source media, losing critical information."
  },
  {
    icon: "mdi:check-all",
    title: "Irreversible Quality Loss",
    description:
      "Once detail is lost during digitization, it can never be recovered—the damage is permanent."
  }
];

export default function WhatCanGoWrong({
  topTitle = "What Happens Without a Consultant?",
  topImage = "/images/consultantImg4.jpg",
  mainTitle = "What Can Go Wrong Without Expert Guidance",
  risks = defaultRisks,
  consequenceText = "The Consequence",
  onCTAClick
}: WhatCanGoWrongProps) {
  return (
    <section className="w-full py-12 md:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Top Section: Title with Background Image */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-6xl leading-tight font-[500] text-center mb-4">
           { topTitle}
          </h2>
        </div>
        <div className="mb-16 md:mb-24">
          <div className="relative w-full aspect-video md:aspect-auto md:h-[400px] rounded-2xl overflow-hidden shadow-xl mb-8">
            <Image
              src={topImage}
              alt="Risks of Unguided Digitization"
              fill
              className="object-cover"
              priority={false}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Text Overlay */}
            <div className="absolute inset-0 flex flex-col items-start justify-center p-6 md:p-12">
              <h2 className="text-white text-[28px] sm:text-4xl md:text-5xl lg:text-6xl leading-tight font-[500] max-w-2xl">
                The <span className="text-red-500">Risks</span> of{" "}
                <br className="hidden sm:block" />
                Unguided Digitization
              </h2>
              <p className="text-white text-sm md:text-base mt-4 max-w-xl leading-relaxed">
                Poor hardware and software choices lead to compromised signal
                integrity and lost original detail.
              </p>
            </div>
          </div>
        </div>

        {/* Main Risks Section */}
        <div className="mb-12 md:mb-16">
          <h3 className="text-2xl md:text-4xl font-bold text-black mb-12">
            {mainTitle}
          </h3>

          {/* Risks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {risks.map((risk, index) => (
              <RiskCard key={index} risk={risk} />
            ))}
          </div>
        </div>

        {/* Consequence Section */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6 md:p-8">
          <div className="flex gap-4 items-start">
            <Icon
              icon="mdi:alert-outline"
              width="28"
              height="28"
              className="text-amber-600 flex-shrink-0 mt-1"
            />
            <div>
              <h4 className="font-bold text-amber-900 text-lg md:text-xl mb-3">
                {consequenceText}
              </h4>
              <p className="text-amber-800 text-sm md:text-base leading-relaxed">
                In many cases, these mistakes lead to project failure, forcing
                organizations to re-digitize the entire archive, increasing
                cost, time, and risk—if the original media is still playable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface RiskCardProps {
  risk: Risk;
}

function RiskCard({ risk }: RiskCardProps) {
  return (
    <div className="flex gap-4 md:gap-6">
      {/* Icon */}
      <div className="flex-shrink-0">
        <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-lg flex items-center justify-center">
          <Icon
            icon={risk.icon}
            width="24"
            height="24"
            className="text-primary"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <h4 className="text-base md:text-lg font-bold text-black mb-2">
          {risk.title}
        </h4>
        <p className="text-gray-700 text-sm md:text-base leading-relaxed">
          {risk.description}
        </p>
      </div>
    </div>
  );
}
