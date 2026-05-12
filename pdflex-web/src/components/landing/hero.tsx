"use client";

import { ArrowRight, Cpu, Shield, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

/* Word-level stagger — no external deps */
function StaggerLine({
  words,
  baseDelay = 0,
  className = "",
}: {
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
      {/* ── Background layer ─────────────────────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-30">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.35] dark:opacity-[0.15]"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--brand-500) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        {/* Edge vignette to fade the grid */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, var(--bg) 100%)",
          }}
        />
      </div>

      {/* ── Animated gradient blobs ───────────────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
        {/* Blue — top-left */}
        <div
          className="absolute w-[700px] h-[700px] rounded-full opacity-[0.18] dark:opacity-[0.12]"
          style={{
            top: "-15%",
            left: "-10%",
            background: "radial-gradient(circle at center, #327fff 0%, transparent 70%)",
            filter: "blur(72px)",
            animation: "blob-a 16s ease-in-out infinite",
          }}
        />
        {/* Teal — top-right */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-[0.16] dark:opacity-[0.10]"
          style={{
            top: "-5%",
            right: "-8%",
            background: "radial-gradient(circle at center, #10b981 0%, transparent 70%)",
            filter: "blur(80px)",
            animation: "blob-b 18s ease-in-out infinite",
            animationDelay: "2s",
          }}
        />
        {/* Purple — center */}
        <div
          className="absolute w-[800px] h-[500px] rounded-full opacity-[0.10] dark:opacity-[0.08]"
          style={{
            top: "30%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "radial-gradient(circle at center, #8b5cf6 0%, transparent 70%)",
            filter: "blur(90px)",
            animation: "blob-c 20s ease-in-out infinite",
            animationDelay: "4s",
          }}
        />
        {/* Orange accent — bottom-right */}
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-[0.10] dark:opacity-[0.07]"
          style={{
            bottom: "5%",
            right: "10%",
            background: "radial-gradient(circle at center, #f59e0b 0%, transparent 70%)",
            filter: "blur(70px)",
            animation: "blob-d 14s ease-in-out infinite",
            animationDelay: "1s",
          }}
        />
      </div>

      {/* ── Content ───────────────────────────────────────── */}
      <div className="relative mx-auto max-w-6xl px-4 w-full">
        <div className="mx-auto flex min-h-[86svh] w-full flex-col items-center justify-center pt-[8vh] md:pt-[10vh] text-center">

          {/* Badge */}
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--brand-500)]/30 bg-[var(--brand-500)]/[0.08] px-4 py-1.5 text-sm font-medium text-[var(--brand-500)] opacity-0"
            style={{ animation: "hero-word-in 0.5s cubic-bezier(.2,.7,.3,1) 0.1s forwards" }}
          >
            <span className="text-xs">✦</span>
            AI-powered document toolkit
          </div>

          {/* Heading */}
          <h1
            id="hero-title"
            className="mx-auto max-w-3xl text-balance text-4xl font-black tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-tight"
          >
            <span className="bg-gradient-to-r from-[var(--brand-500)] via-[color:var(--fg)] to-emerald-400 bg-clip-text text-transparent block">
              <StaggerLine words={["Smarter", "PDFs."]} baseDelay={0.2} />
            </span>
            <span className="text-[color:var(--fg)]/80 block mt-1">
              <StaggerLine words={["Built", "for", "humans,"]} baseDelay={0.42} />
              {" "}
              <StaggerLine words={["powered", "by", "AI."]} baseDelay={0.66} />
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="mx-auto mt-7 max-w-xl text-lg text-[var(--muted)] md:text-xl opacity-0"
            style={{ animation: "hero-word-in 0.6s cubic-bezier(.2,.7,.3,1) 0.95s forwards" }}
          >
            PDFlex brings together the most powerful PDF tools — translation, compression,
            merging, protection, and automation — in one elegant interface.
          </p>

          {/* CTA buttons */}
          <div
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 opacity-0"
            style={{ animation: "hero-word-in 0.6s cubic-bezier(.2,.7,.3,1) 1.1s forwards" }}
          >
            <Link
              href="/dashboard"
              className="group inline-flex items-center justify-center rounded-full bg-[var(--brand-500)] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-[var(--brand-500)]/30 transition hover:scale-[1.03] hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]/50"
            >
              <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
              Try for free
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#pricing"
              className="inline-flex items-center justify-center rounded-full border border-[var(--card-border)] bg-[var(--card-bg)]/60 px-6 py-3 text-sm font-medium text-[color:var(--fg)] shadow-sm transition hover:bg-[color:var(--card-bg)]/80 hover:border-[var(--fg)]/20"
            >
              View plans
            </a>
          </div>

          {/* Trust line */}
          <p
            className="mt-4 text-xs text-[var(--muted)]/70 opacity-0"
            style={{ animation: "hero-word-in 0.6s cubic-bezier(.2,.7,.3,1) 1.25s forwards" }}
          >
            No credit card required&nbsp;·&nbsp;Cancel anytime
          </p>

          {/* Chips */}
          <div
            className="mt-12 flex flex-wrap items-center justify-center gap-4 text-sm text-[var(--muted)] opacity-0"
            style={{ animation: "hero-word-in 0.6s cubic-bezier(.2,.7,.3,1) 1.35s forwards" }}
          >
            <Chip icon={<Shield className="h-4 w-4 text-emerald-400" />} text="Privacy first" />
            <Divider />
            <Chip icon={<Zap className="h-4 w-4 text-yellow-400" />} text="Fast & reliable" />
            <Divider />
            <Chip icon={<Cpu className="h-4 w-4 text-[var(--brand-500)]" />} text="AI-powered" />

          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes hero-word-in {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blob-a {
          0%,100% { transform: translate(0,0) scale(1); }
          33%     { transform: translate(40px, 30px) scale(1.08); }
          66%     { transform: translate(-20px, 50px) scale(0.95); }
        }
        @keyframes blob-b {
          0%,100% { transform: translate(0,0) scale(1); }
          40%     { transform: translate(-50px, 40px) scale(1.1); }
          70%     { transform: translate(20px, -30px) scale(0.92); }
        }
        @keyframes blob-c {
          0%,100% { transform: translateX(-50%) scale(1); }
          50%     { transform: translateX(-50%) scale(1.15); }
        }
        @keyframes blob-d {
          0%,100% { transform: translate(0,0) scale(1); }
          45%     { transform: translate(-30px,-40px) scale(1.12); }
        }
      `}</style>
    </section>
  );
}

function Chip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-[var(--card-border)]/60 bg-[var(--card-bg)]/50 px-4 py-2 backdrop-blur-md transition hover:bg-[var(--card-bg)]/70 hover:border-[var(--fg)]/10">
      {icon}
      <span>{text}</span>
    </div>
  );
}

function Divider() {
  return <span className="hidden sm:block h-3 w-px bg-[var(--card-border)]/60" />;
}
