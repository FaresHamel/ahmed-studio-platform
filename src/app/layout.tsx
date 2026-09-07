import type { Metadata } from "next";
import "./globals.css";
import { cookies } from "next/headers";
import { ibmPlexArabic } from "@/lib/fonts";
import { I18nProvider } from "@/i18n/context";
import { Toaster } from "react-hot-toast";
import { AuthInitializer } from "@/components/providers/AuthInitializer";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const language = cookieStore.get("language")?.value === "en" ? "en" : "ar";

  return language === "ar"
    ? {
        title: "الرقمنة والتحول الرقمي | استوديو أحمد",
        description:
          "حلول متقدمة في الرقمنة والتحول الرقمي وبناء المكتبة الرقمية للشركات والمؤسسات.",
        keywords: ["الرقمنة", "التحول الرقمي", "المكتبة الرقمية"]
      }
    : {
        title: "Digitization & Digital Transformation | Ahmed Studio",
        description:
          "Advanced solutions for digitization, digital transformation, and digital library systems for organizations.",
        keywords: ["Digitization", "Digital Transformation", "Digital Library"]
      };
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  const language = cookieStore.get("language")?.value === "en" ? "en" : "ar";
  return (
    <html lang={language} dir={language === "ar" ? "rtl" : "ltr"}>
      <body
        className={`
          ${ibmPlexArabic.variable}
          antialiased
        `}
      >
        <AuthInitializer>
          <Toaster position="top-center" reverseOrder={false} />
          <I18nProvider initialLanguage={language}>{children}</I18nProvider>
        </AuthInitializer>
      </body>
    </html>
  );
}