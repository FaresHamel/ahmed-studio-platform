"use client";
import Image from "next/image";
import { useI18n } from "@/src/i18n/context";

export default function StorySection() {
  const { t } = useI18n();
  const story = t.enhancement.story;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      <div className="relative aspect-square w-full overflow-hidden rounded-[20px]">
        <Image src="/images/storySection.png" alt="The Possibilities Are Endless" fill className="object-cover" />
      </div>
      <div className="flex flex-col items-start text-left">
        <h2 className="text-primary text-[28px] sm:text-[38px] md:text-5xl lg:text-6xl leading-tight font-[500]">
          {story.title}
        </h2>
        <div className="mt-8 space-y-6 text-black text-[15px] md:text-[16px] leading-relaxed">
          <p className="opacity-80">{story.description}</p>
          {story.items.map((item, i) => (
            <p key={i} className="text-gray-700">
              <strong className="text-black font-[700] block sm:inline">{item.title}: </strong>
              <span className="opacity-80">{item.desc}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
