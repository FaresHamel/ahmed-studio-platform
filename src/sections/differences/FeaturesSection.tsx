interface FeatureSection {
  badge: string;
  heading: string;
  body: string;
  reversed: boolean;
  cta?: string;
  emoji: string;
}

const FEATURE_SECTIONS: FeatureSection[] = [
  {
    badge: "Care",
    heading: "We treat every shipment like a",
    body: "National treasure. Since our founding, we have processed over millions of memories without losing a single one. Our facility is climate-controlled, monitored 24/7, and every item is barcoded the moment it arrives, so you can track your family's history through every stage of the journey.",
    reversed: false,
    emoji: "📦",
  },
  {
    badge: "Streaming",
    heading: "Stop Digging for Files. Start",
    body: "Streaming your Life. With other services, your \"digital\" memories end up trapped on a USB drive in a junk drawer or buried in a complex cloud folder that is hard to navigate. We believe your memories should be as easy to watch as your favorite show on Netflix.",
    reversed: true,
    cta: "Invite Your Family Now",
    emoji: "📺",
  },
  {
    badge: "Enhancement",
    heading: "See Your Memories for the",
    body: "First Time—Again. Old film fades. Tapes get grainy. Photos lose their luster. But they don't have to stay that way. Our proprietary AI Enhancement technology uses advanced machine learning to go beyond simple scanning.",
    reversed: false,
    emoji: "✨",
  },
];

export default function FeaturesSection() {
  return (
    <div className="max-w-[1170px] mx-auto px-4 mt-24 space-y-24">
      {FEATURE_SECTIONS.map((section, idx) => (
        <section
          key={idx}
          className={`flex flex-col md:flex-row items-center gap-20 ${
            section.reversed ? "md:flex-row-reverse" : ""
          }`}
        >
          <div className="w-full md:w-[470px] shrink-0 rounded-2xl bg-gradient-to-br from-amber-200 to-amber-100 flex items-center justify-center overflow-hidden shadow-lg" style={{ minHeight: "480px" }}>
            <div className="text-amber-800/30 text-6xl select-none">
              {section.emoji}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <span className="inline-block text-xs font-semibold text-amber-700 bg-amber-100 rounded-full px-4 py-1 mb-5">
              {section.badge}
            </span>
            <h2 className="text-3xl md:text-5xl font-semibold text-[#77510A] leading-tight mb-6">
              {section.heading}
            </h2>
            <p className="text-base md:text-lg text-[#3C3C3C] leading-relaxed text-justify">
              {section.body}
            </p>
            {section.cta && (
              <button className="mt-8 flex items-center gap-2 bg-[#846449] text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-amber-800 transition-colors">
                {section.cta}
              </button>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
