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
  const hasLeft = !!leftContent;
  const hasRight = !!rightContent;
  const isSingleContent = !hasLeft || !hasRight;

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
    <div
      className={`w-full flex flex-col lg:flex-row items-center justify-center ${marginClass} ${
        !isSingleContent ? gapClass : ""
      }`}
    >
      {/* Left Content Wrapper */}
      {hasLeft && (
        <div
          className={`w-full transition-all duration-300 ${
            isSingleContent
              ? "w-full max-w-4xl text-center flex flex-col items-center justify-center mx-auto"
              : `lg:w-[50%] ${leftOrder}`
          }`}
        >
          {/* We inject an isCentered prop so your inner content knows to center its text/buttons */}
          {React.isValidElement(leftContent)
            ? React.cloneElement(leftContent as React.ReactElement<any>, {
                isCentered: isSingleContent
              })
            : leftContent}
        </div>
      )}

      {/* Right Content Wrapper */}
      {hasRight && (
        <div
          className={`w-full transition-all duration-300 ${
            isSingleContent
              ? "w-full max-w-4xl text-center flex flex-col items-center justify-center mx-auto"
              : `lg:w-[50%] ${rightOrder}`
          }`}
        >
          {React.isValidElement(rightContent)
            ? React.cloneElement(rightContent as React.ReactElement<any>, {
                isCentered: isSingleContent
              })
            : rightContent}
        </div>
      )}
    </div>
  );
}
