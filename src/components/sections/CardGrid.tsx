import React from "react";

export interface CardItem {
  id: number | string;
  [key: string]: any;
}

interface CardGridProps<T extends CardItem = CardItem> {
  items: T[];
  renderCard: (item: T, index: number) => React.ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: "small" | "medium" | "large";
  variant?: "default" | "horizontal-scroll" | "masonry";
  className?: string;
  containerClassName?: string;
}

export default function CardGrid<T extends CardItem = CardItem>({
  items,
  renderCard,
  columns = { mobile: 2, tablet: 2, desktop: 3 },
  gap = "medium",
  variant = "default",
  className = "",
  containerClassName = ""
}: CardGridProps<T>) {
  const gapMap = {
    small: "gap-2 sm:gap-3 md:gap-4",
    medium: "gap-4 sm:gap-5 md:gap-6 lg:gap-8",
    large: "gap-6 md:gap-8 lg:gap-10"
  };

  const colsMap = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5"
  };

  const getGridClasses = () => {
    let classes = "w-full grid";

    if (columns.mobile) {
      classes += ` ${colsMap[columns.mobile as keyof typeof colsMap]}`;
    }
    if (columns.tablet) {
      classes += ` md:${colsMap[columns.tablet as keyof typeof colsMap]}`;
    }
    if (columns.desktop) {
      classes += ` lg:${colsMap[columns.desktop as keyof typeof colsMap]}`;
    }

    classes += ` ${gapMap[gap]}`;
    return classes;
  };

  if (variant === "horizontal-scroll") {
    return (
      <div className="overflow-x-auto scrollbar-hide">
        <div className={`flex gap-4 w-max ${containerClassName}`}>
          {items.map((item, index) => (
            <div key={item.id} className={`min-w-[250px] max-w-[250px] ${className}`}>
              {renderCard(item, index)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${getGridClasses()} ${containerClassName}`}>
      {items.map((item, index) => (
        <div key={item.id} className={className}>
          {renderCard(item, index)}
        </div>
      ))}
    </div>
  );
}
