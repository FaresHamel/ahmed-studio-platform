import Image from "next/image";
import Link from "next/link";

export default function ProfessionalSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center my-[150px]">
      {/* 1. الجزء الأيسر: المحتوى (Left Side: Content) */}
      {/* نستخدم order-2 لجعل النص يظهر بعد الصورة في الجوال، و order-1 في الشاشات الكبيرة */}
      <div className="flex flex-col items-start order-2 lg:order-1">
        {/* العنوان - خط Playfair ولون Primary */}
        <h2
          className="
          font-poppins
          text-primary
          text-[26px]
          sm:text-[36px]
          md:text-5xl
          lg:text-6xl
          leading-tight
          font-[500]
          capitalize
        "
        >
          We operate at a <br />
          professional archival
        </h2>

        {/* الوصف - خط Poppins ولون أسود مع تباعد أسطر مريح */}
        <div className="mt-8 space-y-6 font-poppins text-black text-[16px] md:text-lg leading-relaxed opacity-90">
          <p>
            Grade to guarantee the highest possible quality during digitization.
            Our workflows are designed to capture every single bit of
            information from video, audio, and photographic materials—without
            compression, processing loss, or data reduction.
          </p>
          <p>
            By digitizing content in true RAW / preservation formats, we ensure
            that the digital files remain an authentic and complete
            representation of the original media. This approach avoids
            irreversible data loss and preserves maximum detail, accuracy, and
            integrity.
          </p>
          <p>
            Our main purpose is long-term preservation. All digitization is
            performed in accordance with internationally recognized best
            practices, ensuring your archive remains stable, accessible, and
            future-ready for decades to come.
          </p>
        </div>
        <Link
          href="/enhancement"
          className="mt-10 bg-primary text-white px-12 py-4 font-poppins font-[400] rounded-lg hover:bg-primary/90 transition-all shadow-md"
        >
          Read More
        </Link>
      </div>
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px] order-1 lg:order-2 flex">
        {/* الجزء الأول: Compressed (اليسار) */}
        <div className="relative flex-1 overflow-hidden h-full">
          <Image
            src="/images/before.jpg"
            alt="Compressed Quality"
            fill
            className="object-cover"
          />
          {/* نص توضيحي للجهة اليسرى */}
          <div className="absolute top-6 left-6 z-20">
            <span className="text-white font-poppins font-bold text-sm md:text-lg tracking-widest uppercase bg-black/30 px-3 py-1 rounded">
              Compressed
            </span>
          </div>
        </div>

        {/* خط فاصل رفيع جداً بالمنتصف */}
        <div className="w-[1px] h-full bg-white/30 z-30 shadow-sm" />

        {/* الجزء الثاني: RAW (اليمين) */}
        <div className="relative flex-1 overflow-hidden h-full">
          <Image
            src="/images/after.jpg"
            alt="RAW Quality"
            fill
            className="object-cover"
          />
          {/* نص توضيحي للجهة اليمنى */}
          <div className="absolute top-6 right-6 z-20">
            <span className="text-white font-poppins font-bold text-sm md:text-lg tracking-widest uppercase bg-black/30 px-3 py-1 rounded">
              RAW
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
