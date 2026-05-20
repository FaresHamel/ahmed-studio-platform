"use client";

import Image from "next/image";

interface MediaSection {
  title: string;
  description: string;
  imageUrl?: string;
  imagePosition?: "left" | "right";
  backgroundColor?: string;
  items?: Array<{
    label?: string;
    imageUrl: string;
  }>;
  itemsLayout?: "vertical" | "horizontal" | "grid";
}

interface MediaTypesProps {
  aboutTitle?: string;
  aboutDescription?: string;
  sections?: MediaSection[];
}

const defaultSections: MediaSection[] = [
  {
    title: "Movie Films",
    description:
      "Old reels, new memories. Convert your 8mm, Super 8, and 16mm films into high-quality digital videos perfect for reliving every moment.",
    imagePosition: "right",
    backgroundColor: "#DFBFA4",
    items: [
      { label: "35mm", imageUrl: "/images/film-35mm.png" },
      { label: "16mm", imageUrl: "/images/film-16mm.png" },
      { label: "8mm", imageUrl: "/images/film-8mm.png" }
    ],
    itemsLayout: "vertical"
  },
  {
    title: "Audio Tapes",
    description:
      "Don't let your precious audio memories fade away. We convert your old cassette and reel-to-reel tapes into high-quality digital files, preserving every note, word, and sound for years to come.",
    imagePosition: "left",
    backgroundColor: "#F7F1EC",
    items: [
      { imageUrl: "/images/tape-cassette.png" },
      { imageUrl: "/images/tape-reel.png" },
      { imageUrl: "/images/tape-vinyl.png" }
    ],
    itemsLayout: "vertical"
  },
  {
    title: "Video Tapes",
    description:
      "Our old VHS, MiniDV, Hi8, and camcorder tapes won't last forever but your memories can. We carefully digitize your video tapes into high-quality digital files, preserving every moment with clarity, safety and care.",
    imagePosition: "left",
    backgroundColor: "#F7F1EC",
    items: [
      { imageUrl: "/images/video-vhs.png" },
      { imageUrl: "/images/video-minidv.png" },
      { imageUrl: "/images/video-hi8.png" },
      { imageUrl: "/images/video-camcorder.png" },
      { imageUrl: "/images/video-betacam.png" },
      { imageUrl: "/images/video-dvd.png" },
      { imageUrl: "/images/video-other11.png" },
      { imageUrl: "/images/video-other2.png" },
      { imageUrl: "/images/video-other3.png" }
    ],
    itemsLayout: "grid"
  },
  {
    title: "Photos Slides",
    description:
      "No projector? No problem. We convert your old photo slides into modern digital images, making it easy to enjoy your favorite moments on any device.",
    imagePosition: "right",
    backgroundColor: "#F7F1EC",
    items: [
      { imageUrl: "/images/slides-stack.png" },
      { imageUrl: "/images/slides-preview.png" },
      { imageUrl: "/images/slides-negative.png" }
    ],
    itemsLayout: "vertical"
  }
];

export default function MediaTypes({
  aboutTitle = "About Us",
  aboutDescription = "We work to fully support digital transformation by leveraging technology to develop advanced archival solutions, digitize audiovisual materials, and transform traditional libraries into accessible digital libraries available at any time, in accordance with international preservation and archiving standards. We also provide professional restoration and enhancement services for images, videos, and audio recordings, in addition to solutions that accelerate digital transformation for our clients. Furthermore, we deliver effective solutions for the preservation, organization, and storage of archives, enabling secure, structured, and easy access to digital content—anytime and anywhere.",
  sections = defaultSections
}: MediaTypesProps) {
  return (
    <section className="w-full bg-white">
      {/* ABOUT US SECTION */}
      <div className="py-12 md:py-20 lg:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black text-center mb-8 md:mb-12">
            {aboutTitle}
          </h2>
          <p className="text-gray-700 text-sm md:text-base leading-relaxed text-center">
            {aboutDescription}
          </p>
        </div>
      </div>
    </section>
  );
}
