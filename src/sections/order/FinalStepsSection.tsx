import Image from "next/image";

export default function FinalStepsSection() {
  return (
    <section className="py-16 md:py-24 px-6 md:px-20 lg:px-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-10 lg:gap-20">
        {/* Left: Image */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <div className="relative w-[80%] sm:w-[60%] lg:w-full max-w-[500px] aspect-video">
            <Image
              src="/images/howItWorkOrder.png"
              alt="Instant Access Preview"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Right: Stacked Steps */}
        <div className="flex flex-col lg:w-1/2 space-y-16">
          {/* Step 4: Instant Access */}
          <div className="flex flex-col items-start">
            <div className="flex items-start gap-4">
              <span className="text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-6xl leading-tight font-[500]">
                4.
              </span>
              <h2 className="text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-6xl leading-tight font-[500]">
                Instant Access
              </h2>
            </div>
            <p className="text-black text-[16px] leading-relaxed opacity-90 mt-6 md:mt-8">
              You can get instant access to your digitized files through our
              secure online delivery system. Once your project is completed, we
              send you a private download link allowing you to view and access
              your files immediately from any device.
            </p>
          </div>

          {/* Step 5: Safely Returned */}
          <div className="flex flex-col items-start">
            <div className="flex items-start gap-4">
              <span className="text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-6xl leading-tight font-[500]">
                5.
              </span>
              <h2 className="text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-6xl leading-tight font-[500]">
                Safely Returned
              </h2>
            </div>
            <p className="text-black text-[16px] leading-relaxed opacity-90 mt-6 md:mt-8">
              At Ahmed Studio, your original materials are safely returned after
              digitization. We carefully pack and seal every item, label it
              properly, and return it through secure delivery or in-person
              collection to ensure nothing is damaged or misplaced.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
