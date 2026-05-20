import Image from "next/image";
import NumberedSection from "@/src/components/sections/NumberedSection";

export default function StepsSection() {
  const step3Image = (
    <div className="flex justify-center items-center">
      <div className="relative w-full max-w-[550px] aspect-[4/3]">
        <Image
          src="/images/cardboard-box.png"
          alt="Shipping Box"
          fill
          className="object-contain z-10"
        />

        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="w-[40%] h-auto opacity-90">
            <Image
              src="/images/logo-black.png"
              alt="Ahmed Studio Logo"
              width={250}
              height={120}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full">
      <NumberedSection
        number={2}
        title="Shipment Pick"
        description="Pick up your shipment from Ahmed Studio by visiting our studio during working hours. Bring your order confirmation and a valid ID, and our team will hand over your package safely."
        backgroundColor="bg-white"
      />

      <NumberedSection
        number={3}
        title="Digitization Your Memory"
        description="You can digitize your tapes, photos, films, or audio by placing an order with Ahmed Studio. Share your media details with our team, send or drop off your materials, and we'll carefully digitize them using professional archival equipment. Once completed, you'll receive your files in high quality digital format."
        leftContent={step3Image}
        backgroundColor="bg-[#F7F1EC]"
        imagePosition="left"
      />
    </div>
  );
}
