"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

type Metric = {
  key: "merchants" | "payments" | "shipments" | "integrations";
  prefix: string;
  target: number;
  suffix: string;
};

const METRICS: Metric[] = [
  { key: "merchants", prefix: "+", target: 25, suffix: " mil" },
  { key: "payments", prefix: "+$", target: 13, suffix: "B" },
  { key: "shipments", prefix: "+", target: 40, suffix: "M" },
  { key: "integrations", prefix: "+", target: 10, suffix: "" },
];

/**
 * Brand metrics — black section with large Sora display numbers and a
 * scroll-triggered count-up animation. Anchors the page midway between
 * the customer showcase and the article feed with a confident statement
 * of scale.
 */
export default function BrandMetrics() {
  const t = useTranslations("brandMetrics");

  return (
    <section className="relative overflow-hidden bg-black py-20 tablet:py-28">
      {/* Soft brand glow behind the stats — adds depth without competing */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[140px]"
        style={{
          background: "radial-gradient(closest-side, #E26153, transparent)",
        }}
      />

      <div className="relative mx-auto max-w-[1100px] px-5 tablet:px-8">
        {/* Section title — 44px, matches the rest of the landing */}
        <h2
          data-animate
          className="mx-auto max-w-[760px] text-center font-sora text-[32px] leading-[1.1] font-light tracking-[-0.015em] text-white tablet:text-[44px]"
        >
          {t("title")}
          <span className="text-[#E26153]">{t("titleAccent")}</span>
          {t("titleAfter")}
        </h2>

        {/* Metrics — large display numbers */}
        <div
          data-animate
          className="mt-14 grid grid-cols-2 gap-y-14 tablet:mt-20 tablet:grid-cols-4 tablet:gap-y-0"
        >
          {METRICS.map((m) => (
            <MetricCell key={m.key} metric={m} label={t(`items.${m.key}`)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MetricCell({ metric, label }: { metric: Metric; label: string }) {
  return (
    <div className="text-center">
      <p className="font-sora text-[56px] leading-[1] font-light tracking-[-0.03em] text-white tablet:text-[72px] desktop:text-[80px]">
        {metric.prefix}
        <CountUp target={metric.target} />
        <span className="text-[#E26153]">{metric.suffix}</span>
      </p>
      <p className="mx-auto mt-5 max-w-[220px] font-inter text-[13px] leading-[1.5] font-normal text-gray-400 tablet:text-[14px]">
        {label}
      </p>
    </div>
  );
}

function CountUp({
  target,
  duration = 1500,
}: {
  target: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(eased * target);
            if (progress < 1) requestAnimationFrame(animate);
            else setCount(target);
          };
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {Math.round(count)}
    </span>
  );
}
