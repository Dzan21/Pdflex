"use client";

import { useEffect, useRef, useState } from "react";

/* ── Count-up hook ─────────────────────────────────── */

function useCountUp(target: number, duration = 1800, active = false) {
  const [value, setValue] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
      else setValue(target);
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active, target, duration]);

  return value;
}

/* ── Stat item ─────────────────────────────────────── */

interface StatProps {
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
  active: boolean;
  delay: number;
  accent: string;
}

function Stat({ value, suffix, label, sublabel, active, delay, accent }: StatProps) {
  const count = useCountUp(value, 1800, active);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [active, delay]);

  return (
    <div
      className="flex flex-col items-center text-center transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
      }}
    >
      <div className={`text-5xl font-black tracking-tight sm:text-6xl md:text-7xl ${accent}`}>
        {count.toLocaleString()}
        <span className="text-4xl sm:text-5xl md:text-6xl">{suffix}</span>
      </div>
      <div className="mt-3 text-lg font-semibold text-[var(--fg)]">{label}</div>
      <div className="mt-1 text-sm text-[var(--muted)]">{sublabel}</div>
    </div>
  );
}

/* ── Section ────────────────────────────────────────── */

const STATS = [
  {
    value: 10000,
    suffix: "+",
    label: "Documents processed",
    sublabel: "and counting every day",
    accent: "text-[var(--brand-500)]",
    delay: 0,
  },
  {
    value: 50,
    suffix: "+",
    label: "Supported languages",
    sublabel: "powered by DeepL AI",
    accent: "text-emerald-500",
    delay: 150,
  },
  {
    value: 99,
    suffix: ".9%",
    label: "Uptime reliability",
    sublabel: "monitored 24 / 7",
    accent: "text-violet-500",
    delay: 300,
  },
];

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="stats-title"
      className="relative w-full py-24 md:py-32 overflow-hidden"
    >
      {/* Background — dot grid + vignette + blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-30">
        <div
          className="absolute inset-0 opacity-[0.35] dark:opacity-[0.15]"
          style={{
            backgroundImage: "radial-gradient(circle, var(--brand-500) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, var(--bg) 100%)",
          }}
        />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-[0.14] dark:opacity-[0.09]"
          style={{
            top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle at center, var(--brand-500) 0%, #8b5cf6 50%, transparent 70%)",
            filter: "blur(80px)",
            animation: "stats-blob 18s ease-in-out infinite",
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div
          className="text-center mb-16 transition-all duration-700"
          style={{ opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(24px)" }}
        >
          <h2
            id="stats-title"
            className="text-4xl font-black tracking-tight md:text-5xl"
          >
            <span className="text-[var(--fg)]">PDFlex </span>
            <span className="bg-gradient-to-r from-[var(--brand-500)] to-violet-500 bg-clip-text text-transparent">
              by the numbers
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[var(--muted)]">
            Real usage, real results — no vanity metrics.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid gap-10 sm:gap-6 sm:grid-cols-3">
          {STATS.map((s) => (
            <Stat key={s.label} {...s} active={active} />
          ))}
        </div>

        {/* Divider line */}
        <div className="mt-20 h-px w-full bg-gradient-to-r from-transparent via-[var(--card-border)] to-transparent" />
      </div>

      <style jsx>{`
        @keyframes stats-blob {
          0%,100% { transform: translate(-50%,-50%) scale(1); }
          50%      { transform: translate(-50%,-50%) scale(1.2); }
        }
      `}</style>
    </section>
  );
}
