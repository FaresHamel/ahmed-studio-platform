import React from "react";

export interface CardItem {
  id: number | string;
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

  const mobileColumns: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5"
  };

  const tabletColumns: Record<number, string> = {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    5: "md:grid-cols-5"
  };

  const desktopColumns: Record<number, string> = {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5"
  };

  const getGridClasses = () =>
    [
      "w-full grid",
      mobileColumns[columns.mobile ?? 2] ?? mobileColumns[2],
      tabletColumns[columns.tablet ?? 2] ?? tabletColumns[2],
      desktopColumns[columns.desktop ?? 3] ?? desktopColumns[3],
      gapMap[gap]
    ].join(" ");

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
