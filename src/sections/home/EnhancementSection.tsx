import Image from "next/image";
import { CardItem } from "@/src/components/sections/CardGrid";

interface EnhancementItem extends CardItem {
  id: number;
  title: string;
  desc: string;
  img: string;
  colSpan?: string;
}

const items: EnhancementItem[] = [
  {
    id: 1,
    title: "Spectacular AI Enhancement",
    desc: "Transform blurry, aged footage into crisp, high-definition memories using our advanced AI-driven upscaling technology.",
    img: "/images/camera.jpg",
    colSpan: "lg:col-span-3"
  },
  {
    id: 2,
    title: "Pro-Grade Accuracy",
    desc: "By capturing materials in true RAW form, we guarantee an uncompressed representation of your original content.",
    img: "/images/familly.png",
    colSpan: "lg:col-span-3"
  },
  {
    id: 3,
    title: "Pure Archival Sound",
    desc: "We ensure every bit of information in a photo or video",
    img: "/images/familly02.png",
    colSpan: "lg:col-span-2"
  },
  {
    id: 4,
    title: "35mm Precision",
    desc: "Specialized restoration for 35mm film on shelves",
    img: "/images/videoTool.jpg",
    colSpan: "lg:col-span-2"
  },
  {
    id: 5,
    title: "Global Best Practices",
    desc: "We avoid costly mistakes by using the right equipment and strategy.",
    img: "/images/map.jpg",
    colSpan: "lg:col-span-2"
  }
];

export default function EnhancementSection() {
  const renderEnhancementItem = (item: EnhancementItem,index:number) => (
    <div
      key={index.toString()}
      className={`relative group overflow-hidden rounded-[16px] md:rounded-[20px] aspect-[4/3] ${item.colSpan || ""}`}>
      <Image
        src={item.img}
        alt={item.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-3 md:p-8 text-center">
        <h3 className="font-poppins text-white text-[14px] md:text-[20px] font-semibold mb-1 md:mb-2">
          {item.title}
        </h3>

        <p className="hidden md:block font-poppins text-white/90 text-[12px] leading-tight max-w-[80%] mx-auto">
          {item.desc}
        </p>
      </div>
    </div>
  );

  return (
    <section className="py-10 px-4">
      <div className="text-center mb-10 md:mb-16">
        <h2 className="font-poppins text-primary text-[26px] md:text-[40px] font-[500] capitalize">
          Enhancement & Restoration
        </h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 md:gap-6">
        {items.map(renderEnhancementItem)}
      </div>
    </section>
  );
}
