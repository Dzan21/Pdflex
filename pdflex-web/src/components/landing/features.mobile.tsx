// src/components/landing/features.mobile.tsx
"use client";

import {
  Languages,
  FileArchive,
  Merge,
  ShieldCheck,
  PenLine,
  Repeat2,
} from "lucide-react";

const items = [
  { icon: <Languages className="h-5 w-5 text-cyan-400" />, title: "Translate", desc: "AI-powered translation with layout preserved." },
  { icon: <FileArchive className="h-5 w-5 text-indigo-400" />, title: "Compress", desc: "Reduce file size without losing clarity." },
  { icon: <Merge className="h-5 w-5 text-emerald-400" />, title: "Merge & Split", desc: "Quickly combine or separate PDF files." },
  { icon: <PenLine className="h-5 w-5 text-amber-400" />, title: "Edit Basics", desc: "Reorder, rotate, tweak – frictionless." },
  { icon: <ShieldCheck className="h-5 w-5 text-rose-400" />, title: "Protect", desc: "Lock or anonymize documents securely." },
  { icon: <Repeat2 className="h-5 w-5 text-violet-400" />, title: "Automate", desc: "Save actions and run with a tap." },
];

export default function FeaturesMobile() {
  return (
    <section className="relative w-full px-4 py-16 overflow-hidden">
      {/* background gradient */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1000px 700px at 50% 120%, rgba(16,185,129,0.06), transparent), radial-gradient(1000px 700px at 50% -20%, rgba(99,102,241,0.05), transparent)",
        }}
      />

      <h2 className="text-center text-3xl font-bold bg-gradient-to-r from-[var(--brand-500)] to-emerald-400 bg-clip-text text-transparent">
        Tools that feel <span className="text-[color:var(--fg)]">invisible</span>
      </h2>
      <p className="mt-2 text-center text-sm text-muted">
        AI tools that stay out of your way but help you go faster.
      </p>

      <div className="mt-10 grid gap-4">
        {items.map((it, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)]/70 p-4 backdrop-blur-md"
          >
            <div className="h-10 w-10 rounded-full grid place-items-center bg-[color:var(--fg)]/[0.05] ring-1 ring-[color:var(--card-border)]/80">
              {it.icon}
            </div>
            <div>
              <h3 className="font-semibold text-sm">{it.title}</h3>
              <p className="text-xs text-muted">{it.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}