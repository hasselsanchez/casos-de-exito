"use client";

import { useEffect, useRef, useState } from "react";

/* ─── useCountUp ───
   Animates a number from 0 to `target` when the element enters the viewport.
   Uses easeOutCubic for smooth deceleration. Triggers once. */
export function useCountUp(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    if (target === 0) {
      setCount(0);
      return;
    }
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
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

  return { count, ref };
}

/* ─── parseMetric ───
   Parses a metric string like "40%", "85M+", "<0.5s", "20%" into prefix /
   number / suffix / decimals. Returns null if no number found. */
function parseMetric(value: string) {
  const match = value.match(/^([<~+]*)?(\d+\.?\d*)(.*)$/);
  if (!match) return null;
  const numStr = match[2];
  const decimals = numStr.includes(".")
    ? numStr.split(".")[1].length
    : 0;
  return {
    prefix: match[1] ?? "",
    number: parseFloat(numStr),
    suffix: match[3] ?? "",
    decimals,
  };
}

/* ─── AnimatedMetric ───
   Renders a metric value, animating the numeric part on viewport entry.
   If the value is not numeric (e.g., "Same-day"), renders as plain text. */
export function AnimatedMetric({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  const parsed = parseMetric(value);
  const target = parsed?.number ?? 0;
  const { count, ref } = useCountUp(target);

  if (!parsed) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span ref={ref} className={className}>
      {parsed.prefix}
      {count.toFixed(parsed.decimals)}
      {parsed.suffix}
    </span>
  );
}
