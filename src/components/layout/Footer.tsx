"use client";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useI18n } from "@/src/i18n/context";
import QuoteModal from "../ui/Modal/QuoteModal";
import { useState } from "react";

const socialLinks = [
  {
    icon: "iconoir:tiktok",
    href: "https://www.tiktok.com/@ahmedstudio8",
    label: "TikTok"
  },
  {
    icon: "mdi:instagram",
    href: "https://www.instagram.com/ahmed_studio08",
    label: "Instagram"
  },
  { icon: "mdi:twitter", href: "https://x.com/ahmedstudio8", label: "Twitter" },
  {
    icon: "mdi:whatsapp",
    href: "https://wa.me/966500238627",
    label: "WhatsApp"
  }
];

const paymentMethods = [
  { icon: "mdi:apple", name: "Apple Pay" },
  { icon: "ri:visa-line", name: "Visa" },
  { icon: "arcticons:mada-pay", name: "mada" },
  { icon: "arcticons:mystc", name: "STC" },
  { icon: "fluent:building-bank-20-regular", name: "bank" },
  { icon: "logos:paypal", name: "PayPal" },
  { icon: "mdi:credit-card", name: "Card" },
  { icon: "arcticons:tabby", name: "Tabby" },
  { icon: "logos:mastercard", name: "Mastercard" }
];

interface FooterProps {
  logoSrc?: string;
  companyName?: string;
  currentYear?: number;
}

export default function Footer({
  logoSrc = "/images/logoWhite.png",
  companyName = "Ahmed Studio",
  currentYear = new Date().getFullYear()
}: FooterProps) {
  const { t } = useI18n();
  const f = t.footer;
const [isModalOpen, setIsModalOpen] = useState(false);

  const quickLinks = [
    { label: f.links.home, href: "/" },
    { label: f.links.howToOrder, href: "/order" },
    { label: f.links.consultant, href: "/consultant" },
    // { label: f.links.cloudStorage, href: "/cloudStorage" },
    { label: f.links.aboutUs, href: "/about" }
  ];

  const resourceLinks = [
    { label: f.links.services, href: "/services" },
    { label: f.links.enhancement, href: "/enhancement" },
    { label: f.links.ourLab, href: "/ourlab" },
    // { label: f.links.subscription, href: "/subscription" },
    { label: f.links.differences, href: "/differences" }
  ];

  return (
    <>
      <footer className="bg-[#2F2F2F] text-gray-100 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-14 md:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
            {/* Logo & CTA */}
            <div className="flex flex-col justify-start sm:col-span-1">
              <div className="mb-8">
                <Image
                  src={logoSrc}
                  alt="Company Logo"
                  width={340}
                  height={340}
                  priority={false}
                  className="h-24 md:h-28 w-auto"
                />
              </div>
              <button
                className="bg-white capitalize text-black font-[16px] px-6 py-3 rounded-md hover:bg-gray-50 transition-all duration-300 hover:shadow-lg active:scale-95 w-full sm:w-fit text-sm md:text-base"
                aria-label="Request a quote for our services"
                onClick={() => setIsModalOpen(true)}
              >
                {f.requestQuote}
              </button>
            </div>

            {/* Quick Links */}
            <div className="sm:col-span-1">
              <h3 className="text-white font-[500] text-[16px] md:text-lg mb-5 md:mb-6 capitalize tracking-wide">
                {f.quickLinks}
              </h3>
              <ul className="space-y-2.5 md:space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white font-[350] text-[12px] md:text-base leading-relaxed"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="sm:col-span-1">
              <h3 className="text-white font-[500] text-[16px] md:text-lg mb-5 md:mb-6 capitalize tracking-wide">
                {f.resources}
              </h3>
              <ul className="space-y-2.5 md:space-y-3">
                {resourceLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white font-[350] hover:text-white transition-colors duration-200 text-[10px] md:text-base leading-relaxed"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Support */}
            <div className="sm:col-span-1">
              <h3 className="text-white font-[500] text-[16px] md:text-lg mb-5 md:mb-6 capitalize tracking-wide">
                {f.contactSupport}
              </h3>
              <div className="flex gap-2 mb-6 md:mb-8">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit our ${social.label}`}
                    className="bg-white text-gray-900 p-2 rounded-md hover:bg-gray-100 transition-all duration-300 hover:shadow-md active:scale-90 flex items-center justify-center"
                    title={social.label}
                  >
                    <Icon icon={social.icon} width="16" height="16" />
                  </a>
                ))}
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-500 text-xs font-semibold mb-1 capitalize tracking-wider">
                    {f.phoneNumber}
                  </p>
                  <a
                    href="tel:+966500238627"
                    className="text-white hover:text-gray-300 transition-colors text-sm md:text-base font-medium break-all"
                  >
                    +966 50 023 8627
                  </a>
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-semibold mb-1 uppercase tracking-wider">
                    {f.email}
                  </p>
                  <a
                    href="mailto:old-to-new@hotmail.com"
                    className="text-white hover:text-gray-300 transition-colors text-sm md:text-base font-medium break-all"
                  >
                    old-to-new@hotmail.com
                  </a>
                </div>
                <p className="text-gray-400 text-xs md:text-sm pt-2 leading-relaxed">
                  {f.inquiries}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="border-t border-gray-800 py-8 md:py-10">
            <div className="flex flex-wrap justify-center items-center gap-3">
              {paymentMethods.map((method, index) => (
                <div
                  key={index}
                  className="bg-white text-gray-900 px-3 py-2 rounded-md flex items-center justify-center h-11 w-14 hover:shadow-md transition-shadow duration-200"
                  title={method.name}
                >
                  <Icon icon={method.icon} width="20" height="20" />
                </div>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-8 md:pt-10">
            <p className="text-center text-gray-400 text-xs md:text-sm">
              Copyright © {currentYear} {companyName}. {f.copyright}
            </p>
          </div>
        </div>
      </footer>
      <QuoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
