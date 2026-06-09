import type { Metadata } from "next";
import "./globals.css";

import { cookies } from "next/headers";

import { poppins, playfair, amiri } from "@/src/lib/fonts";
import { I18nProvider } from "@/src/i18n/context";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

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
        <I18nProvider initialLanguage={language}>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
