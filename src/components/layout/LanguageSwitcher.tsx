"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

export default function LanguageSwitcher({
  inverse = false,
}: {
  inverse?: boolean;
}) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  const activeColor = inverse ? "text-white" : "text-[#0A0B10]";
  const inactiveColor = inverse
    ? "text-white/45 hover:text-white/85"
    : "text-gray-400 hover:text-[#0A0B10]";
  const dividerColor = inverse ? "text-white/25" : "text-gray-300";

  return (
    <div className="flex items-center gap-1 font-inter text-[11px] font-medium">
      <button
        onClick={() => switchLocale("es")}
        className={`px-1 py-0.5 transition-colors ${
          locale === "es" ? activeColor : inactiveColor
        }`}
      >
        ES
      </button>
      <span className={dividerColor}>·</span>
      <button
        onClick={() => switchLocale("en")}
        className={`px-1 py-0.5 transition-colors ${
          locale === "en" ? activeColor : inactiveColor
        }`}
      >
        EN
      </button>
    </div>
  );
}
