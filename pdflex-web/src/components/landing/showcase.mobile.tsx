// src/components/landing/showcase.mobile.tsx
"use client";

import { FileText, Languages, Scissors, Sparkles } from "lucide-react";

export default function ShowcaseMobile() {
  const cards = [
    { icon: <Languages className="h-5 w-5 text-[var(--brand-500)]" />, title: "Preklad na 1 klik", desc: "Nahraj PDF, vyber jazyk, a zachová sa layout." },
    { icon: <FileText className="h-5 w-5 text-emerald-400" />, title: "Kompresia s náhľadom", desc: "Optimalizuj pre web alebo tlač." },
    { icon: <Scissors className="h-5 w-5 text-indigo-400" />, title: "Zlučovanie & rozdeľovanie", desc: "Drag & drop poradie, export za sekundu." },
  ];

  return (
    <section className="relative w-full px-4 py-16 overflow-hidden">
      {/* background */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1000px 700px at 50% 120%, rgba(16,185,129,0.06), transparent), radial-gradient(1000px 700px at 50% -20%, rgba(99,102,241,0.05), transparent)",
        }}
      />

      <h2 className="text-center text-3xl font-extrabold bg-gradient-to-r from-[var(--brand-500)] via-emerald-400 to-[var(--brand-500)] bg-clip-text text-transparent">
        Ako to vyzerá v praxi
      </h2>
      <p className="mt-2 text-center text-sm text-muted">
        Animácie, ktoré pomáhajú — nie prekážajú.
      </p>

      <div className="mt-10 grid gap-4">
        {cards.map((card, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)]/70 p-4 backdrop-blur-md"
          >
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[color:var(--fg)]/[0.05] ring-1 ring-[color:var(--card-border)]/80">
              {card.icon}
            </div>
            <div>
              <h3 className="text-sm font-semibold">{card.title}</h3>
              <p className="text-xs text-muted">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)]/60 px-4 py-2 text-xs text-muted backdrop-blur-sm">
          <Sparkles className="h-4 w-4 text-[var(--brand-500)]" />
          <span>Jednoduchosť, ktorá ťa baví používať</span>
        </div>
      </div>
    </section>
  );
}