// src/components/landing/hero.mobile.tsx
"use client";

import { ArrowRight, Cpu, Shield, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

export default function HeroMobile() {
  return (
    <section className="relative w-full min-h-[100svh] flex flex-col items-center justify-center px-4 text-center overflow-hidden">
      {/* Ambient background & orbs */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(600px 400px at 50% 10%, rgba(99,102,241,0.06), transparent), radial-gradient(800px 500px at 50% 90%, rgba(16,185,129,0.05), transparent)",
        }}
      />
      {/* Glass orbs */}
      <div
        aria-hidden
        className="absolute left-[-80px] top-8 -z-10 h-[500px] w-[500px] rounded-[40%] blur-3xl"
        style={{
          background: "radial-gradient(closest-side,rgba(255,255,255,.5),transparent)",
          boxShadow: "0 0 160px 40px rgba(99,102,241,.08)",
          animation: "floatA 10s ease-in-out infinite",
        }}
      />
      <div
        aria-hidden
        className="absolute right-[-60px] top-24 -z-10 h-[600px] w-[600px] rounded-[40%] blur-3xl"
        style={{
          background: "radial-gradient(closest-side,rgba(255,255,255,.45),transparent)",
          boxShadow: "0 0 180px 48px rgba(16,185,129,.08)",
          animation: "floatB 12s ease-in-out infinite",
        }}
      />

      {/* Content */}
      <h1 className="text-4xl font-black tracking-tight leading-tight text-transparent bg-gradient-to-r from-[var(--brand-500)] via-[color:var(--fg)] to-emerald-400 bg-clip-text">
        Smarter PDFs.
        <span className="block text-lg font-semibold text-[color:var(--fg)]/80 mt-1">
          Built for humans, powered by AI.
        </span>
      </h1>

      <p className="mt-4 text-sm text-muted max-w-sm">
        PDFlex spája najdokonalejšie nástroje pre prácu s PDF – preklad, kompresiu,
        spojenie, ochranu aj automatizáciu – v jednom elegantnom rozhraní.
      </p>

      {/* CTA Buttons */}
      <div className="mt-8 flex flex-col gap-3 w-full max-w-xs">
        <Link
          href="/register"
          className="group inline-flex items-center justify-center rounded-full bg-[var(--brand-500)] px-5 py-3 text-sm font-medium text-white shadow-lg transition hover:brightness-110"
        >
          <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
          Vyskúšať zdarma
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <a
          href="#cta"
          className="inline-flex items-center justify-center rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] px-5 py-3 text-sm font-medium text-[color:var(--fg)] shadow-sm hover:bg-[var(--card-bg)]/80"
        >
          Pozrieť plány
        </a>
      </div>

      {/* Chips */}
      <div className="mt-10 flex flex-wrap justify-center gap-2 text-xs text-muted">
        <Chip icon={<Shield className="h-4 w-4 text-emerald-400" />} text="Súkromie na prvom mieste" />
        <Chip icon={<Zap className="h-4 w-4 text-yellow-400" />} text="Rýchle a spoľahlivé" />
        <Chip icon={<Cpu className="h-4 w-4 text-[var(--brand-500)]" />} text="Poháňané AI" />
      </div>

      <style jsx>{`
        @keyframes floatA {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </section>
  );
}

function Chip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="flex items-center gap-1 rounded-full border border-[var(--card-border)]/60 bg-[var(--card-bg)]/40 px-3 py-1 backdrop-blur-md">
      {icon}
      {text}
    </span>
  );
}