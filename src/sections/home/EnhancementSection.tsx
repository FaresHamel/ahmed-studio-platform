"use client";
import Image from "next/image";
import { useI18n } from "@/src/i18n/context";

const colSpans = ["lg:col-span-3", "lg:col-span-3", "lg:col-span-2", "lg:col-span-2", "lg:col-span-2"];
const imgs = ["/images/camera.jpg", "/images/familly.png", "/images/familly02.png", "/images/videoTool.jpg", "/images/map.jpg"];

export default function EnhancementSection() {
  const { t } = useI18n();
  const items = t.home.enhancement.items.map((item, i) => ({ ...item, img: imgs[i], colSpan: colSpans[i] }));
  return (
    <section className="py-10 px-4">
      <div className="text-center mb-10 md:mb-16">
        <h2 className="text-primary text-[26px] md:text-[40px] font-[500] capitalize">
          {t.home.enhancement.title}
        </h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 md:gap-6">
        {items.map((item, index) => (
          <div key={index} className={`relative group overflow-hidden rounded-[16px] md:rounded-[20px] aspect-[4/3] ${item.colSpan}`}>
            <Image src={item.img} alt={item.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-3 md:p-8 text-center">
              <h3 className="text-white text-[14px] md:text-[20px] font-semibold mb-1 md:mb-2">{item.title}</h3>
              <p className="hidden md:block text-white/90 text-[12px] leading-tight max-w-[80%] mx-auto">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
