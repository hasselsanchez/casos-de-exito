"use client";

import { useState, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { articles, type Article } from "@/lib/articles";

type SizeKey = "all" | "startup" | "growth" | "enterprise";

const SIZE_FILTERS: SizeKey[] = ["all", "startup", "growth", "enterprise"];

/* Per-logo height for the centered-logo card layout. Wider wordmarks (Makora,
   Sears) get a smaller height so the bounding box stays in line with the more
   compact ones; taller-friendly marks (PASE, Doto) get a bit more presence. */
const CENTERED_LOGO: Record<string, string> = {
  "Sears México": "h-[36px]",
  Doto: "h-[44px]",
  Makora: "h-[28px]",
  PASE: "h-[48px]",
  Sesen: "h-[40px]",
  "Círculo de Crédito": "h-[44px]",
};

/* Per-article hover gradient. Two source files for now (blue / red) — cycled
   across the six cases until the rest land. Swap paths per slug as new
   gradient images are dropped into /public/images/gradients/. */
const CARD_GRADIENT: Record<string, string> = {
  "circulo-de-credito": "/images/gradients/blue.jpg",
  doto: "/images/gradients/red.jpg",
  makora: "/images/gradients/blue.jpg",
  pase: "/images/gradients/red.jpg",
  sears: "/images/gradients/blue.jpg",
  sesen: "/images/gradients/red.jpg",
};

/**
 * "Todos los casos" — own section. Filterable grid of every article.
 * White cards with hairline borders, image-on-top with white-logo overlay,
 * brand-color metric below.
 */
export default function ArticleFeed() {
  const t = useTranslations("filters");
  const tExplore = useTranslations("explore");
  const tCustomers = useTranslations("customers");
  const locale = useLocale() as "es" | "en";
  const [activeSize, setActiveSize] = useState<SizeKey>("all");

  const filtered = useMemo(
    () =>
      activeSize === "all"
        ? articles
        : articles.filter((a) => a.size === activeSize),
    [activeSize]
  );

  const labelFor = (k: SizeKey) => {
    if (k === "all") return locale === "es" ? "Todos" : "All";
    if (k === "startup") return tCustomers("segmentStartup");
    if (k === "growth") return tCustomers("segmentGrowth");
    return tCustomers("segmentEnterprise");
  };

  return (
    <section id="explorar" className="bg-white py-16 tablet:py-20">
      <div className="mx-auto max-w-[1100px] px-5 tablet:px-8">
        {/* ── Section header ── */}
        <div data-animate className="max-w-[600px]">
          <h2 className="font-sora text-[22px] leading-[1.2] font-light tracking-[-0.01em] text-[#0A0B10] tablet:text-[26px]">
            {tExplore("title")}
            <span className="text-[#E26153]">{tExplore("titleAccent")}</span>
          </h2>
        </div>

        {/* ── Filter pills + count ── */}
        <div
          data-animate
          className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2"
        >
          <div className="flex flex-wrap gap-1.5">
            {SIZE_FILTERS.map((k) => {
              const isActive = activeSize === k;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setActiveSize(k)}
                  className={`rounded-full px-3.5 py-1.5 font-inter text-[12px] font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-[#0A0B10] text-white"
                      : "border border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:text-[#0A0B10]"
                  }`}
                >
                  {labelFor(k)}
                </button>
              );
            })}
          </div>
          <span className="ml-auto font-inter text-[11px] tabular-nums text-gray-400">
            {filtered.length}{" "}
            {filtered.length === 1
              ? tCustomers("caseSingular")
              : tCustomers("casePlural")}
          </span>
        </div>

        {/* ── Grid ── */}
        {filtered.length > 0 ? (
          <div
            key={activeSize}
            className="mt-8 grid grid-cols-1 gap-5 tablet:mt-10 tablet:grid-cols-2 tablet:gap-6 desktop:grid-cols-3"
          >
            {filtered.map((article, i) => (
              <FeedCard
                key={article.slug}
                article={article}
                locale={locale}
                index={i}
              />
            ))}
          </div>
        ) : (
          <div className="mt-12 text-center">
            <p className="font-inter text-[13px] text-gray-500">
              {t("noResults")}
            </p>
            <button
              onClick={() => setActiveSize("all")}
              className="mt-3 font-inter text-[12px] font-medium text-[#E26153] hover:underline"
            >
              {t("clear")}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Logo-forward card                                           */
/*  Default: pale neutral bg, brand mark centered, industry tag */
/*  top-left, title bottom. Hover swaps to a full-bleed gradient*/
/*  with white logo + title and a circular ↗ pill top-right.    */
/* ─────────────────────────────────────────────────────────── */
function FeedCard({
  article,
  locale,
  index = 0,
}: {
  article: Article;
  locale: "es" | "en";
  index?: number;
}) {
  const slug = locale === "en" ? article.slugEn : article.slug;
  const href = `/${locale}/casos-de-exito/${slug}`;
  const logoH = CENTERED_LOGO[article.company] ?? "h-[40px]";
  const gradient = CARD_GRADIENT[article.slug];

  return (
    <Link
      href={href}
      className="group relative flex aspect-[5/4] flex-col overflow-hidden rounded-[14px] bg-[#F4F4F2] opacity-0 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_48px_-20px_rgba(10,11,16,0.22)]"
      style={{
        animation: `fade-in-up 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${index * 70}ms forwards`,
      }}
    >
      {/* Hover gradient layer — fades in over the neutral bg. */}
      {gradient && (
        <Image
          src={gradient}
          alt=""
          fill
          aria-hidden
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      )}

      {/* Industry tag — top-left, ○ + label */}
      <div className="relative z-10 flex items-center gap-2 p-5 tablet:p-6">
        <span className="block h-[9px] w-[9px] rounded-full border border-gray-400 transition-colors duration-500 group-hover:border-white/70" />
        <span className="font-inter text-[11.5px] font-medium text-gray-500 transition-colors duration-500 group-hover:text-white/80">
          {article.industry[locale]}
        </span>
      </div>

      {/* Arrow pill — top-right, hover only */}
      <span className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0A0B10] opacity-0 transition-all duration-300 ease-out group-hover:opacity-100 tablet:top-5 tablet:right-5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>

      {/* Centered logo — crossfades between full-color and white on hover.
         Two stacked layers (rather than `transition: filter`) so the swap
         is smooth in every browser. */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-6">
        <div className="relative w-full max-w-[68%]">
          {/* Default — full-color */}
          <span
            role="img"
            aria-label={article.company}
            className={`block ${logoH} w-full bg-no-repeat bg-center transition-opacity duration-500 group-hover:opacity-0`}
            style={{
              backgroundImage: `url(${article.logoSrc})`,
              backgroundSize: "contain",
            }}
          />
          {/* Hover — white */}
          <span
            aria-hidden
            className={`pointer-events-none absolute inset-0 ${logoH} w-full bg-no-repeat bg-center opacity-0 brightness-0 invert transition-opacity duration-500 group-hover:opacity-100`}
            style={{
              backgroundImage: `url(${article.logoSrc})`,
              backgroundSize: "contain",
            }}
          />
        </div>
      </div>

      {/* Title — bottom, color-shifts to white on hover */}
      <div className="relative z-10 p-5 tablet:p-6">
        <h3 className="font-sora text-[13px] font-semibold leading-[1.35] tracking-[-0.005em] text-[#0A0B10] transition-colors duration-500 group-hover:text-white tablet:text-[14px]">
          {article.title[locale]}
        </h3>
      </div>
    </Link>
  );
}
