import type { Metadata } from "next";
import "./globals.css";
import { cookies } from "next/headers";
import { poppins, playfair, amiri } from "@/lib/fonts";
import { I18nProvider } from "@/i18n/context";
import { Toaster } from "react-hot-toast";
import { AuthInitializer } from "@/components/providers/AuthInitializer";
export const metadata: Metadata = {
  title: "Ahmed Studio",
  description:
    "Ahmed Studio is a software development company specializing in building high-quality web applications and services."
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  const language = cookieStore.get("language")?.value === "ar" ? "ar" : "en";

  return (
    <html lang={language} dir={language === "ar" ? "rtl" : "ltr"}>
      <body
        className={`
          ${poppins.variable}
          ${playfair.variable}
          ${amiri.variable}
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
