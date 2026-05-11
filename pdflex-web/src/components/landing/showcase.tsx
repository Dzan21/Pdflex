// src/components/landing/showcase.tsx
"use client";

import { FileText, Languages, Scissors, Sparkles } from "lucide-react";

export default function Showcase() {
  const cards = [
    { icon: <Languages className="h-6 w-6 text-[var(--brand-500)]" />, title: "Preklad na 1 klik", desc: "Nahraj PDF, vyber jazyk, a zachová sa presný layout." },
    { icon: <FileText className="h-6 w-6 text-emerald-400" />, title: "Kompresia s náhľadom", desc: "Optimalizuj pre web alebo tlač — s vizuálnym porovnaním." },
    { icon: <Scissors className="h-6 w-6 text-indigo-400" />, title: "Zlučovanie & rozdeľovanie", desc: "Drag & drop stránky, presné poradie, export za sekundu." },
  ];

  const floatA = "show-float-a 11s ease-in-out infinite";
  const floatB = "show-float-b 13s ease-in-out infinite";
  const floatC = "show-float-c 12s ease-in-out infinite";

  return (
    <section id="showcase" className="relative isolate w-full min-h-[100svh] overflow-hidden flex items-center justify-center">
      {/* ambient bg */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1400px 900px at 50% 120%, color-mix(in oklab, #10b981 12%, transparent), transparent 65%), radial-gradient(1400px 900px at 50% -20%, color-mix(in oklab, var(--brand-500) 14%, transparent), transparent 65%)",
        }}
      />
      {/* glass bubbles (rovnaký štýl) */}
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
        <div className="mx-auto max-w-3xl">
          <h2 className="bg-gradient-to-r from-[var(--brand-500)] via-emerald-400 to-[var(--brand-500)] bg-clip-text text-3xl font-extrabold text-transparent md:text-5xl">
            Ako to vyzerá v praxi
          </h2>
          <p className="mt-3 text-lg text-muted">
            Krásne animácie, okamžité výsledky, bez tréningu.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)]/80 p-6 text-left shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
            >
              <div
                aria-hidden
                className="absolute inset-0 opacity-0 transition group-hover:opacity-100"
                style={{ background: "radial-gradient(400px 200px at 50% 0%, rgba(99,102,241,.08), transparent 70%)" }}
              />
              <div className="relative z-10 flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-[color:var(--fg)]/[0.05] ring-1 ring-[color:var(--card-border)]/80 backdrop-blur-sm">
                  {c.icon}
                </div>
                <div>
                  <div className="font-semibold text-[color:var(--fg)]">{c.title}</div>
                  <div className="mt-1 text-sm text-muted">{c.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)]/60 px-4 py-2 text-xs text-muted backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-[var(--brand-500)]" />
            <span>Jednoduchosť, ktorá ťa baví používať</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes show-float-a { 0%,100%{transform:translate3d(0,0,0)} 50%{transform:translate3d(0,-20px,0)} }
        @keyframes show-float-b { 0%,100%{transform:translate3d(0,0,0)} 50%{transform:translate3d(0,-24px,0)} }
        @keyframes show-float-c { 0%,100%{transform:translate3d(-50%,0,0)} 50%{transform:translate3d(-50%,-22px,0)} }
      `}</style>
    </section>
  );
}