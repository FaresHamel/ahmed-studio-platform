import { Icon } from "@iconify/react";
const TRUST_CARDS = [
  {
    icon: "vaadin:handshake",
    title: "Built on Trust",
    desc: "More 5-star reviews than anyone else. We treat your box like our own."
  },
  {
    icon: "lets-icons:file-dock-search-light",
    title: "Honest & Transparent",
    desc: "Fair pricing, clear workflow and open discussion with clients."
  },
  {
    icon: "la:certificate",
    title: "Undisputed Experts",
    desc: "Digitizing since 2017. We've never lost a single memory."
  }
];

export default function TrustCardsSection() {
  return (
    <section className="max-w-[1171px] mx-auto px-4 mt-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TRUST_CARDS.map((card) => (
          <div
            key={card.title}
            className="bg-[#F7F1EC] rounded-3xl p-8 flex flex-col items-center text-center"
            style={{ minHeight: "295px"}}
          >
            <div className="w-24 h-24 bg-[#B39174] rounded-xl flex items-center justify-center text-4xl mb-6 shadow-inner">
              <Icon icon={card.icon} className="text-white text-6xl" />
            </div>
            <h3 className="text-xl font-semibold text-[#77510A] mb-2">
              {card.title}
            </h3>
            <p className="text-base text-black/80 leading-relaxed">
              {card.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
