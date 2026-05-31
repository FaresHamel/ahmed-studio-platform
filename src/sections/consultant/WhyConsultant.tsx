import Image from "next/image";
import SideByTwoLayout from "@/src/components/layouts/SideByTwoLayout";

export default function WhyConsultant() {
  return (
    <SideByTwoLayout
      imagePosition="left"
      gap="medium"
      margin="medium"
      leftContent={
        <div className="relative aspect-square w-full overflow-hidden rounded-[20px]">
          <Image
            src="/images/consultantImg.jpg"
            alt="VHS Digitization"
            fill
            className="object-cover"
          />
        </div>
      }
      rightContent={
        <div className="flex flex-col items-start">
          <h2 className="font-poppins text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-6xl leading-tight font-[500]">
            Why Consulting
            <br />
            Is Essential
          </h2>
          <p className="mt-6 md:mt-8 font-poppins text-black text-[13px] sm:text-[15px] md:text-lg leading-relaxed">
            Without proper consulting, many projects suffer from:
            <br />
            Proper Correction: Incorrect digitization methods.
            <br />
            Storage: Poor storage and metadata design.
            <br />
            Cost: Costly rework or data loss.
            <br />
          </p>
        </div>
      }
    />
  );
}
