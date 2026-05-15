import Image from "next/image";
import { Link } from "@/i18n/routing";
import type { Article } from "@/lib/articles";
import {
  CARD_GRADIENT,
  CENTERED_LOGO,
  CENTERED_LOGO_MAX_W,
  DEFAULT_LOGO_MAX_W,
} from "@/lib/cardAssets";

interface ArticleCardProps {
  article: Article;
  locale: "es" | "en";
  index?: number;
}

/**
 * Logo-forward recommendation card.
 * Default: pale neutral bg, brand mark centered, ○ industry top-left, title bottom.
 * Hover: full-bleed gradient swap, white logo + title, ↗ pill top-right.
 */
export default function ArticleCard({
  article,
  locale,
  index = 0,
}: ArticleCardProps) {
  const logoH = CENTERED_LOGO[article.company] ?? "h-[40px]";
  const logoMaxW = CENTERED_LOGO_MAX_W[article.company] ?? DEFAULT_LOGO_MAX_W;
  const gradient = CARD_GRADIENT[article.slug];

  return (
    <Link
      href={{
        pathname: "/casos-de-exito/[slug]",
        params: { slug: article.slug },
      }}
      className="group relative flex aspect-[5/4] flex-col overflow-hidden rounded-[14px] bg-[#F4F4F2] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_48px_-20px_rgba(10,11,16,0.22)]"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Hover gradient layer — fades in over the neutral bg. Some cards
         tighten into a specific region of the source image via position +
         transform-origin + scale (see CARD_GRADIENT). */}
      {gradient && (
        <Image
          src={gradient.src}
          alt=""
          fill
          aria-hidden
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            ...(gradient.position && { objectPosition: gradient.position }),
            ...(gradient.scale && {
              transform: `scale(${gradient.scale})`,
              transformOrigin: gradient.origin ?? "center",
            }),
          }}
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
      <span className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0A0B10] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 tablet:top-5 tablet:right-5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>

      {/* Centered logo — crossfades between full-color and white on hover. */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-6">
        <div className={`relative w-full ${logoMaxW}`}>
          <span
            role="img"
            aria-label={article.company}
            className={`block ${logoH} w-full bg-no-repeat bg-center transition-opacity duration-500 group-hover:opacity-0`}
            style={{
              backgroundImage: `url(${article.logoSrc})`,
              backgroundSize: "contain",
            }}
          />
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
