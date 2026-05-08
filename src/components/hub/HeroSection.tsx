"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { T1_HOME_URL } from "@/lib/constants";

const WORD_STAGGER_MS = 90;
const HEADLINE_WORD_DURATION_MS = 750;

/**
 * Minimalist editorial hero — no featured case, just a strong aspirational
 * statement about T1 as the infrastructure powering commerce in Mexico.
 */
export default function HeroSection() {
  const locale = useLocale() as "es" | "en";
  const sectionRef = useRef<HTMLElement>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setParallax({ x, y });
    };
    const handleLeave = () => setParallax({ x: 0, y: 0 });
    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  const copy = {
    headlinePre:
      locale === "es" ? "La infraestructura que hace crecer el" : "The infrastructure powering",
    headlineAccent: locale === "es" ? "comercio en México" : "commerce in Mexico",
    subhead:
      locale === "es"
        ? "De la primera venta a millones de operaciones: T1 es el ecosistema detrás de las marcas que están definiendo el futuro del comercio."
        : "From the first sale to millions of operations: T1 is the ecosystem behind the brands shaping the future of commerce.",
    primary: locale === "es" ? "Empieza con T1" : "Get started with T1",
    secondary: locale === "es" ? "Ver todas las historias" : "See all stories",
  };

  /* Build a flat list so a single index drives the stagger across both the
     neutral and the accented portions of the headline. The trailing period
     lives on the last accent word. */
  const preWords = copy.headlinePre.split(" ");
  const accentWords = copy.headlineAccent.split(" ");
  const words = [
    ...preWords.map((w) => ({ text: w, accent: false })),
    ...accentWords.map((w, i) => ({
      text: w + (i === accentWords.length - 1 ? "." : ""),
      accent: true,
    })),
  ];

  const tailDelay = words.length * WORD_STAGGER_MS;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden pb-24 tablet:pb-32"
      style={{
        background:
          "linear-gradient(to bottom, #E59086 0%, #F2B5AE 18%, #FFFFFF 60%)",
      }}
    >
      {/* Soft glow blob — follows cursor with eased parallax */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[720px] rounded-full opacity-60 blur-[120px] transition-transform duration-[700ms] ease-out will-change-transform"
        style={{
          background: "radial-gradient(closest-side, #E59086, transparent)",
          transform: `translate3d(calc(-50% + ${parallax.x * 36}px), ${parallax.y * 22}px, 0)`,
        }}
      />

      {/* Secondary glow — counter-parallax for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[180px] right-[12%] h-[280px] w-[280px] rounded-full opacity-40 blur-[100px] transition-transform duration-[900ms] ease-out will-change-transform"
        style={{
          background: "radial-gradient(closest-side, #F1B0A9, transparent)",
          transform: `translate3d(${parallax.x * -24}px, ${parallax.y * -16}px, 0)`,
        }}
      />

      <div className="relative mx-auto w-full max-w-[840px] px-5 pt-[140px] tablet:px-8 tablet:pt-[180px]">
        <div className="flex flex-col items-center text-center">
          {/* Headline — word-by-word stagger */}
          <h1 className="font-sora text-[36px] leading-[1.08] font-light tracking-[-0.02em] text-gray-900 tablet:text-[52px] desktop:text-[60px]">
            {words.map((w, i) => (
              <span
                key={i}
                className="inline-block"
                style={{
                  animation: `hero-word-up ${HEADLINE_WORD_DURATION_MS}ms cubic-bezier(0.16, 1, 0.3, 1) ${i * WORD_STAGGER_MS}ms both`,
                  color: w.accent ? "#E26153" : undefined,
                }}
              >
                {w.text}
                {i < words.length - 1 ? " " : ""}
              </span>
            ))}
          </h1>

          {/* Subhead */}
          <p
            className="mt-7 max-w-[600px] font-inter text-[15px] leading-[1.6] text-gray-600 tablet:text-[17px]"
            style={{
              animation: `hero-fade-up 700ms cubic-bezier(0.16, 1, 0.3, 1) ${tailDelay + 100}ms both`,
            }}
          >
            {copy.subhead}
          </p>

          {/* CTAs */}
          <div
            className="mt-10 flex flex-col items-stretch gap-3 tablet:flex-row tablet:items-center tablet:gap-4"
            style={{
              animation: `hero-fade-up 700ms cubic-bezier(0.16, 1, 0.3, 1) ${tailDelay + 250}ms both`,
            }}
          >
            <a
              href={T1_HOME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex h-[45px] items-center justify-center overflow-hidden rounded-[18px] bg-[#E26153] px-7 font-inter text-[14px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(226,97,83,0.55)] transition-all duration-300 hover:bg-[#DB3B2B] hover:shadow-[0_14px_32px_-8px_rgba(226,97,83,0.75)]"
            >
              {/* Shine sweep on hover */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
              />
              <span className="relative">{copy.primary}</span>
            </a>
            <a
              href="#explorar"
              className="group inline-flex h-[45px] items-center justify-center gap-2 rounded-[18px] border border-gray-300/80 bg-white/70 px-7 font-inter text-[14px] font-semibold text-[#0A0B10] backdrop-blur-sm transition-all duration-300 hover:border-gray-400 hover:bg-white"
            >
              {copy.secondary}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                className="transition-transform duration-300 group-hover:translate-y-0.5"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
