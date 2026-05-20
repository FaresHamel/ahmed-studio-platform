export default function CoreServicesConsultationSection() {
  return (
    <div className="flex flex-col items-center  my-[100px]">
      {/* 1. Header Section */}
      <div className="text-center mb-16">
        <h2
          className="
                    font-poppins
                    text-primary
                    text-[26px]
                    sm:text-[30px]
                    md:text-[30px]
                    lg:text-[40px]
                    leading-tight
                    font-[500]
                    text-center mb-16
                    "
        >
          At Ahmed Studio
        </h2>

        <p
          className="
          font-poppins text-black text-[14px] sm:text-[15px] md:text-[16px] leading-relaxed opacity-90 max-w-3xl
         "
        >
          Our consulting services are built on over 20 years of combined
          experience through Ahmed Studio and our trusted international
          partners. We help individuals, companies, and government entities
          plan, execute, and supervise digitization and preservation projects to
          the highest international standards. Digitization is not just a
          technical process—it is a strategic decision that affects the future
          accessibility, authenticity, and safety of your archive. Our role as
          consultants is to protect your project, your investment, and your
          archive.
        </p>
      </div>
    </div>
  );
}
