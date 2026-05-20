import Image from "next/image";

export default function WhatDoes() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center my-[100px]">
      {/* Right side: Content */}
      <div className="flex flex-col items-start">
        {/* Title - primary color, Playfair font */}
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
          What Does <br />a &apos;Consultant Do?
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
          A digitization consultant acts as your technical representative and
          quality guardian. We translate your goals into clear technical
          requirements, design reliable workflows, and ensure that every stage
          of the project is executed correctly—from the first tape inspection to
          the final archived file. We make sure:
        </p>
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
          Technology: The right technologies are selected quality guardian.
          <br />
          Workflow: The correct workflows are applied.
          <br />
          Outputs: The final outputs meet international best practices <br />
          Preservation: Long-term preservation is achieved, not just short-term
          delivery
          <br />
        </p>
      </div>

      {/* Left side: Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-[20px]">
        <Image
          src="/images/whatDoesImg.jpg"
          alt="VHS Digitization"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
