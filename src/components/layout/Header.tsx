"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";
import { NAV_LINKS, SIGNUP_URL, T1_HOME_URL } from "@/lib/constants";

/**
 * Moody header.
 *  - Over the red/dark hero (scroll < 40px): darker tinted glass so the
 *    white text stays legible against the variable gradient. White text +
 *    light pill CTA.
 *  - Scrolled past the hero: white glass with dark text + black pill.
 */
export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale() as "es" | "en";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = NAV_LINKS[locale];

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 h-[60px] transition-all duration-300 tablet:h-[68px] ${
        scrolled
          ? "border-b border-gray-200/60 bg-white/90 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl"
          : "border-b border-transparent bg-white/0"
      }`}
    >
      <div className="mx-auto flex h-full max-w-[1100px] items-center justify-between px-5 tablet:px-8">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/logos/T1.svg"
            alt="T1"
            width={44}
            height={42}
            className="h-[32px] w-auto tablet:h-[36px]"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 tablet:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-inter text-[12px] font-medium text-[#0A0B10]/75 transition-colors hover:text-[#0A0B10]"
            >
              {link.label}
            </a>
          ))}

          <span aria-hidden className="h-3.5 w-px bg-gray-200" />

          <LanguageSwitcher />

          <a
            href={SIGNUP_URL}
            className="font-inter text-[12px] font-medium text-[#0A0B10]/75 transition-colors hover:text-[#0A0B10]"
          >
            {t("login")}
          </a>

          {/* CTA pill */}
          <a
            href={T1_HOME_URL}
            className="group inline-flex h-9 items-center gap-1.5 rounded-full bg-[#0A0B10] px-4 font-inter text-[12px] font-semibold text-white transition-all duration-300 hover:bg-[#0A0B10]/85"
          >
            {t("cta")}
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center text-[#0A0B10] transition-colors tablet:hidden"
          aria-label="Menu"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            {mobileOpen ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M4 7h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu — always white panel for legibility */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-5 py-6 tablet:hidden">
          <nav className="flex flex-col gap-4">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-inter text-[13px] font-medium text-[#0A0B10]"
              >
                {link.label}
              </a>
            ))}
            <a
              href={SIGNUP_URL}
              className="font-inter text-[13px] font-medium text-[#0A0B10]"
            >
              {t("login")}
            </a>
            <LanguageSwitcher />
            <a
              href={T1_HOME_URL}
              className="mt-2 inline-flex h-10 items-center justify-center rounded-full bg-[#0A0B10] font-inter text-[12.5px] font-semibold text-white"
            >
              {t("cta")}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
