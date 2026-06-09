"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { useI18n } from "@/src/i18n/context";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useI18n();
  const pathname = usePathname();

  const navLinks = [
    { label: t.nav.home, href: "/" },
    { label: t.nav.aboutUs, href: "/about" },
    { label: t.nav.order, href: "/order" },
    { label: t.nav.consultant, href: "/consultant" },
    { label: t.nav.cloudStorage, href: "/cloudStorage" },
    { label: t.nav.subscription, href: "/subscription" },
    { label: t.nav.ourLab, href: "/ourlab" }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white">
      <div className="w-full h-20 flex items-center justify-between px-6 md:px-16">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/images/logo.png"
            alt="Ahmed Studio"
            width={140}
            height={35}
            priority
          />
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  relative
                  font-body
                  text-sm
                  transition-all
                  duration-300
                  ${
                    isActive
                      ? "text-primary font-semibold"
                      : "text-zinc-600 hover:text-primary"
                  }
                `}
              >
                {link.label}

                {/* Active Underline */}
                {isActive && (
                  <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4 md:gap-8">
          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="
              text-sm font-medium
              px-3 py-2
              text-primary
              hover:bg-primary/10
              rounded-lg
              transition-all duration-300
              border border-primary/20
              hover:border-primary/40
              flex items-center gap-1
            "
            title={language === "en" ? "Switch to Arabic" : "Switch to English"}
          >
            <Icon icon="mdi:earth" className="text-lg" />
            <span className="hidden sm:inline text-xs">{t.nav.switchLang}</span>
          </button>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="https://op.ahmed-studio.com/login"
              target="_blank"
              rel="noopener noreferrer"
              className="
                font-body
                text-sm
                text-zinc-600
                px-5
                py-2.5
                hover:bg-primary
                hover:text-white
                transition-all
                duration-300
              "
              style={{ borderRadius: "10px" }}
            >
              {t.nav.signUp}
            </Link>
            <Link
              href="https://op.ahmed-studio.com/login"
              target="_blank"
              rel="noopener noreferrer"
              className="
                font-body
                text-sm
                text-navbarInactive
                hover:text-primary
                transition-colors
                duration-300
                text-zinc-600
              "
            >
              {t.nav.login}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-primary"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Icon
              icon={
                isOpen
                  ? "material-symbols-light:close"
                  : "material-symbols-light:menu"
              }
              fontSize={32}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-borderColor px-6 py-8">
          <div className="flex flex-col gap-6">
            {/* Mobile Navigation */}
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    font-body
                    text-lg
                    transition-colors
                    duration-300
                    ${
                      isActive
                        ? "text-primary font-semibold"
                        : "text-navbarInactive hover:text-primary"
                    }
                  `}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Mobile Actions */}
            <div className="flex flex-col gap-4 pt-4 border-t border-borderColor">
              <Link
                href="/login"
                className="
                  font-body
                  text-lg
                  font-medium
                  text-navbarInactive
                  hover:text-primary
                  transition-colors
                  duration-300
                "
              >
                {t.nav.login}
              </Link>

              <Link
                href="/signup"
                className="
                  font-body
                  text-lg
                  font-medium
                  text-primary
                  border
                  border-primary
                  rounded-full
                  py-3
                  text-center
                  hover:bg-primary
                  hover:text-white
                  transition-all
                  duration-300
                "
              >
                {t.nav.signUp}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
