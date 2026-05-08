"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { articles } from "@/lib/articles";

type SolutionKey = "tienda" | "pagos" | "envios" | "score";

const ORDER: SolutionKey[] = ["tienda", "pagos", "envios", "score"];

const SOLUTION_LABEL: Record<SolutionKey, string> = {
  tienda: "T1 Tienda",
  pagos: "T1 Pagos",
  envios: "T1 Envíos",
  score: "T1 Score",
};

const REPRESENTATIVE: Record<SolutionKey, string> = {
  tienda: "makora",
  pagos: "pase",
  envios: "doto",
  score: "circulo-de-credito",
};

/** Per-logo placement on the image — widths tuned so every brand renders at
   ~28px visual height for consistent editorial weight. */
const PARTNER_LOGO: Record<
  string,
  { w: string; h?: string; size?: string; pos?: string }
> = {
  "Sears México": { w: "w-[116px]", h: "h-[28px]" },
  Doto: { w: "w-[72px]", h: "h-[28px]" },
  Makora: { w: "w-[154px]", h: "h-[28px]" },
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
 * "Por solución" — own section. Tabs (T1 Tienda / Pagos / Envíos / Score)
 * swap a representative case for each T1 product. Image left, content right
 * (industry kicker → ONE hero metric → quote → CTA). The active pill itself
 * communicates which T1 product the case used, so no in-column credits.
 */
export default function CustomersBySize() {
  const t = useTranslations("customers");
  const locale = useLocale() as "es" | "en";
  const [active, setActive] = useState<SolutionKey>("tienda");

  const article = articles.find((a) => a.slug === REPRESENTATIVE[active]);
  if (!article) return null;

  const slug = locale === "en" ? article.slugEn : article.slug;
  const caseHref = `/${locale}/casos-de-exito/${slug}`;
  const cfg = PARTNER_LOGO[article.company] ?? { w: "w-[88px]" };

  const readFullCase =
    locale === "es" ? "Leer el caso completo" : "Read the full case";

  return (
    <section id="por-solucion" className="bg-white py-16 tablet:py-20">
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
                {SOLUTION_LABEL[k]}
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
                style={{ objectPosition: article.heroImageFocal ?? "center" }}
                sizes="(max-width: 768px) 100vw, 580px"
              />

              {/* Soft top + bottom gradients for white overlay legibility.
                 heroPreviewDarken bumps the top gradient when the photo's
                 environment has competing white branding (e.g. Makora wall). */}
              <div
                className={
                  article.heroPreviewDarken
                    ? "absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/70 via-black/30 to-transparent"
                    : "absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/35 via-black/8 to-transparent"
                }
              />
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

          {/* ── Right column: editorial hierarchy ──
              1. Industry kicker (section label)
              2. ONE hero metric (the lead — biggest visual weight)
              3. Quote (human voice — medium weight)
              4. CTA */}
          <div className="flex flex-col">
            {/* 1. Industry kicker — magazine-style section label */}
            <p className="font-inter text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E26153]">
              {article.industry[locale]}
            </p>

            {/* 2. ONE hero metric — the lead */}
            {article.metrics[0] && (
              <div className="mt-6">
                <p className="font-sora text-[44px] leading-[1] font-light tracking-[-0.025em] text-[#0A0B10] tablet:text-[52px]">
                  {article.metrics[0].value[locale]}
                </p>
                <p className="mt-3 max-w-[280px] font-inter text-[12.5px] leading-[1.45] text-gray-500">
                  {article.metrics[0].label[locale]}
                </p>
              </div>
            )}

            {/* 3. Quote — the human truth */}
            <blockquote className="mt-8 border-l border-gray-200 pl-5">
              <p className="font-sora text-[16px] leading-[1.5] font-light text-gray-800 tablet:text-[17px]">
                &ldquo;{article.quote.short[locale]}&rdquo;
              </p>
              <footer className="mt-3 font-inter text-[11px] text-gray-500">
                {article.quote.author}
                <span className="mx-1.5 text-gray-300">·</span>
                {article.quote.role[locale]}
              </footer>
            </blockquote>

            {/* 4. CTA — solution context already lives in the active pill above */}
            <Link
              href={caseHref}
              className="group mt-7 inline-flex items-center gap-1.5 self-start font-inter text-[12px] font-medium text-[#E26153] transition-opacity hover:opacity-70"
            >
              {readFullCase}
              <svg
                width="12"
                height="12"
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

