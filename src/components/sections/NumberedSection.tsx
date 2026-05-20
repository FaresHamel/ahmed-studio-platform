import React from "react";

interface NumberedSectionProps {
  number: number | string;
  title: string;
  description: string;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  backgroundColor?: string;
  imagePosition?: "left" | "right";
  layout?: "side-by-side" | "stacked";
}

export default function NumberedSection({
  number,
  title,
  description,
  leftContent,
  rightContent,
  backgroundColor = "bg-white",
  imagePosition = "right",
  layout = "side-by-side"
}: NumberedSectionProps) {
  const isLeftFirst = imagePosition === "left";

  const numberAndTitle = (
    <div className="flex flex-col items-start">
      <div className="flex items-start gap-4">
        <span className="font-poppins text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-6xl leading-tight font-[500]">
          {number}.
        </span>
        <h2 className="font-poppins text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-6xl leading-tight font-[500]">
          {title}
        </h2>
      </div>
      <p className="mt-6 md:mt-8 font-poppins text-black text-[13px] sm:text-[15px] md:text-lg leading-relaxed opacity-80">
        {description}
      </p>
    </div>
  );

  if (layout === "stacked") {
    return (
      <div className={`${backgroundColor}`}>
        {numberAndTitle}
      </div>
    );
  }

  return (
    <section className={`py-16 md:py-24 px-6 md:px-20 lg:px-32 ${backgroundColor}`}>
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
