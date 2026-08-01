"use client";
import SimpleInfoSection from "@/components/sections/SimpleInfoSection";
import { useI18n } from "@/i18n/context";

export default function CoreServicesConsultationSection() {
  const { t } = useI18n();
  return (
    <SimpleInfoSection
      title={t.consultant.coreServices.title}
      description={t.consultant.coreServices.description}
    />
  );
}
