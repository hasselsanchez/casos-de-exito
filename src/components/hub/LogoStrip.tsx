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

      <div className="relative overflow-hidden">
        {/* Edge fades */}
        <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />

        <div className="flex w-fit animate-marquee items-center gap-16">
          {rail.map((c, i) => (
            <div
              key={`${c.slug}-${i}`}
              className="flex h-12 w-[120px] shrink-0 items-center justify-center px-2"
            >
              <Image
                src={c.logo}
                alt={c.name}
                width={100}
                height={40}
                className={`object-contain ${
                  c.slug === "sears"
                    ? "h-3 w-auto"
                    : c.slug === "doto"
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
