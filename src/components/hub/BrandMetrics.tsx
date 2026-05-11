"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

type Metric = {
  key: "merchants" | "payments" | "shipments";
  prefix: string;
  target: number;
  suffix: string;
};

const METRICS: Metric[] = [
  { key: "merchants", prefix: "+", target: 25, suffix: " mil" },
  { key: "payments", prefix: "+$", target: 25, suffix: " B" },
  { key: "shipments", prefix: "+", target: 40, suffix: " M" },
];

/**
 * Brand metrics — compact black band with three large display numbers in a
 * single row. Black and white only; no chromatic accents. Numbers animate up
 * on scroll, starting from a value with the same digit count as the target
 * so the layout never shifts mid-animation.
 */
export default function BrandMetrics() {
  const t = useTranslations("brandMetrics");

  return (
    <section className="relative bg-black py-10 tablet:py-12">
      <div className="relative mx-auto max-w-[1200px] px-6 tablet:px-12">
        {/* Section title — short, single color */}
        <h2
          data-animate
          className="text-center font-sora text-[24px] leading-[1.1] font-light tracking-[-0.015em] text-white tablet:text-[36px]"
        >
          {t("title")}
        </h2>

        {/* Single-row stats strip */}
        <div
          data-animate
          className="mt-8 grid grid-cols-1 gap-y-10 tablet:mt-10 tablet:grid-cols-3 tablet:gap-y-0 tablet:gap-x-6"
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
      <p className="font-sora leading-[1] font-light tracking-[-0.03em] whitespace-nowrap text-white text-[clamp(44px,5.2vw,84px)]">
        {metric.prefix}
        <CountUp target={metric.target} />
        {metric.suffix}
      </p>
      <p className="mx-auto mt-4 max-w-[260px] font-inter text-[13px] leading-[1.5] font-normal text-gray-400 tablet:mt-5 tablet:text-[15px]">
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
  /* Start from a value with the same digit count as the target so the rendered
     number never gains a digit mid-animation — that transition (e.g. 9 → 10)
     was causing a horizontal layout shift in the surrounding prefix/suffix,
     which read as a visual "jam" during the count-up on initial load. */
  const digits = String(target).length;
  const startValue = digits > 1 ? Math.pow(10, digits - 1) : 0;

  const [count, setCount] = useState(startValue);
  const ref = useRef<HTMLSpanElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          const t0 = performance.now();
          const range = target - startValue;
          const animate = (now: number) => {
            const progress = Math.min((now - t0) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(startValue + eased * range);
            if (progress < 1) requestAnimationFrame(animate);
            else setCount(target);
          };
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      /* Lower threshold so the animation triggers reliably as the band enters
         the viewport, even on viewports where the span is small relative to
         the section. */
      { threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [target, duration, startValue]);

  return (
    <span
      ref={ref}
      className="tabular-nums inline-block text-right"
      style={{ minWidth: `${digits}ch` }}
    >
      {Math.round(count)}
    </span>
  );
}
