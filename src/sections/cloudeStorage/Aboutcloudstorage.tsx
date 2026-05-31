"use client";

import Image from "next/image";

interface AboutCloudStorageProps {
  title?: string;
  description?: string;
  imageUrl?: string;
}

export default function AboutCloudStorage({
  title = "About Cloud Storage",
  description = "Imagine if we took all your old home movies, cine film, video and camcorder tapes, and remastered them into HD and even 4K films. Now imagine you can access and share these amazing memories from your Computer, iPad, iPhone, Smart TV.. Anytime, Anywhere! Videos uploaded to Ahmed Studio Cloud are available to watch in stunning HD. Get ready for a game-changing experience with our cutting-edge AI technology! Say goodbye to hours of endless scrolling through your home movies to find that special moment. The AI bot in the Ahmed Studio Cloud automatically labels and organizes every detail of your videos, from people and objects to text, actions, and sounds. With just a click, you can easily search and access every memory. Relive your favorite moments like never before. It's time to experience your home movies in style!",
  imageUrl = "/images/cloud-storage.jpg"
}: AboutCloudStorageProps) {
  return (
    <section className="w-full py-12 md:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Grid Layout: Image top, text below on mobile; side by side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative w-full aspect-video md:aspect-auto md:h-[400px] rounded-3xl overflow-hidden shadow-xl">
            <Image
              src={imageUrl}
              alt="Cloud Storage"
              fill
              className="object-cover"
              priority={false}
            />
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center">
            <h2 className="text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-5xl leading-tight font-[500] mb-6 md:mb-8">
              {title}
            </h2>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
