"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FOOTER_LINKS, SOCIAL_LINKS } from "@/lib/constants";
import { usePathname, useRouter } from "@/i18n/routing";

const LOCALE_OPTIONS = [
  { locale: "es", flag: "🇲🇽", label: "Español (México)" },
  { locale: "en", flag: "🇺🇸", label: "English (USA)" },
] as const;

function LocaleSelector() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const current =
    LOCALE_OPTIONS.find((o) => o.locale === locale) ?? LOCALE_OPTIONS[0];

  const switchLocale = (newLocale: string) => {
    setOpen(false);
    if (newLocale === locale) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.replace({ pathname, params } as any, {
      locale: newLocale,
      scroll: true,
    });
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2 font-inter text-micro text-[#9CA3AF] transition-colors hover:text-white"
      >
        <span aria-hidden="true">{current.flag}</span>
        <span>{current.label}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M3 4.5l3 3 3-3" />
        </svg>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute bottom-full left-0 z-10 mb-2 min-w-[180px] overflow-hidden rounded-[10px] border border-white/[0.12] bg-[#1A1F2E] py-1 shadow-[0px_4px_8px_rgba(0,0,0,0.4)]"
        >
          {LOCALE_OPTIONS.map((option) => (
            <li key={option.locale}>
              <button
                type="button"
                role="option"
                aria-selected={option.locale === locale}
                onClick={() => switchLocale(option.locale)}
                className={`flex w-full items-center gap-2 px-4 py-2 text-left font-inter text-micro transition-colors hover:bg-white/[0.08] ${
                  option.locale === locale ? "text-white" : "text-[#9CA3AF]"
                }`}
              >
                <span aria-hidden="true">{option.flag}</span>
                <span>{option.label}</span>
                {option.locale === locale && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                    className="ml-auto text-[#E26153]"
                  >
                    <path d="M2.5 6.5l2.5 2.5 4.5-5" />
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const SOCIAL_ICONS: Record<string, ReactNode> = {
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07c-1.28.06-2.15.26-2.91.55-.79.31-1.46.72-2.13 1.39A5.88 5.88 0 0 0 .62 4.14c-.3.76-.5 1.63-.55 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.28.26 2.15.55 2.91.31.79.72 1.46 1.39 2.13a5.88 5.88 0 0 0 2.13 1.39c.76.3 1.63.5 2.91.55C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.28-.06 2.15-.26 2.91-.55a5.88 5.88 0 0 0 2.13-1.39 5.88 5.88 0 0 0 1.39-2.13c.3-.76.5-1.63.55-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.28-.26-2.15-.55-2.91a5.88 5.88 0 0 0-1.39-2.13A5.88 5.88 0 0 0 19.86.62c-.76-.3-1.63-.5-2.91-.55C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817-5.965 6.817H1.68l7.73-8.835L1.254 2.25h6.83l4.713 6.231 5.447-6.231zm-1.16 17.52h1.834L7.084 4.126H5.117l11.967 15.644z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.02 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.09 24 18.09 24 12.07z" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.74a8.16 8.16 0 0 0 4.77 1.52V6.81a4.85 4.85 0 0 1-1.84-.12z" />
    </svg>
  ),
};

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="relative bg-black">
        <div className="mx-auto max-w-[1018px] px-5 py-16 tablet:px-6 tablet:py-16">
          <div className="grid grid-cols-1 gap-10 tablet:grid-cols-3">
            {/* Column 1: Logo + Tagline + Social */}
            <div>
              <Image
                src="/logos/T1.svg"
                alt="T1"
                width={44}
                height={42}
                className="h-10 w-auto brightness-0 invert"
              />
              <p className="mt-5 max-w-[260px] font-inter text-[13px] leading-relaxed text-[#9CA3AF]">
                {t("tagline")}
              </p>
              <div className="mt-6 flex gap-2">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.08] text-[#9CA3AF] transition-colors hover:bg-white/[0.16] hover:text-white"
                    aria-label={social.name}
                  >
                    <span className="block h-3.5 w-3.5">
                      {SOCIAL_ICONS[social.icon]}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Solutions */}
            <div>
              <h4 className="font-inter text-[11px] font-semibold uppercase tracking-wider text-white">
                {t("solutions")}
              </h4>
              <ul className="mt-4 space-y-3">
                {FOOTER_LINKS.solutions.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="font-inter text-[13px] text-[#9CA3AF] transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Company */}
            <div>
              <h4 className="font-inter text-[11px] font-semibold uppercase tracking-wider text-white">
                {t("company")}
              </h4>
              <ul className="mt-4 space-y-3">
                <li>
                  <a
                    href="https://t1.com/mx/que-es-t1"
                    className="font-inter text-[13px] text-[#9CA3AF] transition-colors hover:text-white"
                  >
                    {t("whatIsT1")}
                  </a>
                </li>
                <li>
                  <a
                    href="https://t1.com/mx/partners"
                    className="font-inter text-[13px] text-[#9CA3AF] transition-colors hover:text-white"
                  >
                    {t("joinT1")}
                  </a>
                </li>
                <li>
                  <Link
                    href="/"
                    className="font-inter text-[13px] text-[#9CA3AF] transition-colors hover:text-white"
                  >
                    {t("successStories")}
                  </Link>
                </li>
                <li>
                  <a
                    href="https://t1.com/mx/contacto"
                    className="font-inter text-[13px] text-[#9CA3AF] transition-colors hover:text-white"
                  >
                    {t("contact")}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 tablet:flex-row">
            <LocaleSelector />
            <div className="flex gap-4">
              <a
                href="#"
                className="font-inter text-micro text-[#9CA3AF] transition-colors hover:text-white"
              >
                {t("terms")}
              </a>
              <span className="text-gray-700">|</span>
              <a
                href="#"
                className="font-inter text-micro text-[#9CA3AF] transition-colors hover:text-white"
              >
                {t("privacy")}
              </a>
            </div>
            <span className="font-inter text-micro text-[#9CA3AF]">
              {t("rights")}
            </span>
          </div>
        </div>
    </footer>
  );
}
