"use client";
import SimpleInfoSection from "@/src/components/sections/SimpleInfoSection";
import { useI18n } from "@/src/i18n/context";

export default function CoreServicesConsultationSection() {
  const { t } = useI18n();
  return (
    <SimpleInfoSection
      title={t.consultant.coreServices.title}
      description={t.consultant.coreServices.description}
    />
  );
}
