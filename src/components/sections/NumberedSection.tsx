import Link from "next/link";
import React from "react";
import { Icon } from "@iconify/react";
interface NumberedSectionProps {
  number: number | string;
  title: string;
  description: string;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  backgroundColor?: string;
  imagePosition?: "left" | "right";
  layout?: "side-by-side" | "stacked";
  whatsappText?: string;
  whatsappUrl?: string;
  storeText?: string;
  storeUrl?: string;
}

export default function NumberedSection({
  number,
  title,
  description,
  leftContent,
  rightContent,
  backgroundColor = "bg-white",
  imagePosition = "right",
  layout = "side-by-side",
  whatsappText,
  whatsappUrl,
  storeText,
  storeUrl
}: NumberedSectionProps) {
  const isLeftFirst = imagePosition === "left";

  const numberAndTitle = (
    <div className="flex flex-col items-start w-full">
      <div className="flex items-start gap-4">
        <span className="text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-6xl leading-tight font-[500]">
          {number}.
        </span>
        <h2 className="text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-6xl leading-tight font-[500]">
          {title}
        </h2>
      </div>
      <p className="mt-6 md:mt-8 text-black text-[13px] sm:text-[15px] md:text-lg leading-relaxed opacity-80">
        {description}
      </p>

      {/* Buttons Container: Renders dynamically if text is passed */}
      {(whatsappText || storeText) && (
        <div className="mt-8 md:mt-10 flex flex-wrap gap-4 items-center w-full justify-start">
          {storeText && storeUrl && (
            <Link
              href={storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-primary text-white font-medium text-sm md:text-base px-6 py-3 rounded-[8px] hover:bg-primary/90 transition-colors duration-300 shadow-md active:scale-95"
            >
              {storeText}
            </Link>
          )}
          {whatsappText && whatsappUrl && (
            <Link
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#008834] text-white font-medium text-sm md:text-base px-6 py-3 rounded-[8px] hover:bg-[#20ba5a] transition-colors duration-300 shadow-md active:scale-95"
            >
              <Icon icon="mdi:whatsapp" width="18" height="18" />
              <p>{whatsappText}</p>
            </Link>
          )}
        </div>
      )}
    </div>
  );

  if (layout === "stacked") {
    return (
      <div
        className={`${backgroundColor} py-16 px-6 md:px-20 max-w-7xl mx-auto`}
      >
        {numberAndTitle}
      </div>
    );
  }

  return (
    <section
      className={`py-16 md:py-24 px-6 md:px-20 lg:px-32 ${backgroundColor}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {isLeftFirst ? (
          <>
            <div className="w-full lg:w-1/2">{leftContent}</div>
            <div className="flex flex-col items-start lg:w-1/2 order-2 lg:order-1">
              {numberAndTitle}
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-start lg:w-1/2 order-2 lg:order-1">
              {numberAndTitle}
            </div>
            <div className="w-full lg:w-1/2 order-1 lg:order-2">
              {rightContent}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
