import Image from "next/image";
import { articles } from "@/lib/articles";

/**
 * Standalone logo proof. White band with hairlines + a seamless marquee
 * of partner logos. Quiet typographic moment, no decoration.
 */
export default function LogoStrip() {
  const companies = articles.map((a) => ({
    name: a.company,
    logo: a.logoSrc,
    slug: a.slug,
  }));

  // duplicate the row for a seamless loop
  const rail = [...companies, ...companies];

  return (
    <section className="relative overflow-hidden bg-white py-5 tablet:py-6">
      {/* Bottom hairline — anchors the strip into the page below */}
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 mx-auto max-w-[640px]">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      <div className="group relative overflow-hidden">
        {/* Edge fades */}
        <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />

        <div className="flex w-fit animate-marquee items-center gap-16 group-hover:[animation-play-state:paused]">
          {rail.map((c, i) => (
            <div
              key={`${c.slug}-${i}`}
              className="group/logo flex h-12 w-[120px] shrink-0 items-center justify-center px-2 transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:scale-110"
            >
              <Image
                src={c.logo}
                alt={c.name}
                width={100}
                height={40}
                className={`object-contain opacity-60 saturate-0 transition-all duration-500 ease-out group-hover/logo:opacity-100 group-hover/logo:saturate-100 group-hover/logo:[filter:drop-shadow(0_4px_10px_rgba(10,11,16,0.12))] ${
                  c.slug === "sears"
                    ? "h-3 w-auto"
                    : c.slug === "doto"
                      ? "h-4 w-auto"
                      : c.slug === "makora"
                        ? "h-4 w-auto"
                        : "h-8 max-w-[100px]"
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
