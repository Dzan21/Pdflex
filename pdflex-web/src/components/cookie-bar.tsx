// src/components/cookie-bar.tsx
"use client";

import { useEffect, useState } from "react";

export default function CookieBar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ok = localStorage.getItem("cookie_ok");
    if (!ok) setOpen(true);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--card-border)] bg-[var(--bg)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-3 px-4 py-3 text-sm md:flex-row md:items-center md:justify-between">
        <p className="max-w-3xl text-muted">
          Pomáhame si cookies na meranie návštevnosti a zlepšovanie produktu. Žiadne sledovanie tretích strán.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              localStorage.setItem("cookie_ok", "1");
              setOpen(false);
            }}
            className="rounded-md bg-[var(--brand-500)] px-4 py-1.5 text-white hover:brightness-95"
          >
            Akceptovať
          </button>
          <button
            onClick={() => setOpen(false)}
            className="rounded-md border border-[var(--card-border)] px-4 py-1.5"
          >
            Zavrieť
          </button>
        </div>
      </div>
    </div>
  );
}