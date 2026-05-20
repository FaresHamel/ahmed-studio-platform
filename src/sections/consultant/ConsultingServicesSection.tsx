import { Icon } from "@iconify/react";

const services = [
  {
    icon: "hugeicons:workflow-01",
    title: "Workflow Design & Project Planning",
    features: [
      "Media assessment and prioritization",
      "Tape and film handling rules",
      "Digitization standards (RAW) Preservation Masters",
      "Quality control and validation steps"
    ]
  },
  {
    icon: "hugeicons:view-01",
    title: "Archive Evaluation & Media Treatment",
    features: [
      "Media condition and risks",
      "Required treatments before digitization",
      "Best technical approach per format",
      "Preservation priorities"
    ]
  },
  {
    icon: "hugeicons:note-01",
    title: "Technical Proposals & RFP Support",
    features: [
      "Writing and reviewing RFPs",
      "Defining technical specifications",
      "Setting quality and delivery benchmarks",
      "Avoiding vague or risky requirements"
    ]
  },
  {
    icon: "hugeicons:tools-01",
    title: "Equipment Selection & Supply",
    features: [
      "Professional digitization machines",
      "Restoration and processing systems",
      "Storage and backup solutions",
      "Procurement support and validation"
    ]
  },
  {
    icon: "hugeicons:clipboard-check",
    title: "Project Supervision & Quality Assurance",
    features: [
      "Monitoring workflows and outputs",
      "Ensuring compliance with international best practices",
      "Verifying file integrity, formats, and metadata",
      "Aligning the project with its original goals"
    ]
  }
];

export default function ConsultingServicesSection() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-20 bg-[#111111] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* العنوان الموحد والمتجاوب بالكامل كما طلبته */}
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
          text-center
          mb-12
          md:mb-20
        "
        >
          Our Consulting Services
        </h2>

        {/* شبكة العرض المتجاوبة: 
            - عمود واحد في الجوال مع بطاقات مدمجة (w-[90%] أو تصغير الحجم)
            - عمودين في التابلت
            - 5 أعمدة في شاشات الويب الكبيرة lg
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4 items-stretch">
          {services.map((service, index) => (
            <div
              key={index}
              className="
                bg-white/5 
                hover:bg-white/10 
                border-t-4 
                border-primary 
                rounded-xl 
                p-5 
                md:p-6 
                flex 
                flex-col 
                transition-all 
                duration-300 
                hover:-translate-y-1
                backdrop-blur-sm
                /* تصغير حجم البطاقة والنصوص تلقائياً في الجوال والتابلت */
                text-sm
                sm:text-base
              "
            >
              {/* الأيقونة */}
              <div className="text-primary text-2xl md:text-3xl mb-4 flex items-center justify-start">
                <Icon icon={service.icon} />
              </div>

              {/* عنوان الخدمة الفرعي */}
              <h3 className="font-poppins font-[500] text-white text-[16px] sm:text-[18px] lg:text-[19px] leading-snug mb-4 min-h-[48px] lg:min-h-[60px]">
                {service.title}
              </h3>

              {/* قائمة المميزات والعناصر */}
              <ul className="space-y-2 flex-grow">
                {service.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="
                      font-poppins 
                      text-white/70 
                      /* نصوص أصغر في الجوال (12px) وتعود لطبيعتها في الويب (14px) */
                      text-[12px] 
                      md:text-[14px] 
                      leading-relaxed 
                      relative 
                      pl-4 
                      before:content-['•'] 
                      before:text-primary 
                      before:absolute 
                      before:left-0 
                      before:font-bold
                    "
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
