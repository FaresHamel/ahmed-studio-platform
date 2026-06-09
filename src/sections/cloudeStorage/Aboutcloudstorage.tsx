"use client";
import Image from "next/image";
import { useI18n } from "@/src/i18n/context";
import { useState } from "react";

export default function AboutCloudStorage({
  imageUrl = "/images/cloud-storage.jpg"
}: {
  imageUrl?: string;
}) {
  const { t } = useI18n();
  const cs = t.cloudStorage.about;
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="w-full py-8 md:py-12 bg-white pt-10">
      <div className="max-w-7xl mx-auto md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          <div className="relative w-full aspect-video md:aspect-auto md:h-[400px] rounded-xl md:rounded-3xl overflow-hidden shadow-xl">
            <Image
              src={imageUrl}
              alt="Cloud Storage"
              fill
              className="object-cover"
              priority={false}
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-5xl leading-tight font-[500] mb-6 md:mb-8">
              {cs.title}
            </h2>

            <div>
              <p
                className={`text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-wrap ${
                  !isExpanded ? "line-clamp-3 md:line-clamp-none" : ""
                }`}
              >
                {cs.description}
              </p>

              {/* This button only displays on mobile/tablet and hides on desktop where line-clamp is disabled */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-primary text-sm font-semibold underline md:hidden focus:outline-none"
              >
                {isExpanded ? cs.readLess : cs.readMore}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
