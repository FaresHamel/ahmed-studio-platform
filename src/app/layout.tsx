import type { Metadata } from "next";
import "./globals.css";
import { poppins, playfair, amiri } from "@/src/lib/fonts";
import { I18nProvider } from "@/src/i18n/context";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export const metadata: Metadata = {
  title: "Ahmed Studio",
  description: "Ahmed Studio is a software development company specializing in building high-quality web applications and services. We are dedicated to delivering innovative solutions that meet the unique needs of our clients.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body
        className={`
          ${poppins.variable}
          ${playfair.variable}
          ${amiri.variable}
          antialiased
        `}
      >
        <I18nProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
