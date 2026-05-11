// src/components/landing/features.tsx
"use client";

import {
  Languages,
  FileArchive,
  Merge,
  ShieldCheck,
  PenLine,
  Repeat2,
} from "lucide-react";
import * as React from "react";

const items = [
  { icon: <Languages className="h-6 w-6 text-cyan-400" />,   title: "Translate",    desc: "AI translation powered by DeepL — layout preserved, context intact." },
  { icon: <FileArchive className="h-6 w-6 text-indigo-400" />, title: "Compress",     desc: "Reduce file size while keeping every pixel crisp and readable." },
  { icon: <Merge className="h-6 w-6 text-emerald-400" />,      title: "Merge & Split",desc: "Combine or separate PDFs effortlessly with pixel precision." },
  { icon: <PenLine className="h-6 w-6 text-amber-400" />,      title: "Edit Basics",  desc: "Reorder, rotate, tweak — minimal friction, instant feedback." },
  { icon: <ShieldCheck className="h-6 w-6 text-rose-400" />,   title: "Protect",      desc: "Add passwords, redact, and sign documents with confidence." },
  { icon: <Repeat2 className="h-6 w-6 text-violet-400" />,     title: "Automate",     desc: "Save your favorite actions and repeat them with one click." },
];

const floatA = "features-float-a 11s ease-in-out infinite";
const floatB = "features-float-b 13s ease-in-out infinite";
const floatC = "features-float-c 12s ease-in-out infinite";

export default function Features() {
  return (
    <section aria-labelledby="features-title" className="relative isolate w-full min-h-[100svh] overflow-hidden flex items-center justify-center">
      {/* ambient bg */}
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
          background: "radial-gradient(closest-side,rgba(255,255,255,.55),rgba(255,255,255,.22),transparent)",
          boxShadow: "0 0 180px 44px rgba(99,102,241,.10)",
          animation: floatA,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-60px] top-24 -z-10 h-[720px] w-[720px] rounded-[40%] blur-3xl"
        style={{
          background: "radial-gradient(closest-side,rgba(255,255,255,.52),rgba(255,255,255,.18),transparent)",
          boxShadow: "0 0 200px 56px rgba(16,185,129,.10)",
          animation: floatB,
          animationDelay: "1.2s",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 bottom-[-60px] -z-10 h-[700px] w-[700px] -translate-x-1/2 rounded-[42%] blur-3xl"
        style={{
          background: "radial-gradient(closest-side,rgba(255,255,255,.48),rgba(255,255,255,.16),transparent)",
          boxShadow: "0 0 220px 60px rgba(99,102,241,.08)",
          animation: floatC,
          animationDelay: "2s",
        }}
      />

      <div className="container relative mx-auto max-w-6xl px-4 text-center">
        <h2 id="features-title" className="text-balance bg-gradient-to-r from-[var(--brand-500)] to-emerald-400 bg-clip-text text-4xl font-black text-transparent md:text-5xl">
          Tools that feel <span className="text-[color:var(--fg)]">invisible</span>
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted md:text-lg">
          The future of document control — minimal, precise, and powered by AI.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <div
              key={it.title}
              className="group relative overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)]/70 p-6 text-left shadow-sm backdrop-blur-sm transition-all duration-400 hover:shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-[color:var(--fg)]/[0.05] ring-1 ring-[color:var(--card-border)]/80 backdrop-blur-sm">
                  {it.icon}
                </div>
                <h3 className="text-base font-semibold">{it.title}</h3>
              </div>
              <p className="mt-3 text-sm text-muted">{it.desc}</p>
              <div className="mt-5 h-[2px] w-0 bg-[var(--brand-500)] transition-all duration-400 group-hover:w-1/3" />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes features-float-a { 0%,100%{transform:translate3d(0,0,0)} 50%{transform:translate3d(0,-20px,0)} }
        @keyframes features-float-b { 0%,100%{transform:translate3d(0,0,0)} 50%{transform:translate3d(0,-24px,0)} }
        @keyframes features-float-c { 0%,100%{transform:translate3d(-50%,0,0)} 50%{transform:translate3d(-50%,-22px,0)} }
      `}</style>
    </section>
  );
}