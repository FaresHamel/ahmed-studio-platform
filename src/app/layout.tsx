import type { Metadata } from "next";
import "./globals.css";
import { cookies } from "next/headers";
import { ibmPlexArabic } from "@/lib/fonts";
import { I18nProvider } from "@/i18n/context";
import { Toaster } from "react-hot-toast";
import { AuthInitializer } from "@/components/providers/AuthInitializer";
import Script from "next/script";
export const metadata: Metadata = {
  verification: {
    google: "yFjGhAA3Geb2P1IykGDss3b6CKr4nn3IgTaO68L1E-I"
  }
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  const language = cookieStore.get("language")?.value === "en" ? "en" : "ar";
  return (
    <html lang={language} dir={language === "ar" ? "rtl" : "ltr"}>
      <head>
        {/* Google Analytics (GA4) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PS2T5TC1HR"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PS2T5TC1HR');
          `}
        </Script>
      </head>
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