import Image from "next/image";

export default function StepsSection() {
  return (
    <div className="flex flex-col w-full">
      {/* Step 2: Shipment Pick */}
      <section className="py-16 md:py-24 px-6 md:px-20 lg:px-32 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Text on the left */}
          <div className="flex flex-col items-start lg:w-1/2">
            <div className="flex items-start gap-4">
              <span
                className="font-poppins
          text-primary
          text-[26px]
          sm:text-[34px]
          md:text-5xl
          lg:text-6xl
          leading-tight
          font-[500]"
              >
                2.
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
                Shipment <br /> Pick
              </h2>
            </div>
            <p className="mt-6 md:mt-8 font-poppins text-black text-[13px] sm:text-[15px] md:text-[18px] leading-relaxed opacity-80">
              Pick up your shipment from Ahmed Studio by visiting our studio
              during working hours. Bring your order confirmation and a valid
              ID, and our team will hand over your package safely.
            </p>
          </div>
        </div>
      </section>

      {/* Step 3: Digitization Your Memory */}
      {/* Using the approved cream background color #F7F1EC from the design */}
      <section className="py-16 md:py-24 px-6 md:px-20 lg:px-32 bg-[#F7F1EC]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Image on the left in this section */}
          {/* Right side: the box with only the logo inside */}
          <div className="w-full lg:w-1/2 flex justify-center items-center">
            {/* Relative container to control logo overlap over the box */}
            <div className="relative w-full max-w-[550px] aspect-[4/3]">
              {/* Box image (background) */}
              <Image
                src="/images/cardboard-box.png"
                alt="Shipping Box"
                fill
                className="object-contain z-10"
              />

              {/* Logo - centered exactly within the box */}
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

          {/* Text on the right */}
          <div className="flex flex-col items-start lg:w-1/2 order-1 lg:order-2">
            <div className="flex items-start gap-4">
              <span
                className=" font-poppins
          text-primary
          text-[26px]
          sm:text-[34px]
          md:text-5xl
          lg:text-6xl
          leading-tight
          font-[500]"
              >
                3.
              </span>
              <h2
                className="font-poppins
                          text-primary
                          text-[26px]
                          sm:text-[30px]
                          md:text-[30px]
                          lg:text-[40px]
                          leading-tight
                          font-[500]
                          text-center mb-16"
                           >
                Digitization <br /> Your Memory
              </h2>
            </div>
            <p className="mt-6 md:mt-8 font-poppins text-black text-[13px] sm:text-[15px] md:text-[18px] leading-relaxed opacity-80">
              You can digitize your tapes, photos, films, or audio by placing an
              order with Ahmed Studio. Share your media details with our team,
              send or drop off your materials, and we&apos;ll carefully digitize
              them using professional archival equipment. Once completed,
              you&apos;ll receive your files in high quality digital format.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
