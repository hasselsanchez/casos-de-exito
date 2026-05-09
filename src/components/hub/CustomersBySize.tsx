"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { articles } from "@/lib/articles";
import { SOLUTION_META } from "@/lib/constants";

type SolutionKey = "tienda" | "pagos" | "envios" | "score";

const ORDER: SolutionKey[] = ["tienda", "pagos", "envios", "score"];

/* These labels MUST match the keys in SOLUTION_META so the meta lookup
   resolves. T1Score is one word per the brand guide; the rest have a space. */
const SOLUTION_LABEL: Record<SolutionKey, string> = {
  tienda: "T1 Tienda",
  pagos: "T1 Pagos",
  envios: "T1 Envíos",
  score: "T1Score",
};

const REPRESENTATIVE: Record<SolutionKey, string> = {
  tienda: "makora",
  pagos: "pase",
  envios: "doto",
  score: "circulo-de-credito",
};

/** Per-logo visual height tuning for the T1 product marks. The t1pagos SVG
   has a viewBox 16% taller than the others, so a single height class makes it
   read smaller. These overrides equalize optical weight in the rotation strip. */
const PRODUCT_LOGO_HEIGHT: Record<SolutionKey, string> = {
  tienda: "h-[20px]",
  pagos: "h-[24px]",
  envios: "h-[20px]",
  score: "h-[20px]",
};

/** Auto-rotation cadence (ms). 5s is the editorial sweet spot — fast enough
   to feel alive, slow enough to read. */
const ROTATION_MS = 5000;

/** Cooldown after a manual click before auto-rotation resumes. */
const CLICK_COOLDOWN_MS = 12000;

/** Per-logo placement on the image — widths tuned so every brand renders at
   ~28px visual height for consistent editorial weight. */
const PARTNER_LOGO: Record<
  string,
  { w: string; h?: string; size?: string; pos?: string }
> = {
  "Sears México": { w: "w-[116px]", h: "h-[28px]" },
  Doto: { w: "w-[72px]", h: "h-[28px]" },
  Makora: { w: "w-[116px]", h: "h-[28px]" },
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
  /* rotationKey forces the progress-line div to remount (and the keyframe to
     restart at 0) on each cycle — including a click on the already-active
     logo, which would otherwise not change `active`. */
  const [rotationKey, setRotationKey] = useState(0);
  const [isHoveringStrip, setIsHoveringStrip] = useState(false);
  const [isInClickCooldown, setIsInClickCooldown] = useState(false);
  const cooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const paused = isHoveringStrip || isInClickCooldown;

  /* Respect prefers-reduced-motion — disables auto-rotation AND hides the
     progress line for users who opt out of motion. They can still click
     logos to navigate. State (not ref) so the JSX reacts to it. */
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* Auto-rotation. Restarts the timer on every `paused` toggle so hovering
     halts the cycle and leaving resumes it from a fresh ROTATION_MS window.
     We deliberately do NOT bump rotationKey here — during a click cooldown
     the progress bar should fill once and then sit at 100% (CSS `forwards`)
     until the cooldown ends; only the next setInterval tick advances. */
  useEffect(() => {
    if (paused) return;
    if (reducedMotion) return;
    const id = setInterval(() => {
      setActive((prev) => ORDER[(ORDER.indexOf(prev) + 1) % ORDER.length]);
      setRotationKey((k) => k + 1);
    }, ROTATION_MS);
    return () => clearInterval(id);
  }, [paused, reducedMotion]);

  /* Cleanup the click-cooldown timer on unmount. */
  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    };
  }, []);

  const handleLogoClick = (k: SolutionKey) => {
    setActive(k);
    setRotationKey((rk) => rk + 1);
    setIsInClickCooldown(true);
    if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    /* When the cooldown ends, cycle to the next solution immediately rather
       than waiting another full ROTATION_MS — otherwise the clicked logo
       sits "selected" for cooldown + interval, which feels too long. */
    cooldownTimerRef.current = setTimeout(() => {
      setIsInClickCooldown(false);
      setActive((prev) => ORDER[(ORDER.indexOf(prev) + 1) % ORDER.length]);
      setRotationKey((rk) => rk + 1);
    }, CLICK_COOLDOWN_MS);
  };

  const articleFor = (k: SolutionKey) =>
    articles.find((a) => a.slug === REPRESENTATIVE[k]);
  const activeArticle = articleFor(active);
  if (!activeArticle) return null;

  const readFullCase =
    locale === "es" ? "Leer el caso completo" : "Read the full case";

  return (
    <section id="por-solucion" className="bg-white py-16 tablet:py-20">
      <div className="mx-auto max-w-[1100px] px-5 tablet:px-8">
        {/* ── Section header ── */}
        <div data-animate className="max-w-[760px]">
          <h2 className="font-sora text-[32px] leading-[1.1] font-light tracking-[-0.015em] text-[#0A0B10] tablet:text-[44px]">
            {t("title")}
            <span className="text-[#E26153]">{t("titleAccent")}</span>
          </h2>
        </div>

        {/* ── Showcase ── */}
        <div
          data-animate
          className="mt-8 grid grid-cols-1 gap-x-10 gap-y-7 tablet:mt-10 tablet:grid-cols-[1.15fr_1fr] tablet:gap-x-12"
        >
          {/* ── Left column: image + auto-rotating logo strip ── */}
          <div>
          {/* ── Image stack with cross-fade ──
              All 4 articles render as stacked layers in the same grid cell;
              only the active layer is fully opaque & interactive. This
              eliminates unmount/remount churn and the brief flash while a
              new <Image> loads — every variant is preloaded and toggling
              the active one becomes a pure opacity cross-fade. */}
          <div className="relative grid overflow-hidden rounded-[10px]">
            {ORDER.map((k) => {
              const a = articleFor(k);
              if (!a) return null;
              const isActive = active === k;
              const aSlug = locale === "en" ? a.slugEn : a.slug;
              const aHref = `/${locale}/casos-de-exito/${aSlug}`;
              const aCfg = PARTNER_LOGO[a.company] ?? { w: "w-[88px]" };
              return (
                <Link
                  key={k}
                  href={aHref}
                  aria-hidden={!isActive}
                  tabIndex={isActive ? 0 : -1}
                  className={`group col-start-1 row-start-1 block transition-opacity duration-700 ease-out ${
                    isActive
                      ? "opacity-100"
                      : "pointer-events-none opacity-0"
                  }`}
                >
                  <div className="relative aspect-[3/2]">
                    <Image
                      src={a.heroImage}
                      alt={a.company}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      style={{ objectPosition: a.heroImageFocal ?? "center" }}
                      sizes="(max-width: 768px) 100vw, 580px"
                      priority={isActive}
                    />

                    {/* Soft top + bottom gradients for white overlay legibility.
                       heroPreviewDarken bumps the top gradient when the photo's
                       environment has competing white branding (e.g. Makora wall). */}
                    <div
                      className={
                        a.heroPreviewDarken
                          ? "absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/70 via-black/30 to-transparent"
                          : "absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/35 via-black/8 to-transparent"
                      }
                    />
                    <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

                    {/* Logo — white, INSIDE image, no pill, top-left */}
                    <div className="absolute top-5 left-5 tablet:top-6 tablet:left-6">
                      <span
                        role="img"
                        aria-label={a.company}
                        className={`block ${aCfg.h ?? "h-7"} ${aCfg.w} bg-no-repeat brightness-0 invert`}
                        style={{
                          backgroundImage: `url(${a.logoSrc})`,
                          backgroundSize: aCfg.size ?? "contain",
                          backgroundPosition: aCfg.pos ?? "left center",
                        }}
                      />
                    </div>

                    {/* Title overlay — bottom-left */}
                    <div className="absolute inset-x-0 bottom-0 p-5 tablet:p-6">
                      <h3 className="max-w-[440px] font-sora text-[16px] leading-[1.3] font-light tracking-[-0.005em] text-white tablet:text-[18px]">
                        {a.title[locale]}
                      </h3>
                    </div>

                    {/* Video badge — top-right */}
                    {a.contentType === "video" && (
                      <span className="absolute top-5 right-5 inline-flex h-6 items-center gap-1.5 rounded-full bg-white/90 px-3 font-inter text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0A0B10] backdrop-blur-sm tablet:top-6 tablet:right-6">
                        <svg width="6" height="6" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="6,4 20,12 6,20" />
                        </svg>
                        {locale === "es" ? "Video" : "Watch"}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* ── Auto-rotating T1 product logo strip ──
              Replaces the old text pills. Active logo is in color; the rest
              live in grayscale at low opacity. A 1px line above each logo
              fills left-to-right over ROTATION_MS to telegraph the cycle.
              Hover pauses the strip; clicking a logo selects it and pauses
              auto-rotation for CLICK_COOLDOWN_MS before resuming. */}
          <div
            className="mt-6 grid grid-cols-4 gap-x-3 tablet:mt-8"
            onMouseEnter={() => setIsHoveringStrip(true)}
            onMouseLeave={() => setIsHoveringStrip(false)}
          >
            {ORDER.map((k) => {
              const isActive = active === k;
              const sol = SOLUTION_LABEL[k];
              const meta = SOLUTION_META[sol];
              const heightClass = PRODUCT_LOGO_HEIGHT[k];
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => handleLogoClick(k)}
                  aria-label={sol}
                  aria-pressed={isActive}
                  className="group flex flex-col items-center"
                >
                  {/* Progress track — always present (1px), only the
                     active logo paints a red fill driven by the keyframe.
                     Hidden entirely under prefers-reduced-motion. */}
                  <div className="relative h-px w-full overflow-hidden bg-gray-100">
                    {isActive && !reducedMotion && (
                      <span
                        key={rotationKey}
                        aria-hidden
                        className="absolute inset-0 h-px origin-left animate-progress-line bg-[#E26153]"
                        style={{
                          /* Only HOVER freezes the bar at its current
                             position. During click cooldown the bar fills
                             once and then sits at 100% (forwards), which
                             reads as "you picked this — it's settled". */
                          animationPlayState: isHoveringStrip
                            ? "paused"
                            : "running",
                        }}
                      />
                    )}
                  </div>
                  {/* Logo */}
                  <div className="mt-5 flex h-6 items-center">
                    {meta && (
                      <Image
                        src={meta.logoSrc}
                        alt={sol}
                        width={140}
                        height={32}
                        className={`${heightClass} w-auto object-contain transition-all duration-500 ${
                          isActive
                            ? "opacity-100"
                            : "opacity-40 grayscale group-hover:opacity-70"
                        }`}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          </div>

          {/* ── Right column: editorial hierarchy ──
              All 4 article variants render stacked in the same grid cell —
              the column auto-sizes to the tallest variant. Only the active
              one is fully opaque and interactive; the rest fade out via
              opacity. Same pattern as the image stack on the left, so both
              halves cross-fade in lockstep. */}
          <div className="relative grid">
            {ORDER.map((k) => {
              const a = articleFor(k);
              if (!a) return null;
              const isActive = active === k;
              const aSlug = locale === "en" ? a.slugEn : a.slug;
              const aHref = `/${locale}/casos-de-exito/${aSlug}`;
              return (
                <div
                  key={k}
                  aria-hidden={!isActive}
                  className={`col-start-1 row-start-1 flex flex-col transition-opacity duration-700 ease-out ${
                    isActive
                      ? "opacity-100"
                      : "pointer-events-none opacity-0"
                  }`}
                >
                  {/* 1. Industry kicker — magazine-style section label */}
                  <p className="font-inter text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E26153]">
                    {a.industry[locale]}
                  </p>

                  {/* 2. ONE hero metric — the lead */}
                  {a.metrics[0] && (
                    <div className="mt-6">
                      <p className="font-sora text-[44px] leading-[1] font-light tracking-[-0.025em] text-[#0A0B10] tablet:text-[52px]">
                        {a.metrics[0].value[locale]}
                      </p>
                      <p className="mt-3 max-w-[280px] font-inter text-[12.5px] leading-[1.45] text-gray-500">
                        {a.metrics[0].label[locale]}
                      </p>
                    </div>
                  )}

                  {/* 3. Quote — the human truth */}
                  <blockquote className="mt-8 border-l border-gray-200 pl-5">
                    <p className="font-sora text-[16px] leading-[1.5] font-light text-gray-800 tablet:text-[17px]">
                      &ldquo;{a.quote.short[locale]}&rdquo;
                    </p>
                    <footer className="mt-3 font-inter text-[11px] text-gray-500">
                      {a.quote.author}
                      <span className="mx-1.5 text-gray-300">·</span>
                      {a.quote.role[locale]}
                    </footer>
                  </blockquote>

                  {/* 4. CTA — solution context already lives in the active pill above */}
                  <Link
                    href={aHref}
                    tabIndex={isActive ? 0 : -1}
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
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

