import Image from "next/image";
import SideByTwoLayout from "@/src/components/layouts/SideByTwoLayout";

export default function TrainingToUnderstand() {
  return (
    <SideByTwoLayout
      imagePosition="left"
      gap="medium"
      margin="large"
      leftContent={
        <div className="relative aspect-square w-full overflow-hidden rounded-[20px]">
          <Image
            src="/images/aiProcessor.png"
            alt="The Possibilities Are Endless"
            fill
            className="object-cover"
          />
        </div>
      }
      rightContent={
        <div className="flex flex-col items-start text-left">
          <h2 className="font-poppins text-primary text-[18px] sm:text-[28px] md:text-5xl lg:text-6xl leading-tight font-[500] mb-8">
            McKenzie™ is trained to understand
          </h2>
          <div className="space-y-6 font-poppins text-black text-[15px] md:text-[16px] leading-relaxed">
            <p className="opacity-80">
              the unique properties of various analog formats, ranging from VHS
              tapes to Super 8 films. It performs instant assessments to improve
              the following:
            </p>
            <p className="text-gray-700">
              <strong className="text-black font-[700] block sm:inline">
                Clarity:
              </strong>{" "}
              <span className="opacity-80">
                It adds sharpness and creates crisper video clarity.{" "}
              </span>
            </p>
            <p className="text-gray-700">
              <strong className="text-black font-[700] block sm:inline">
                Correction :
              </strong>{" "}
              <span className="opacity-80">
                It removes imperfections and reduces motion blur caused by camera
                movement.
              </span>
            </p>
            <p className="text-gray-700">
              <strong className="text-black font-[700] block sm:inline">
                Preservation :
              </strong>{" "}
              <span className="opacity-80">
                It aims to heighten the power of moments while preserving the
                natural look and feel of the original memories.
              </span>
            </p>
          </div>
        </div>
      }
    />
  );
}
