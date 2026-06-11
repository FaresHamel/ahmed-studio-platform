"use client";
import Image from "next/image";
import { useI18n } from "@/src/i18n/context";
import Link from "next/link";

const colSpans = ["lg:col-span-3", "lg:col-span-3", "lg:col-span-2", "lg:col-span-2", "lg:col-span-2"];
//const imgs = ["/images/camera.jpg", "/images/familly.png", "/images/familly02.png", "/images/videoTool.jpg", "/images/map.jpg"];

export default function EnhancementSection() {
  const { t } = useI18n();
  //const items = t.home.enhancement.items.map((item, i) => ({ ...item, img: imgs[i], colSpan: colSpans[i] }));
  return (
    <section className="py-10 px-4">
      <div className="text-center mb-10 md:mb-16">
        <h2 className="text-primary text-[26px] md:text-[40px] font-[500] capitalize">
          {t.home.enhancement.title}
        </h2>
      </div>
      <div className="relative w-full h-[60vh] md:h-[90vh] overflow-hidden rounded-[10px] md:rounded-[10px] shadow-md border border-stone-800/50">
        {/* Loop Video Background */}
        <video
          src="/video/enhancement.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        {/* Smooth dark gradient at the bottom to make the text pop */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />
        <div className="absolute inset-0 z-20 flex flex-col justify-end items-center text-center p-6 md:p-12 pb-12 md:pb-20">
          <Link
            href="/enhancement"
            className="inline-flex items-center justify-center bg-white text-black font-medium text-xs md:text-base px-5 py-2 md:px-8 md:py-3.5 rounded-full hover:bg-stone-200 transition-colors duration-300 shadow-lg cursor-pointer"
          >
            {t.home.supportFormats.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
