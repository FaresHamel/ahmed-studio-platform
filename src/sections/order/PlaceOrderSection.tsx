import Image from "next/image";
import { Icon } from "@iconify/react";

export default function PlaceOrderSection() {
  return (
    <section className=" md:py-24 px-6 md:px-20 lg:px-32 bg-[#F7F1EC]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* الجزء الأيسر: النصوص والأزرار */}
        <div className="flex flex-col items-start lg:w-1/2 order-2 lg:order-1">
          <div className="flex items-start gap-4">
            <span
              className=" font-poppins
                         font-poppins
                        text-primary
                        text-[26px]
                        sm:text-[34px]
                        md:text-5xl
                        lg:text-6xl
                        leading-tight
                        font-[500]"
            >
              1.
            </span>
            <h2
              className="font-poppins
                        text-primary
                        text-[26px]
                        sm:text-[34px]
                        md:text-5xl
                        lg:text-6xl
                        leading-tight
                        font-[500]"
            >
              Place an <br /> Order
            </h2>
          </div>

          <p
            className=" mt-6 md:mt-8
            font-poppins
            text-black
            text-[13px]
            sm:text-[15px]
            md:text-lg
            leading-relaxed"
          >
            Placing an order with Ahmed Studio is easy. Simply visit our store,
            choose the digitization or preservation service you need, and
            confirm your order. Our team will guide you through packaging,
            delivery, and processing to ensure your materials are handled safely
            and professionally from start to finish. Or send us through WhatsApp
            and our customer care will help you.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button className="bg-primary text-white px-8 md:px-10 py-3 md:py-4 font-poppins font-[500] text-[14px] md:text-base rounded-lg hover:bg-primary/90 transition-all shadow-md">
              Visit Our Store
            </button>

            <button className="bg-[#128C7E] text-white px-8 md:px-10 py-3 md:py-4 font-poppins font-[500] text-[14px] md:text-base rounded-lg flex items-center gap-3 hover:bg-[#075E54] transition-all shadow-md">
              <Icon
                icon="logos:whatsapp-icon"
                className="text-xl md:text-2xl"
              />
              WhatsApp
            </button>
          </div>
        </div>

        {/* الجزء الأيمن: حاوية الصور الثلاث المتداخلة */}
        <div className="w-full lg:w-1/2 order-1 lg:order-2 flex justify-center items-center">
          <div className="relative w-full max-w-[500px] h-[300px] md:h-[400px]">
            {/* الصورة الخلفية (الشريط الأصفر الكبير) */}
            <div className="absolute top-0 right-0 w-[70%] h-auto z-10">
              <Image
                src="/images/orderPlaceImg01.png"
                alt="Yellow Tape"
                width={400}
                height={300}
                className="object-contain"
              />
            </div>

            {/* الصورة الوسطى (بكرة الفيلم الحمراء) */}
            <div className="absolute bottom-0 left-0 w-[50%] h-auto z-30 transform -translate-y-4">
              <Image
                src="/images/orderPlaceImg02.png"
                alt="Red Film Reel"
                width={250}
                height={250}
                className="object-contain"
              />
            </div>

            {/* الصورة الأمامية (الشريط البرتقالي) */}
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
      </div>
    </section>
  );
}
