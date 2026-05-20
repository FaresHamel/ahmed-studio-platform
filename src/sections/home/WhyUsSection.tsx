import { Icon } from "@iconify/react";
import Link from "next/link";

const features = [
  {
    icon: "hugeicons:award-02",
    title: "Since 2017 years",
    desc: "Over 8+ years of global expertise in preserving audiovisual heritage to the highest international standards."
  },
  {
    icon: "clarity:world-line", // Or any suitable icon for Best Practices
    title: "Best practices",
    desc: "Every project we supervise aligns with international standards, including high end legacy machines and professional grade equipments."
  },
  {
    icon: "bi:filetype-raw",
    title: "RAW Capture",
    desc: "We guarantee an uncompressed, authentic RAW capture of your original content, preserving every bit of information. Our lab uses industry-leading technology to deliver quality that home-grade equipment simply cannot match."
  }
];

export default function WhyUsSection() {
  return (
    <section className="py-12 md:py-20 px-4 max-w-7xl mx-auto overflow-hidden">
      {/* TITLE */}
      <h2 className="font-poppins text-primary text-[28px] md:text-[40px] font-bold text-center mb-10 md:mb-16">
        Why Us
      </h2>

      {/* ================= MOBILE ================= */}
      <div className="lg:hidden">
        {/* HORIZONTAL SCROLL CARDS */}
        <div className="overflow-x-auto scrollbar-hide mb-6">
          <div className="flex gap-4 w-max px-1">
            {features.map((item, index) => (
              <div
                key={index}
                className="
              min-w-[250px]
              max-w-[250px]
              bg-[#F7F1EC]
              p-5
              rounded-[20px]
              flex flex-col
              items-start
              shadow-sm
            "
              >
                {/* ICON */}
                <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center mb-4">
                  <Icon icon={item.icon} className="text-xl text-black/80" />
                </div>

                {/* TITLE */}
                <h3 className="font-poppins text-primary text-[18px] font-[500] mb-3">
                  {item.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="font-poppins text-black text-[14px] leading-relaxed opacity-90">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* BIG LAST CARD */}
        <div className="bg-[#F7F1EC] p-6 rounded-[20px] flex flex-col">
          <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center mb-4">
            <Icon
              icon="hugeicons:message-01"
              className="text-xl text-black/80"
            />
          </div>

          <h3 className="font-poppins text-primary text-[20px] font-[500] mb-4">
            Free Consultation
          </h3>

          <div className="font-poppins text-black text-[14px] space-y-4 opacity-90 leading-relaxed flex-grow">
            <p>
              First Meeting is Free: Start your journey with a complimentary
              15-minute consultation to discuss your specific technical needs.
            </p>

            <p>
              Support for Individuals: We guide families with the same expert
              methods used for large institutions to ensure their personal
              memories are protected for decades.
            </p>
          </div>

          <button className="mt-6 bg-primary text-white px-6 py-3 rounded-lg font-poppins font-[500] w-full hover:bg-primary/90 transition-all">
            Read More
          </button>
        </div>
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden lg:grid grid-cols-12 gap-6">
        {/* LEFT */}
        <div className="col-span-8 grid grid-cols-2 gap-6">
          {features.map((item, index) => (
            <div
              key={index}
              className={`
            bg-[#F7F1EC]
            p-8
            rounded-[25px]
            flex flex-col
            items-start
            ${index === 2 ? "col-span-2" : ""}
          `}
            >
              <div className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center mb-6">
                <Icon icon={item.icon} className="text-2xl text-black/80" />
              </div>

              <h3 className="font-poppins text-primary text-[24px] font-[500] mb-4">
                {item.title}
              </h3>

              <p className="font-poppins text-black text-[16px] leading-relaxed opacity-90">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <div className="col-span-4 bg-[#F7F1EC] p-8 rounded-[25px] flex flex-col">
          <div className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center mb-6">
            <Icon
              icon="hugeicons:message-01"
              className="text-2xl text-black/80"
            />
          </div>

          <h3 className="font-poppins text-primary text-[24px] font-[500] mb-4">
            Free Consultation
          </h3>

          <div className="font-poppins text-black text-[16px] space-y-6 opacity-90 flex-grow leading-relaxed">
            <p>
              First Meeting is Free: Start your journey with a complimentary
              15-minute consultation to discuss your specific technical needs.
            </p>

            <p>
              Support for Individuals: We guide families with the same expert
              methods used for large institutions to ensure their personal
              memories are protected for decades.
            </p>
          </div>

          <Link
            href="/consultant"
            className="mt-10 bg-primary text-white px-8 py-3 rounded-lg font-poppins font-[500] w-fit hover:bg-primary/90 transition-all"
          >
            Read More
          </Link>
        </div>
      </div>
    </section>
  );
}
