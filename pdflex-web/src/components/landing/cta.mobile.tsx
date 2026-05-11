// src/components/landing/cta.mobile.tsx
"use client";

import Link from "next/link";

export default function CTAMobile() {
  return (
    <section className="relative w-full px-4 py-20 text-center overflow-hidden">
      {/* background */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1000px 700px at 50% 120%, rgba(16,185,129,0.06), transparent), radial-gradient(1000px 700px at 50% -20%, rgba(99,102,241,0.05), transparent)",
        }}
      />

      <h2 className="text-3xl font-extrabold bg-gradient-to-r from-[var(--brand-500)] via-emerald-400 to-[var(--brand-500)] bg-clip-text text-transparent leading-tight">
        Built for focus.
        <span className="block text-[color:var(--fg)] mt-1">
          Designed for peace of mind.
        </span>
      </h2>

      <p className="mt-4 text-sm text-muted max-w-md mx-auto">
        Every detail of PDFlex was crafted to feel invisible — so you can stay in flow,
        finish faster, and forget about the tool itself.
      </p>

      <div className="mt-8 flex flex-col items-center gap-3">
        <Link
          href="/navod"
          className="w-full max-w-xs inline-flex items-center justify-center rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]/70 px-6 py-3 text-sm font-medium text-[color:var(--fg)] transition hover:bg-[color:var(--card-bg)]/90"
        >
          Learn how it works
        </Link>
        <Link
          href="/cennik"
          className="w-full max-w-xs inline-flex items-center justify-center rounded-lg border border-transparent bg-[var(--brand-500)] px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:brightness-95"
        >
          View pricing
        </Link>
      </div>
    </section>
  );
}