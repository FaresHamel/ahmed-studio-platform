"use client";
import React from "react";

interface SideByTwoLayoutProps {
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  imagePosition?: "left" | "right";
  gap?: "small" | "medium" | "large";
  reverseOnMobile?: boolean;
  margin?: "small" | "medium" | "large";
}

export default function SideByTwoLayout({
  leftContent,
  rightContent,
  imagePosition = "left",
  gap = "medium",
  reverseOnMobile = false,
  margin = "medium"
}: SideByTwoLayoutProps) {
  const gapClass = {
    small: "gap-4 lg:gap-8",
    medium: "gap-12 lg:gap-20",
    large: "gap-16 lg:gap-32"
  }[gap];

  const marginClass = {
    small: "my-8 md:my-12",
    medium: "my-[100px]",
    large: "my-[150px]"
  }[margin];

  const leftOrder = reverseOnMobile
    ? imagePosition === "left"
      ? "order-2 lg:order-1"
      : "order-1"
    : imagePosition === "left"
      ? "order-1"
      : "order-2 lg:order-1";

  const rightOrder = reverseOnMobile
    ? imagePosition === "right"
      ? "order-2 lg:order-1"
      : "order-1"
    : imagePosition === "right"
      ? "order-1"
      : "order-2 lg:order-1";

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 items-center ${gapClass} ${marginClass}`}>
      <div className={leftOrder}>{leftContent}</div>
      <div className={rightOrder}>{rightContent}</div>
    </div>
  );
}
