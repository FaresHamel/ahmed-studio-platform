import QuotePageClient from "@/components/ui/Modal/QuotePageClient";
import type { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const language = cookieStore.get("language")?.value === "en" ? "en" : "ar";

  return language === "ar"
    ? {
        title: "طلب عرض سعر | استوديو أحمد",
        description: "أرسل تفاصيل طلبك وسنتواصل معك في أقرب وقت."
      }
    : {
        title: "Request a Quote | Ahmed Studio",
        description:
          "Send us your request details and we'll get back to you shortly."
      };
}

export default function QuotePage() {
  return <QuotePageClient />;
}
