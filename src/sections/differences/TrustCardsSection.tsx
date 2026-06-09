"use client";
import { Icon } from "@iconify/react";
import { useI18n } from "@/src/i18n/context";

const CARD_ICONS = [
  "vaadin:handshake",
  "lets-icons:file-dock-search-light",
  "la:certificate"
];

export default function TrustCardsSection() {
  const { t } = useI18n();
  const cardsData = t.differences.trust.cards || [];

  return (
    <section className="max-w-[1171px] mx-auto px-4 mt-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cardsData.map(
          (card: { title: string; desc: string }, index: number) => (
            <div
              key={card.title || index}
              className="bg-[#F7F1EC] rounded-3xl p-6 md:p-8 flex flex-col items-center text-center justify-center min-h-[270px] md:min-h-[295px]"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 bg-[#B39174] rounded-xl flex items-center justify-center text-4xl mb-5 md:mb-6 shadow-inner">
                <Icon
                  icon={CARD_ICONS[index] || "vaadin:handshake"}
                  className="text-white text-5xl md:text-6xl"
                />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-[#77510A] mb-2">
                {card.title}
              </h3>
              <p className="text-sm md:text-base text-black/80 leading-relaxed">
                {card.desc}
              </p>
            </div>
          )
        )}
      </div>
    </section>
  );
}
