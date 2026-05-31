import Image from "next/image";
import { Icon } from "@iconify/react";
import NumberedSection from "@/src/components/sections/NumberedSection";

export default function PlaceOrderSection() {
  const imageContent = (
    <div className="flex justify-center items-center">
      <div className="relative w-full max-w-[500px] h-[300px] md:h-[400px]">
        <div className="absolute top-0 right-0 w-[70%] h-auto z-10">
          <Image
            src="/images/orderPlaceImg01.png"
            alt="Yellow Tape"
            width={400}
            height={300}
            className="object-contain"
          />
        </div>

        <div className="absolute bottom-0 left-0 w-[50%] h-auto z-30 transform -translate-y-4">
          <Image
            src="/images/orderPlaceImg02.png"
            alt="Red Film Reel"
            width={250}
            height={250}
            className="object-contain"
          />
        </div>

        <div className="absolute bottom-4 right-0 w-[55%] h-auto z-20">
          <Image
            src="/images/orderPlaceImg03.png"
            alt="Orange Tape"
            width={300}
            height={200}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );

  const textContent = (
    <div>
      <div className="mt-10 flex flex-wrap gap-4">
        <button className="bg-primary text-white px-8 md:px-10 py-3 md:py-4 font-[500] text-[14px] md:text-base rounded-lg hover:bg-primary/90 transition-all shadow-md">
          Visit Our Store
        </button>

        <button className="bg-[#128C7E] text-white px-8 md:px-10 py-3 md:py-4 font-[500] text-[14px] md:text-base rounded-lg flex items-center gap-3 hover:bg-[#075E54] transition-all shadow-md">
          <Icon
            icon="logos:whatsapp-icon"
            className="text-xl md:text-2xl"
          />
          WhatsApp
        </button>
      </div>
    </div>
  );

  return (
    <NumberedSection
      number={1}
      title="Place an Order"
      description="Placing an order with Ahmed Studio is easy. Simply visit our store, choose the digitization or preservation service you need, and confirm your order. Our team will guide you through packaging, delivery, and processing to ensure your materials are handled safely and professionally from start to finish. Or send us through WhatsApp and our customer care will help you."
      leftContent={null}
      rightContent={imageContent}
      backgroundColor="bg-[#F7F1EC]"
      imagePosition="right"
    />
  );
}
