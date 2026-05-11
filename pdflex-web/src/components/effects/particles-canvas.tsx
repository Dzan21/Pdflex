"use client";

import * as React from "react";

/**
 * Ultra ľahký canvas efekt:
 * - ~24 čiastočiek jemne pláva
 * - kurzor pôsobí ako magnet (pritiahne/odpudí)
 * - rešpektuje dark/light (berie farby z CSS var)
 */
export function ParticlesCanvas() {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const rafRef = React.useRef<number | null>(null);
  const mouse = React.useRef<{ x: number; y: number } | null>(null);

  React.useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const styles = getComputedStyle(document.documentElement);
    const brand = styles.getPropertyValue("--brand-500").trim() || "#60a5fa";
    const fg = styles.getPropertyValue("--fg").trim() || "#e5e7eb";

    const N = 24;
    const parts = Array.from({ length: N }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: 1.2 + Math.random() * 2.2,
    }));

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => (mouse.current = null);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);

    const step = () => {
      ctx.clearRect(0, 0, w, h);

      for (const p of parts) {
        // jemný drift
        p.x += p.vx;
        p.y += p.vy;

        // parallax scroll (ak by niekto posúval)
        // nič extra – držíme minimalizmus

        // wrap
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // interakcia s kurzorom
        const m = mouse.current;
        if (m) {
          const dx = p.x - m.x;
          const dy = p.y - m.y;
          const d2 = dx * dx + dy * dy;
          const rad = 140; // dosah
          if (d2 < rad * rad) {
            const d = Math.sqrt(d2) || 1;
            const ux = dx / d;
            const uy = dy / d;
            // jemne odtlač (alebo záporné pre satie)
            p.vx += ux * 0.02;
            p.vy += uy * 0.02;
          }
        }

        // kresba
        ctx.beginPath();
        ctx.fillStyle = Math.random() < 0.6 ? brand + "88" : fg + "44";
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafRef.current!);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 -z-10 opacity-60 [mask-image:radial-gradient(60%_60%_at_50%_30%,black,transparent)]"
      aria-hidden
    />
  );
}