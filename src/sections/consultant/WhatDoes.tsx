"use client";
import Image from "next/image";
import SideByTwoLayout from "@/src/components/layouts/SideByTwoLayout";
import { useI18n } from "@/src/i18n/context";

export default function WhatDoes() {
  const { t } = useI18n();
  const wd = t.consultant.whatDoes;
  return (
    <SideByTwoLayout
      imagePosition="right"
      gap="medium"
      margin="medium"
      leftContent={
        <div className="flex flex-col items-start">
          <h2 className="text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-6xl leading-tight font-[500]">
            {wd.titleLine1} <br />{wd.titleLine2}
          </h2>
          <p className="mt-6 md:mt-8 text-black text-[13px] sm:text-[15px] md:text-lg leading-relaxed">
            {wd.p1}
          </p>
          <p className="mt-6 md:mt-8 text-black text-[13px] sm:text-[15px] md:text-lg leading-relaxed whitespace-pre-line">
            {wd.p2}
          </p>
        </div>
      }
      rightContent={
        <div className="relative aspect-square w-full overflow-hidden rounded-[20px]">
          <Image src="/images/whatDoesImg.jpg" alt="VHS Digitization" fill className="object-cover" />
        </div>
      }
    />
  );
}
