import Image from "next/image";

export default function PhotosSlidesSection() {
  return (
    <section className="w-full bg-[#F5EFEA] my-[20px] py-16 md:py-10 px-6 md:px-12 lg:px-20 overflow-hidden flex items-center justify-center ">
      <div className="max-w-7xl mx-auto w-full flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-20">
        {/* 1. الجزء الأيسر: الحاوية الفنية للصور والشرائح والنيجاتيف */}
        <div className="w-full lg:w-1/2 relative min-h-[320px] sm:min-h-[380px] md:min-h-[420px] lg:h-[400px] flex items-center justify-center">
          {/* أ. مجموعة الصور الفوتوغرافية المتراكمة (أعلى اليسار) */}
          <div className="absolute top-4 left-4 sm:left-10 lg:left-0 max-w-[150px] sm:max-w-[200px] md:max-w-[250px] lg:max-w-[280px] drop-shadow-[0_12px_20px_rgba(0,0,0,0.18)] transition-transform duration-300 hover:rotate-2">
            <Image
              src="/images/slides-stack.png" // صورة الأطفال في العربة الحمراء
              alt="Printed Photos Stack"
              width={280} // تم رفعه ليتوافق مع أقصى حجم للشاشات الكبيرة lg
              height={280}
              className="w-full h-auto object-contain" // تغييرها إلى object-contain يحمي أبعاد الصورة الأصلية من القص
              priority
            />
          </div>

          <div className="relative group flex items-center justify-center bg-transparent transition-transform duration-300 hover:scale-105 drop-shadow-[0_8px_15px_rgba(0,0,0,0.12)]">
            <Image
              alt="Photo Slides Stack"
              src={"/images/video-other1.png"}
              width={140}
              height={95}
              className="w-full h-auto object-contain"
              priority
            />
          </div>

          {/* ب. شبكة الشرائح المربعة الـ 4 المستهدفة (أعلى اليمين / المنتصف) */}
          <div className="absolute top-4 right-4 sm:right-12 lg:right-20 max-w-[150px] sm:max-w-[200px] md:max-w-[220px] lg:max-w-[240px] drop-shadow-[0_10px_18px_rgba(0,0,0,0.15)]">
            <div className="transition-transform duration-300 hover:scale-105 hover:rotate-1">
              <Image
                src="/images/slides-preview.png" // مسار الصورة المفرَدة الأكبر للشرائح
                alt="Color Transparency Slide Preview"
                width={240} // تم تكبير الـ width الافتراضي ليتناسب مع الحجم الجديد
                height={240}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>

          {/* ج. شريط الفيلم السالب النيجاتيف البني المتراص (أسفل المنتصف) */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 max-w-[150px] sm:max-w-[180px] md:max-w-[220px] drop-shadow-[0_12px_18px_rgba(0,0,0,0.2)] transition-transform duration-300 hover:-translate-y-1">
            <Image
              src="/images/slides-negative.png" // استبدلها بمسار شريطي الفيلم النيجاتيف البني
              alt="Negative Film Strips"
              width={220}
              height={220}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>

        {/* 2. الجزء الأيمن: حاوية النصوص والعناوين */}
        <div className="w-full lg:w-1/2 flex flex-col items-start z-10 lg:pl-6">
          <h2 className="font-poppins text-primary text-[32px] sm:text-[40px] md:text-[48px] font-[600] leading-tight mb-4 md:mb-6">
            Photos Slides
          </h2>
          <p className="font-poppins text-black text-[14px] sm:text-[15px] lg:text-[16px] leading-relaxed opacity-85 max-w-xl">
            No projector? No problem. We convert your old photo slides into
            modern digital images, making it easy to enjoy your favorite moments
            on any device.
          </p>
        </div>
      </div>
    </section>
  );
}
