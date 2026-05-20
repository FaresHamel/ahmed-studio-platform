"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

const services = [
  {
    category: "VIDEO",
    title: "Video Digitization",
    image: "/images/video-service.jpg",
    description:
      "Archival grade digitization of video tapes including VHS, Betacam, U-matic, and MiniDV...",
    points: [
      "RAW master file/High quality video",
      "Signal processing",
      "Metadata creation"
    ]
  },
  {
    category: "CONSULT",
    title: "Consulting",
    image: "/images/consult-service.jpg",
    description:
      "Help organizations, institutions, and individuals plan, execute, and supervise projects according to international best practices.",
    points: [
      "End-to-end workflow design",
      "RFP preparation & technical documentation",
      "Hardware & software selection",
      "Quality control & project supervision"
    ]
  },
  {
    category: "IMAGE",
    title: "Slides / Negative / Photo Scanning",
    image: "/images/image-service.jpg",
    description:
      "We scan every available detail to preserve color, contrast, and original image integrity for long-term preservation.",
    points: [
      "High-resolution",
      "Dust & defect reduction",
      "Accurate color reproduction & tonal balance",
      "Archival formats suitable for future access"
    ]
  }
];

export default function CoreServicesSection() {
  return (
    <div className="flex flex-col items-center  my-[100px]">
      {/* 1. Header Section */}
      <div className="text-center mb-16">
        <h2
          className="
                      font-poppins
                      text-primary
                      text-[26px]
                      sm:text-[32px]
                      md:text-5xl
                      font-bold
                      mb-3 md:mb-4
                    "
        >
          Core Services
        </h2>

        <p
          className="
          font-poppins
          text-black
          text-[13px]
          sm:text-[15px]
          md:text-lg
          opacity-80
          leading-relaxed
         "
        >
          Comprehensive solutions for every format in your collection.
        </p>
      </div>

      {/* 2. Services Grid (3 Parts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full mb-16">
        {services.map((service, index) => (
          <div
            key={index}
            className="border border-zinc-100 rounded-[20px] p-6 flex flex-col bg-white hover:shadow-xl transition-shadow duration-300"
          >
            {/* Category Tag inside background div */}
            <div className="inline-block self-start mb-4">
              <span
                className={`text-xs font-[500] px-4 py-1 rounded-md tracking-widest ${
                  index === 0
                    ? "bg-primary text-white"
                    : "bg-primary/20 text-primary"
                }`}
              >
                {service.category}
              </span>
            </div>

            {/* Big Image with Border Radius 10 */}
            <div className="relative w-full h-94 mb-6  overflow-hidden rounded-[10px]">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Title with Secondary Font (Playfair) */}
            <h3 className="font-playfair text-black text-[16px] font-bold mb-4">
              {service.title}
            </h3>

            {/* Small Description */}
            <p className="font-poppins text-[12px] text-black text-sm leading-relaxed mb-6 opacity-70">
              {service.description}
            </p>

            {/* Explained Points */}
            <ul className="space-y-2 mb-8 flex-grow">
              {service.points.map((point, i) => (
                <li
                  key={i}
                  className="flex items-start text-[12px] gap-2 text-sm text-black/80 font-poppins"
                >
                  <span className="text-primary mt-1.5">•</span>
                  {point}
                </li>
              ))}
            </ul>

            {/* Learn More + Icon */}
            <button className="flex items-center gap-2 text-primary font-[500] text-sm group">
              LEARN MORE
              <Icon
                icon="heroicons:arrow-right-20-solid"
                className="text-lg transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>
        ))}
      </div>

      {/* 3. View All Services Button */}
      <Link
        href="/services"
        className="bg-primary text-white px-12 py-4 font-poppins font-[500] rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
      >
        View All Services
      </Link>
    </div>
  );
}
