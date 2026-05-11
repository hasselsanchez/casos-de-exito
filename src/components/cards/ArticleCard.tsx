import Image from "next/image";
import { Link } from "@/i18n/routing";
import type { Article } from "@/lib/articles";

interface ArticleCardProps {
  article: Article;
  locale: "es" | "en";
  index?: number;
}

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

/* Per-article hover gradient config. Each slug points to a painterly
   background from /background hover images/ and optionally specifies how
   to frame it inside the card. `position` maps to CSS object-position,
   `origin` to transform-origin, and `scale` to a zoom factor — together
   they let a single source image expose very different regions per card.
   Makora and PASE share BKG 6: Makora crops into the upper-left, PASE
   into the lower-right, so each card sits at one end of the gradient.
   Círculo de Crédito uses BKG 1 framed on its lower-center blue blob to
   avoid the red zone in the upper-left. */
type GradientView = {
  src: string;
  position?: string;
  origin?: string;
  scale?: number;
};
const CARD_GRADIENT: Record<string, GradientView> = {
  "circulo-de-credito": {
    src: "/images/background hover images/BKGMesa de trabajo 1.jpg",
    position: "50% 100%",
    origin: "center bottom",
    scale: 1.7,
  },
  doto: { src: "/images/background hover images/BKGMesa de trabajo 8.jpg" },
  makora: {
    src: "/images/background hover images/BKGMesa de trabajo 6.jpg",
    position: "left top",
    origin: "left top",
    scale: 2.2,
  },
  pase: {
    src: "/images/background hover images/BKGMesa de trabajo 6.jpg",
    position: "right bottom",
    origin: "right bottom",
    scale: 2.2,
  },
  sears: { src: "/images/background hover images/BKGMesa de trabajo 5.jpg" },
  sesen: { src: "/images/background hover images/BKGMesa de trabajo 10.jpg" },
};

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
        <div className="relative w-full max-w-[68%]">
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
