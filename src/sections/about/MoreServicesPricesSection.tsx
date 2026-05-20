import Link from "next/link";

export default function MoreServicesPricesSection() {
  return (
    <section className="w-full bg-white py-16 md:py-24 px-6 md:px-12 lg:px-20 flex items-center justify-center overflow-visible">
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center text-center">
        {/* 1. العنوان الرئيسي الموحد والمتناسق */}
        <h2 className="font-poppins text-black text-[28px] sm:text-[34px] md:text-[40px] font-[600] leading-tight mb-6 md:mb-8">
          For More Services And Prices
        </h2>

        {/* 2. حاوية النصوص الوصفية (الفقرات) */}
        <div className="w-full flex flex-col gap-6 mb-10 md:mb-12">
          <p className="font-poppins text-black text-[14px] sm:text-[15px] md:text-[16px] leading-relaxed opacity-80 max-w-3xl mx-auto">
            We offer a wide range of professional digitization and media
            services tailored to preserve your memories with the highest
            quality. Our services include video tape conversion, photo and film
            digitization, audio restoration, image enhancement, and customized
            media solutions.
          </p>

          <p className="font-poppins text-black text-[14px] sm:text-[15px] md:text-[16px] leading-relaxed opacity-80 max-w-3xl mx-auto">
            Pricing varies depending on the type of service, media format,
            duration, and level of restoration required. Whether you need basic
            digitization or advanced enhancement, we provide flexible options to
            match your needs and budget.
          </p>
        </div>

        {/* 3. زر الانتقال إلى المتجر (Button) بالتصميم واللون المطابق تماماً */}
        <Link
          href="/store" // وجه المسار إلى الصفحة المطلوبة في مشروعك
          className="
            inline-flex 
            items-center 
            justify-center 
            bg-[#84634B] 
            hover:bg-[#6F503A] 
            text-white 
            font-poppins 
            font-[500] 
            text-[15px] 
            sm:text-[16px] 
            px-8 
            py-3.5 
            sm:px-10 
            sm:py-4 
            rounded-lg 
            shadow-[0_4px_14px_rgba(132,99,75,0.25)] 
            transition-all 
            duration-300 
            hover:-translate-y-0.5 
            active:translate-y-0
          "
        >
          Visit Our Store
        </Link>
      </div>
    </section>
  );
}
