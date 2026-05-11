// src/components/landing/hero.tsx
"use client";

import { ArrowRight, Cpu, Shield, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate w-full min-h-[100svh] overflow-hidden flex items-center justify-center"
    >
      {/* full-viewport ambient gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 hero-bubbles"
      />
      {/* three floating glassy orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-80px] top-8 -z-10 h-[620px] w-[620px] rounded-[38%] blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side,rgba(255,255,255,.55),rgba(255,255,255,.22),transparent)",
          boxShadow: "0 0 180px 44px rgba(99,102,241,.10)",
          animation: "hero-float-a 11s ease-in-out infinite",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-40px] top-24 -z-10 h-[720px] w-[720px] rounded-[40%] blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side,rgba(255,255,255,.52),rgba(255,255,255,.18),transparent)",
          boxShadow: "0 0 200px 56px rgba(16,185,129,.10)",
          animation: "hero-float-b 13s ease-in-out infinite",
          animationDelay: "1.2s",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 bottom-[-60px] -z-10 h-[700px] w-[700px] -translate-x-1/2 rounded-[42%] blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side,rgba(255,255,255,.48),rgba(255,255,255,.16),transparent)",
          boxShadow: "0 0 220px 60px rgba(99,102,241,.08)",
          animation: "hero-float-c 12s ease-in-out infinite",
          animationDelay: "2s",
        }}
      />

      {/* content */}
      <div className="container relative mx-auto max-w-6xl px-4">
        {/* posun pod navbar, ale stále centrované na výšku */}
        <div className="mx-auto flex min-h-[86svh] w-full flex-col items-center justify-center pt-[8vh] md:pt-[10vh] text-center">
          <h1
            id="hero-title"
            className="mx-auto max-w-3xl text-balance text-5xl font-black tracking-tight md:text-6xl lg:text-7xl"
          >
            <span className="bg-gradient-to-r from-[var(--brand-500)] via-[color:var(--fg)] to-emerald-400 bg-clip-text text-transparent">
              Smarter PDFs.
            </span>
            <br />
            <span className="text-[color:var(--fg)]/80">
              Built for humans, powered by AI.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-muted md:text-xl">
            PDFlex spája najdokonalejšie nástroje pre prácu s PDF – preklad, kompresiu,
            spojenie, ochranu aj automatizáciu – v jednom elegantnom rozhraní.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/register"
              className="group inline-flex items-center justify-center rounded-full bg-[var(--brand-500)] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-[var(--brand-500)]/30 transition hover:scale-[1.03] hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]/50"
            >
              <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
              Vyskúšať zdarma
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#cta"
              className="inline-flex items-center justify-center rounded-full border border-[var(--card-border)] bg-[var(--card-bg)]/60 px-6 py-3 text-sm font-medium text-[color:var(--fg)] shadow-sm transition hover:bg-[color:var(--card-bg)]/80 hover:border-[var(--fg)]/20"
            >
              Pozrieť plány
            </a>
          </div>

          {/* chips */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-4 text-sm text-muted">
            <Chip icon={<Shield className="h-4 w-4 text-emerald-400" />} text="Súkromie na prvom mieste" />
            <Divider />
            <Chip icon={<Zap className="h-4 w-4 text-yellow-400" />} text="Rýchle a spoľahlivé" />
            <Divider />
            <Chip icon={<Cpu className="h-4 w-4 text-[var(--brand-500)]" />} text="Poháňané AI" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes hero-float-a { 0%,100%{transform:translate3d(0,0,0)} 50%{transform:translate3d(0,-20px,0)} }
        @keyframes hero-float-b { 0%,100%{transform:translate3d(0,0,0)} 50%{transform:translate3d(0,-24px,0)} }
        @keyframes hero-float-c { 0%,100%{transform:translate3d(-50%,0,0)} 50%{transform:translate3d(-50%,-22px,0)} }
      `}</style>
    </section>
  );
}

function Chip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-[var(--card-border)]/60 bg-[var(--card-bg)]/40 px-4 py-2 backdrop-blur-md transition hover:bg-[var(--card-bg)]/60 hover:border-[var(--fg)]/10">
      {icon}
      <span>{text}</span>
    </div>
  );
}
function Divider() {
  return <span className="h-3 w-px bg-[var(--card-border)]/60" />;
}