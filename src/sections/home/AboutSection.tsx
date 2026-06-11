"use client";
import Image from "next/image";
import SideByTwoLayout from "@/src/components/layouts/SideByTwoLayout";
import { useI18n } from "@/src/i18n/context";
import Link from "next/link";

export default function AboutSection() {
  const { t } = useI18n();
  return (
    <SideByTwoLayout
      imagePosition="left"
      gap="medium"
      margin="medium"
      leftContent=""
      rightContent={
        <div className="flex flex-col items-start">
          <h2 className="text-primary text-[26px] sm:text-[34px] md:text-5xl lg:text-6xl leading-tight font-[500]">
            {t.home.about.titleLine1} <br /> {t.home.about.titleLine2}
          </h2>
          <p className="mt-6 md:mt-8 text-black text-[13px] sm:text-[15px] md:text-lg leading-relaxed">
            {t.home.about.description}
          </p>
          <Link
            href={"/about"}
            className="mt-8 md:mt-10 bg-primary text-white px-8 md:px-12 py-3 md:py-4 font-[500] text-[14px] md:text-base rounded-lg hover:bg-primary/90 transition-all">
            {t.home.about.cta}
          </Link>
        </div>
      }
    />
  );
}
