"use client";

import { ArrowRight, Cpu, Shield, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

/* Word-level stagger — no external deps */
function StaggerLine({ words, baseDelay = 0, className = "" }: {
  words: string[];
  baseDelay?: number;
  className?: string;
}) {
  return (
    <span className={className} aria-label={words.join(" ")}>
      {words.map((word, i) => (
        <span
          key={i}
          aria-hidden
          className="inline-block opacity-0"
          style={{
            animation: "hero-word-in 0.55s cubic-bezier(.2,.7,.3,1) forwards",
            animationDelay: `${baseDelay + i * 0.08}s`,
          }}
        >
          {word}
          {i < words.length - 1 ? "\u00a0" : ""}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate w-full min-h-[100svh] overflow-hidden flex items-center justify-center"
    >
      {/* Animated gradient blob — CSS only, opacity 0.12 */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
        <div
          className="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] rounded-full opacity-[0.12]"
          style={{
            background:
              "radial-gradient(ellipse at center, var(--brand-500) 0%, #10b981 45%, transparent 75%)",
            filter: "blur(80px)",
            animation: "hero-blob 14s ease-in-out infinite",
          }}
        />
      </div>

      {/* Three floating glassy orbs */}
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

      {/* Content */}
      <div className="relative mx-auto max-w-6xl px-4 w-full">
        <div className="mx-auto flex min-h-[86svh] w-full flex-col items-center justify-center pt-[8vh] md:pt-[10vh] text-center">

          {/* Badge */}
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--brand-500)]/30 bg-[var(--brand-500)]/8 px-4 py-1.5 text-sm font-medium text-[var(--brand-500)] opacity-0"
            style={{ animation: "hero-word-in 0.5s cubic-bezier(.2,.7,.3,1) 0.1s forwards" }}
          >
            <span className="text-xs">✦</span>
            AI-powered document toolkit
          </div>

          {/* Heading with stagger */}
          <h1
            id="hero-title"
            className="mx-auto max-w-3xl text-balance text-5xl font-black tracking-tight md:text-6xl lg:text-7xl leading-tight"
          >
            <span className="bg-gradient-to-r from-[var(--brand-500)] via-[color:var(--fg)] to-emerald-400 bg-clip-text text-transparent block">
              <StaggerLine words={["Smarter", "PDFs."]} baseDelay={0.2} />
            </span>
            <span className="text-[color:var(--fg)]/80 block mt-1">
              <StaggerLine
                words={["Built", "for", "humans,"]}
                baseDelay={0.42}
              />
              {" "}
              <StaggerLine
                words={["powered", "by", "AI."]}
                baseDelay={0.66}
              />
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="mx-auto mt-7 max-w-xl text-lg text-[var(--muted)] md:text-xl opacity-0"
            style={{ animation: "hero-word-in 0.6s cubic-bezier(.2,.7,.3,1) 0.95s forwards" }}
          >
            PDFlex spája najdokonalejšie nástroje pre prácu s PDF – preklad, kompresiu,
            spojenie, ochranu aj automatizáciu – v jednom elegantnom rozhraní.
          </p>

          {/* CTA buttons */}
          <div
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 opacity-0"
            style={{ animation: "hero-word-in 0.6s cubic-bezier(.2,.7,.3,1) 1.1s forwards" }}
          >
            <Link
              href="/register"
              className="group inline-flex items-center justify-center rounded-full bg-[var(--brand-500)] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-[var(--brand-500)]/30 transition hover:scale-[1.03] hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]/50"
            >
              <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
              Vyskúšať zdarma
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#pricing"
              className="inline-flex items-center justify-center rounded-full border border-[var(--card-border)] bg-[var(--card-bg)]/60 px-6 py-3 text-sm font-medium text-[color:var(--fg)] shadow-sm transition hover:bg-[color:var(--card-bg)]/80 hover:border-[var(--fg)]/20"
            >
              Pozrieť plány
            </a>
          </div>

          {/* Trust line */}
          <p
            className="mt-4 text-xs text-[var(--muted)]/70 opacity-0"
            style={{ animation: "hero-word-in 0.6s cubic-bezier(.2,.7,.3,1) 1.25s forwards" }}
          >
            Bez kreditnej karty&nbsp;·&nbsp;Zrušenie kedykoľvek
          </p>

          {/* Chips */}
          <div
            className="mt-12 flex flex-wrap items-center justify-center gap-4 text-sm text-[var(--muted)] opacity-0"
            style={{ animation: "hero-word-in 0.6s cubic-bezier(.2,.7,.3,1) 1.35s forwards" }}
          >
            <Chip icon={<Shield className="h-4 w-4 text-emerald-400" />} text="Súkromie na prvom mieste" />
            <Divider />
            <Chip icon={<Zap className="h-4 w-4 text-yellow-400" />} text="Rýchle a spoľahlivé" />
            <Divider />
            <Chip icon={<Cpu className="h-4 w-4 text-[var(--brand-500)]" />} text="Poháňané AI" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes hero-word-in {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes hero-blob {
          0%,100% { transform: translate(-50%,-50%) scale(1)    rotate(0deg);   }
          33%      { transform: translate(-50%,-50%) scale(1.12) rotate(6deg);   }
          66%      { transform: translate(-50%,-50%) scale(0.92) rotate(-4deg);  }
        }
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
