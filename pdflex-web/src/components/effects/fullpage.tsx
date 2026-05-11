"use client";

import * as React from "react";

type Props = {
  className?: string;
  offsetTop?: number;
  durationMs?: number;
  cooldownMs?: number;
  children: React.ReactNode;
};

// pekne plynulý easing
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// animovaný scroll s fixnou rýchlosťou
function animateScrollTo(target: number, duration: number, onDone: () => void) {
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (reduce || duration <= 0) {
    window.scrollTo(0, target);
    onDone();
    return;
  }

  const start = window.scrollY;
  const dist = target - start;
  const t0 = performance.now();

  const loop = (t: number) => {
    const p = Math.min(1, (t - t0) / duration);
    const eased = easeInOutCubic(p);
    window.scrollTo(0, start + dist * eased);
    if (p < 1) requestAnimationFrame(loop);
    else onDone();
  };
  requestAnimationFrame(loop);
}

export default function Fullpage({
  className,
  offsetTop = 72,
  durationMs = 900,
  cooldownMs = 650, // 🔹 zväčšený cooldown
  children,
}: Props) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const indexRef = React.useRef(0);
  const animatingRef = React.useRef(false);
  const cooldownUntilRef = React.useRef(0);
  const touchStartY = React.useRef<number | null>(null);

  const now = () => performance.now();

  const getSections = React.useCallback(() => {
    if (!rootRef.current) return [] as HTMLElement[];
    return Array.from(
      rootRef.current.querySelectorAll<HTMLElement>('[data-snap="section"]')
    );
  }, []);

  const alignToCenter = React.useCallback((idx: number) => {
    const sections = getSections();
    if (!sections.length) return;

    const next = Math.max(0, Math.min(sections.length - 1, idx));
    const el = sections[next];
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const currentTop = window.scrollY;

    const target = currentTop + rect.top + rect.height / 2 - (vh - offsetTop) / 2;

    animatingRef.current = true;
    indexRef.current = next;

    animateScrollTo(target, durationMs, () => {
      animatingRef.current = false;
      // absorbuj všetky eventy ešte cca 0.65 s
      cooldownUntilRef.current = now() + cooldownMs;
    });
  }, [getSections, offsetTop, durationMs, cooldownMs]);

  // pri resize drž stred
  React.useEffect(() => {
    const onResize = () => {
      if (!animatingRef.current) alignToCenter(indexRef.current);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [alignToCenter]);

  // === Wheel ===
  React.useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const secs = getSections();
      if (!secs.length) return;

      if (animatingRef.current || now() < cooldownUntilRef.current) {
        e.preventDefault();
        return;
      }

      if (Math.abs(e.deltaY) < 1) return;

      const goingDown = e.deltaY > 0;
      const atLast = indexRef.current >= secs.length - 1;
      const atFirst = indexRef.current <= 0;

      if ((goingDown && atLast) || (!goingDown && atFirst)) return;

      e.preventDefault();
      alignToCenter(indexRef.current + (goingDown ? 1 : -1));
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [alignToCenter, getSections]);

  // === Touch ===
  React.useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (animatingRef.current || now() < cooldownUntilRef.current) return;
      const start = touchStartY.current;
      touchStartY.current = null;
      if (start == null) return;

      const dy = start - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 18) return;

      const secs = getSections();
      if (!secs.length) return;

      const goingDown = dy > 0;
      const atLast = indexRef.current >= secs.length - 1;
      const atFirst = indexRef.current <= 0;

      if ((goingDown && atLast) || (!goingDown && atFirst)) return;

      alignToCenter(indexRef.current + (goingDown ? 1 : -1));
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [alignToCenter, getSections]);

  // === Keyboard ===
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const nextKeys = ["PageDown", "ArrowDown", " "];
      const prevKeys = ["PageUp", "ArrowUp"];
      if (!nextKeys.includes(e.key) && !prevKeys.includes(e.key)) return;

      if (animatingRef.current || now() < cooldownUntilRef.current) {
        e.preventDefault();
        return;
      }

      const dir = nextKeys.includes(e.key) ? 1 : -1;
      e.preventDefault();
      alignToCenter(indexRef.current + dir);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [alignToCenter]);

  // zarovnaj po mountnutí
  React.useEffect(() => {
    requestAnimationFrame(() => alignToCenter(0));
  }, [alignToCenter]);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}