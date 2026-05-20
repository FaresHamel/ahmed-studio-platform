import Image from "next/image";

export default function HowItsWorkSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center my-[10px]">
      {/* الجزء الأيسر: الصورة (Left Side: Image) */}
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src="/images/howItWorkOrder.png"
          alt="How It Works"
          fill
          className="object-contain"
        />
      </div>

      {/* الجزء الأيمن: المحتوى (Right Side: Content) */}
      <div className="flex flex-col items-start">
        {/* العنوان - باللون الـ Primary وخط Playfair */}
        <h2
          className="
          font-poppins
          text-primary
          text-[26px]
          sm:text-[34px]
          md:text-5xl
          lg:text-6xl
          leading-tight
          font-[500]
        "
        >
          HOW IT WORKS
        </h2>

        <p
          className="
            mt-6 md:mt-8
            font-poppins
            text-black
            text-[13px]
            sm:text-[15px]
            md:text-lg
            leading-relaxed
          "
        >
          We make preserving your memories simple. First, you share your tapes,
          films or audio reels with our team. We carefully clean, restore and
          digitize each item using specialized equipment. Once completed, we
          deliver your files digitally or on USB giving you secure access to
          your memories anytime without the risk of deterioration.
        </p>
      </div>
    </div>
  );
}
