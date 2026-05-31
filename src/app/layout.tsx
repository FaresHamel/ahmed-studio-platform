import type { Metadata } from "next";
import "./globals.css";
import { poppins, playfair } from "@/src/lib/fonts";
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
    <html lang="en">
      <body
        className={`
          ${poppins.variable}
          ${playfair.variable}
          antialiased
        `}
      >
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
