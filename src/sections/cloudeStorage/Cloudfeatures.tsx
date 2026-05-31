"use client";
import Image from "next/image";

interface Feature {
  title: string;
  description: string;
  imageUrl: string;
}

interface CloudFeaturesProps {
  title?: string;
  features?: Feature[];
}

const defaultFeatures: Feature[] = [
  {
    title: "Customise Your Gallery",
    description:
      "Add titles and descriptions and chapter markers to each video. Sort and organise to get them in the perfect order. Make the thumbnail images bigger or smaller as you prefer or in the new list view.",
    imageUrl: "/images/feature-1.jpg"
  },
  {
    title: "Manage Your Sharing",
    description:
      "Create up to 4 additional users who can access your gallery. You remain in complete control, deciding which videos can be viewed by each user.",
    imageUrl: "/images/feature-2.jpg"
  },
  {
    title: "AI Indexing And Video Search",
    description:
      "Our Artificial Intelligence analyzes and indexes your video library, letting you search for speech, text, objects, actions and sounds. Search inside your videos and find the moment you are looking for with our unique in-video search.",
    imageUrl: "/images/feature-3.jpg"
  },
  {
    title: "Watch Anywhere, Anytime",
    description:
      "We have built some simple to use Apps for Alive Cloud has a free download for phone, tablet or TV. We also support Chromecast and Airplay for pushing your movies to your Smart TV.",
    imageUrl: "/images/feature-4.jpg"
  }
];

export default function CloudFeatures({
  title = "Cloud Features",
  features = defaultFeatures
}: CloudFeaturesProps) {
  return (
    <section className="w-full py-12 md:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Title */}
        <h2 className="text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-6xl leading-tight font-[500] text-center mb-12 md:mb-16">
          {title}
        </h2>

        {/* Features Grid - 2x2 on desktop, 1 column on mobile, responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  feature: Feature;
}

function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Image */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg mb-6">
        <Image
          src={feature.imageUrl}
          alt={feature.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
          priority={false}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-xl md:text-2xl font-bold text-black mb-4">
          {feature.title}
        </h3>
        <p className="text-gray-700 text-sm md:text-base leading-relaxed">
          {feature.description}
        </p>
      </div>
    </div>
  );
}
