"use client";

import Link from "next/link";

export default function CTA() {
  const floatA = "cta-float-a 11s ease-in-out infinite";
  const floatB = "cta-float-b 13s ease-in-out infinite";
  const floatC = "cta-float-c 12s ease-in-out infinite";

  return (
    <section
      id="cta"
      aria-labelledby="cta-title"
      className="relative isolate w-full min-h-[100svh] overflow-hidden flex items-center justify-center"
    >
      {/* ambient gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1400px 900px at 50% 120%, color-mix(in oklab, #10b981 12%, transparent), transparent 65%), radial-gradient(1400px 900px at 50% -20%, color-mix(in oklab, var(--brand-500) 14%, transparent), transparent 65%)",
        }}
      />

      {/* glass bubbles */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-80px] top-6 -z-10 h-[620px] w-[620px] rounded-[38%] blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,255,255,.55), rgba(255,255,255,.22), transparent)",
          boxShadow: "0 0 180px 44px rgba(99,102,241,.10)",
          animation: floatA,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-60px] top-24 -z-10 h-[720px] w-[720px] rounded-[40%] blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,255,255,.52), rgba(255,255,255,.18), transparent)",
          boxShadow: "0 0 200px 56px rgba(16,185,129,.10)",
          animation: floatB,
          animationDelay: "1.2s",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 bottom-[-60px] -z-10 h-[700px] w-[700px] -translate-x-1/2 rounded-[42%] blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,255,255,.48), rgba(255,255,255,.16), transparent)",
          boxShadow: "0 0 220px 60px rgba(99,102,241,.08)",
          animation: floatC,
          animationDelay: "2s",
        }}
      />

      {/* content */}
      <div className="container relative mx-auto max-w-4xl px-4 text-center">
        <h2
          id="cta-title"
          className="text-balance bg-gradient-to-r from-[var(--brand-500)] via-emerald-400 to-[var(--brand-500)] bg-clip-text text-3xl font-extrabold text-transparent md:text-5xl"
        >
          Built for focus.
          <span className="block text-[color:var(--fg)]">
            Designed for peace of mind.
          </span>
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
          Every detail of PDFlex was crafted to feel invisible — so you can stay in flow,
          finish faster, and forget about the tool itself.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/navod"
            className="inline-flex items-center rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]/70 px-6 py-3 text-sm font-medium text-[color:var(--fg)] transition hover:bg-[color:var(--card-bg)]/90"
          >
            Learn how it works
          </Link>
          <a
            href="#cta"
            className="inline-flex items-center rounded-lg border border-transparent bg-[var(--brand-500)] px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:brightness-95"
          >
            View pricing
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes cta-float-a {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -20px, 0); }
        }
        @keyframes cta-float-b {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -24px, 0); }
        }
        @keyframes cta-float-c {
          0%, 100% { transform: translate3d(-50%, 0, 0); }
          50% { transform: translate3d(-50%, -22px, 0); }
        }
      `}</style>
    </section>
  );
}