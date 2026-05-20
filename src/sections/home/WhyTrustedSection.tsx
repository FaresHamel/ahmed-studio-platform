import { Icon } from "@iconify/react";

const trustItems = [
  { title: "Calibrated Equipment", icon: "hugeicons:camera-lens" },
  { title: "Full Refurbished", icon: "el:magic" },
  { title: "Maintenance Routine", icon: "hugeicons:calendar-setting-01" },
  { title: "Confidentiality", icon: "hugeicons:file-lock" },
  { title: "Security", icon: "hugeicons:security-check" },
  { title: "Female Staff", icon: "mdi:account-tie-woman" },
  { title: "High Quality Output", icon: "ph:seal-check-light" },
  {
    title: "After Sale Service",
    icon: "streamline-freehand:phone-actions-24-hours-call"
  },
  { title: "Excellent Client Experience", icon: "wi:stars" }
];

export default function WhyTrustedSection() {
  return (
    <section className="py-12 md:py-20 bg-white px-4 overflow-hidden">
      {/* TITLE */}
      <h2 className="font-poppins text-primary text-[28px] md:text-[40px] font-[500] text-center mb-10 md:mb-16">
        Why We Are Trusted
      </h2>

      {/* MOBILE + TABLET */}
      <div className="lg:hidden overflow-x-auto scrollbar-hide">
        <div className="grid grid-rows-2 grid-flow-col gap-4 w-max px-1">
          {trustItems.map((item, index) => (
            <div
              key={index}
              className="
            bg-[#F7F1EC]
            w-[170px]
            p-5
            rounded-[18px]
            flex flex-col
            items-center
            text-center
            shadow-sm
            transition-all
            hover:shadow-md
          "
            >
              {/* ICON */}
              <div className="bg-[#B39174] w-14 h-14 rounded-[8px] flex items-center justify-center mb-4">
                <Icon icon={item.icon} className="text-2xl text-white" />
              </div>

              {/* TITLE */}
              <h3 className="font-poppins text-primary text-[14px] font-[500] leading-snug">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden lg:flex max-w-7xl mx-auto flex-wrap justify-center gap-6">
        {trustItems.map((item, index) => (
          <div
            key={index}
            className="
          bg-[#F7F1EC]
          w-[calc(23%-1rem)]
          xl:w-[calc(18%-1rem)]
          p-8
          rounded-[20px]
          flex flex-col
          items-center
          text-center
          shadow-sm
          transition-all
          hover:shadow-md
          hover:-translate-y-1
        "
          >
            {/* ICON */}
            <div className="bg-[#B39174] w-20 h-20 rounded-[8px] flex items-center justify-center mb-6">
              <Icon icon={item.icon} className="text-4xl text-white" />
            </div>

            {/* TITLE */}
            <h3 className="font-poppins text-primary text-[17px] font-[500] leading-snug">
              {item.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
