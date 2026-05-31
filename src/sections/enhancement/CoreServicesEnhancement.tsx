"use client";
import SimpleInfoSection from "@/src/components/sections/SimpleInfoSection";
import { useI18n } from "@/src/i18n/context";

export default function CoreServicesEnhancement() {
  const { t } = useI18n();
  return (
    <SimpleInfoSection
      title={t.enhancement.coreServices.title}
      description={t.enhancement.coreServices.description}
      containerClassName="mt-15"
    />
  );
}
