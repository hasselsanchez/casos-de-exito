import { useLocale } from "next-intl";
import { SIGNUP_URL } from "@/lib/constants";

/**
 * Minimalist editorial hero — no featured case, just a strong aspirational
 * statement about T1 as the infrastructure powering commerce in Mexico.
 */
export default function HeroSection() {
  const locale = useLocale() as "es" | "en";

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

  return (
    <section
      className="relative overflow-hidden pb-24 tablet:pb-32"
      style={{
        background:
          "linear-gradient(to bottom, #E59086 0%, #F2B5AE 18%, #FFFFFF 60%)",
      }}
    >
      {/* Subtle tech grid — barely visible, adds depth without breaking minimalism */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #0A0B10 1px, transparent 1px), linear-gradient(to bottom, #0A0B10 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse at 50% 0%, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 0%, black 30%, transparent 75%)",
        }}
      />

      {/* Soft glow blob for warmth */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full opacity-60 blur-[120px]"
        style={{ background: "radial-gradient(closest-side, #E59086, transparent)" }}
      />

      <div className="relative mx-auto w-full max-w-[840px] px-5 pt-[140px] tablet:px-8 tablet:pt-[180px]">
        <div data-animate className="flex flex-col items-center text-center">
          {/* Headline */}
          <h1 className="font-sora text-[36px] leading-[1.08] font-light tracking-[-0.02em] text-gray-900 tablet:text-[52px] desktop:text-[60px]">
            {copy.headlinePre}{" "}
            <span className="text-[#E26153]">{copy.headlineAccent}</span>.
          </h1>

          {/* Subhead */}
          <p className="mt-7 max-w-[600px] font-inter text-[15px] leading-[1.6] text-gray-600 tablet:text-[17px]">
            {copy.subhead}
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-stretch gap-3 tablet:flex-row tablet:items-center tablet:gap-4">
            <a
              href={SIGNUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-[45px] items-center justify-center rounded-[18px] bg-[#E26153] px-7 font-inter text-[14px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(226,97,83,0.55)] transition-all duration-300 hover:bg-[#DB3B2B] hover:shadow-[0_12px_28px_-8px_rgba(226,97,83,0.7)]"
            >
              {copy.primary}
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
