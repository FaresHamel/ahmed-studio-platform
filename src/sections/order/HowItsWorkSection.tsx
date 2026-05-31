import Image from "next/image";
import SideByTwoLayout from "@/src/components/layouts/SideByTwoLayout";

export default function HowItsWorkSection() {
  return (
    <SideByTwoLayout
      imagePosition="left"
      gap="medium"
      margin="small"
      leftContent={
        <div className="relative aspect-square w-full overflow-hidden rounded-[20px]">
          <Image
            src="/images/howItWorkOrder.png"
            alt="How It Works"
            fill
            className="object-contain"
          />
        </div>
      }
      rightContent={
        <div className="flex flex-col items-start">
          <h2 className="text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-6xl leading-tight font-[500]">
            HOW IT WORKS
          </h2>

          <p className="mt-6 md:mt-8 text-black text-[13px] sm:text-[15px] md:text-lg leading-relaxed">
            We make preserving your memories simple. First, you share your tapes,
            films or audio reels with our team. We carefully clean, restore and
            digitize each item using specialized equipment. Once completed, we
            deliver your files digitally or on USB giving you secure access to
            your memories anytime without the risk of deterioration.
          </p>
        </div>
      }
    />
  );
}
