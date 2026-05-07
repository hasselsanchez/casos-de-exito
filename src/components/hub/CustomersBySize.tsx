"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { articles } from "@/lib/articles";

type SizeKey = "startup" | "growth" | "enterprise";

const ORDER: SizeKey[] = ["startup", "growth", "enterprise"];

const REPRESENTATIVE: Record<SizeKey, string> = {
  startup: "makora",
  growth: "doto",
  enterprise: "sears",
};

const SOLUTION_LOGOS: Record<string, string> = {
  "T1 Tienda": "/logos/t1tienda.svg",
  "T1 Envíos": "/logos/t1envios.svg",
  "T1 Pagos": "/logos/t1pagos.svg",
  T1Score: "/logos/t1score.svg",
};

/** Per-logo placement on the image — widths tuned so every brand renders at
   ~28px visual height for consistent editorial weight. */
const PARTNER_LOGO: Record<
  string,
  { w: string; h?: string; size?: string; pos?: string }
> = {
  "Sears México": { w: "w-[116px]", h: "h-[28px]" },
  Doto: { w: "w-[72px]", h: "h-[28px]" },
  Makora: { w: "w-[88px]", h: "h-[28px]", size: "auto 155%", pos: "left bottom" },
  PASE: { w: "w-[64px]", h: "h-[28px]" },
  Sesen: { w: "w-[96px]", h: "h-[28px]" },
  "Círculo de Crédito": {
    w: "w-[120px]",
    h: "h-[32px]",
    size: "100% auto",
    pos: "left 45%",
  },
};

/**
 * "Por tamaño" — own section. Tabs (Startup / Growth / Enterprise) swap a
 * representative case. Image left, content right (metrics → solutions →
 * brief pull-quote). Company logo overlays the image directly in white,
 * no pill or background.
 */
export default function CustomersBySize() {
  const t = useTranslations("customers");
  const locale = useLocale() as "es" | "en";
  const [active, setActive] = useState<SizeKey>("startup");

  const article = articles.find((a) => a.slug === REPRESENTATIVE[active]);
  if (!article) return null;

  const slug = locale === "en" ? article.slugEn : article.slug;
  const caseHref = `/${locale}/casos-de-exito/${slug}`;
  const cfg = PARTNER_LOGO[article.company] ?? { w: "w-[88px]" };

  const labelFor = (k: SizeKey) =>
    k === "startup"
      ? t("segmentStartup")
      : k === "growth"
        ? t("segmentGrowth")
        : t("segmentEnterprise");

  const readFullCase =
    locale === "es" ? "Leer el caso completo" : "Read the full case";

  return (
    <section id="por-tamano" className="bg-white py-16 tablet:py-20">
      <div className="mx-auto max-w-[1100px] px-5 tablet:px-8">
        {/* ── Section header ── */}
        <div data-animate className="max-w-[600px]">
          <h2 className="font-sora text-[22px] leading-[1.2] font-light tracking-[-0.01em] text-[#0A0B10] tablet:text-[26px]">
            {t("title")}
            <span className="text-[#E26153]">{t("titleAccent")}</span>
          </h2>
        </div>

        {/* ── Pills ── */}
        <div
          data-animate
          className="mt-6 flex flex-wrap items-center gap-1.5"
        >
          {ORDER.map((k) => {
            const isActive = active === k;
            return (
              <button
                key={k}
                type="button"
                onClick={() => setActive(k)}
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

        {/* ── Showcase ── */}
        <div
          key={active}
          className="mt-8 grid animate-fade-in-up grid-cols-1 gap-x-10 gap-y-7 tablet:mt-10 tablet:grid-cols-[1.15fr_1fr] tablet:gap-x-12"
        >
          {/* ── Image with white logo overlay (no pill) ── */}
          <Link
            href={caseHref}
            className="group relative block overflow-hidden rounded-[10px]"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={article.heroImage}
                alt={article.company}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 580px"
              />

              {/* Soft top + bottom gradients for white overlay legibility */}
              <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/35 via-black/8 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

              {/* Logo — white, INSIDE image, no pill, top-left */}
              <div className="absolute top-5 left-5 tablet:top-6 tablet:left-6">
                <span
                  role="img"
                  aria-label={article.company}
                  className={`block ${cfg.h ?? "h-7"} ${cfg.w} bg-no-repeat brightness-0 invert`}
                  style={{
                    backgroundImage: `url(${article.logoSrc})`,
                    backgroundSize: cfg.size ?? "contain",
                    backgroundPosition: cfg.pos ?? "left center",
                  }}
                />
              </div>

              {/* Title overlay — bottom-left */}
              <div className="absolute inset-x-0 bottom-0 p-5 tablet:p-6">
                <h3 className="max-w-[440px] font-sora text-[16px] leading-[1.3] font-light tracking-[-0.005em] text-white tablet:text-[18px]">
                  {article.title[locale]}
                </h3>
              </div>

              {/* Video badge — top-right */}
              {article.contentType === "video" && (
                <span className="absolute top-5 right-5 inline-flex h-6 items-center gap-1.5 rounded-full bg-white/90 px-3 font-inter text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0A0B10] backdrop-blur-sm tablet:top-6 tablet:right-6">
                  <svg width="6" height="6" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="6,4 20,12 6,20" />
                  </svg>
                  {locale === "es" ? "Video" : "Watch"}
                </span>
              )}
            </div>
          </Link>

          {/* ── Right column: metrics → industry/size → solutions → brief quote ── */}
          <div className="flex flex-col">
            {/* 1. Datos duros */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {article.metrics.slice(0, 2).map((m) => (
                <div key={m.value.es}>
                  <p className="font-inter text-[24px] leading-[1] font-bold tracking-[-0.015em] text-gray-900 tablet:text-[26px]">
                    {m.value[locale]}
                  </p>
                  <p className="mt-2 font-inter text-[11.5px] leading-[1.45] text-gray-500">
                    {m.label[locale]}
                  </p>
                </div>
              ))}
            </div>

            {/* 2. Industria + Tamaño con íconos */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2.5">
              <span className="inline-flex items-center gap-2 font-inter text-[13px] text-gray-700">
                <IndustryIcon />
                {article.industry[locale]}
              </span>
              <span className="inline-flex items-center gap-2 font-inter text-[13px] text-gray-700">
                <SizeIcon size={article.size} />
                {labelFor(article.size as SizeKey)}
              </span>
            </div>

            {/* 3. Soluciones utilizadas */}
            <div className="mt-6 border-t border-gray-200 pt-5">
              <p className="font-inter text-[10.5px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                {t("productsUsed")}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-3">
                {article.solutions.map((sol) => {
                  const logo = SOLUTION_LOGOS[sol];
                  if (!logo) return null;
                  return (
                    <Image
                      key={sol}
                      src={logo}
                      alt={sol}
                      width={120}
                      height={32}
                      className="h-6 w-auto object-contain"
                    />
                  );
                })}
              </div>
            </div>

            {/* 4. Quote MUY breve */}
            <div className="mt-6 border-t border-gray-200 pt-5">
              <p className="font-inter text-[14px] leading-[1.5] font-normal italic text-gray-700 tablet:text-[15px]">
                &ldquo;{article.quote.short[locale]}&rdquo;
              </p>
              <p className="mt-2.5 font-inter text-[11px] font-medium tracking-[0.03em] text-gray-600">
                {article.quote.author}
                <span className="text-gray-400">
                  {" "}
                  · {article.quote.role[locale]}
                </span>
              </p>
            </div>

            {/* CTA */}
            <Link
              href={caseHref}
              className="group mt-7 inline-flex items-center gap-2 self-start font-inter text-[12.5px] font-semibold text-[#0A0B10]"
            >
              <span className="border-b border-[#0A0B10]/35 pb-0.5 transition-colors group-hover:border-[#0A0B10]">
                {readFullCase}
              </span>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              >
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function IndustryIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-[#E26153]"
      aria-hidden="true"
    >
      <path d="M3 21h18" />
      <path d="M5 21V7l8-4v18" />
      <path d="M19 21V11l-6-4" />
      <path d="M9 9h.01" />
      <path d="M9 12h.01" />
      <path d="M9 15h.01" />
      <path d="M9 18h.01" />
    </svg>
  );
}

function SizeIcon({ size }: { size: SizeKey }) {
  if (size === "startup") {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0 text-[#E26153]"
        aria-hidden="true"
      >
        <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    );
  }
  if (size === "growth") {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0 text-[#E26153]"
        aria-hidden="true"
      >
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    );
  }
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-[#E26153]"
      aria-hidden="true"
    >
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  );
}
