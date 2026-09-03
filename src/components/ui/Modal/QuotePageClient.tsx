"use client";
import { useRouter } from "next/navigation";
import { useI18n } from "@/i18n/context";
import QuoteModal from "./QuoteModal";

export default function QuotePageClient() {
  const router = useRouter();
  const { language } = useI18n();
  const isRtl = language === "ar";

  return (
    <>
      {/* Background section — fills the space behind the modal so Navbar/Footer
          don't sit right next to each other with nothing in between */}
      <div className="min-h-[80vh] w-full bg-gradient-to-b from-[#F7F1EC] to-white flex items-center justify-center px-6 py-20 text-center">
        <div className="max-w-lg">
          <h1 className="text-[#5C3A21] text-3xl sm:text-4xl font-semibold mb-4">
            {isRtl ? "احصل على عرض سعر مخصص" : "Get a Personalized Quote"}
          </h1>
          <p className="text-black/60 text-base leading-relaxed">
            {isRtl
              ? "أخبرنا بتفاصيل طلبك وسنعاود التواصل معك بعرض سعر مناسب في أقرب وقت ممكن."
              : "Tell us about your request and we'll get back to you with a tailored quote as soon as possible."}
          </p>
        </div>
      </div>

      {/* Modal overlay on top of the background above */}
      <QuoteModal isOpen={true} onClose={() => router.push("/")} />
    </>
  );
}
