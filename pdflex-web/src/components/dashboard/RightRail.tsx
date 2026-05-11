"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { CreditCard, Settings, User2, LogOut, Menu } from "lucide-react";

const ITEMS = [
  { href: "/dashboard/account", label: "Profil", icon: User2 },
  { href: "/dashboard/settings", label: "Nastavenia", icon: Settings },
  { href: "/dashboard/billing", label: "Platby", icon: CreditCard },
  { href: "/logout", label: "Odhlásiť", icon: LogOut },
];

export default function RightRail() {
  const [open, setOpen] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!railRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const wrapEvents = isTouch
    ? { onClick: () => setOpen(v => !v) }
    : {
        onMouseEnter: () => setOpen(true),
        onMouseLeave: () => setOpen(false),
      };

  return (
    <div
      ref={railRef}
      className="fixed inset-y-0 right-0 z-50 flex items-center pr-2 sm:pr-4"
      {...wrapEvents}
    >
      <button
        aria-label="Otvoriť panel"
        className="group relative mr-2 grid h-10 w-10 place-items-center rounded-full border border-[var(--card-border)] bg-[var(--card-bg)]/80 backdrop-blur-md shadow-sm hover:brightness-105 transition"
        onClick={isTouch ? () => setOpen(v => !v) : undefined}
      >
        <Menu className="h-5 w-5 text-[var(--fg)]/80" />
      </button>

      <div
        role="menu"
        aria-hidden={!open}
        className={`relative overflow-hidden rounded-2xl border backdrop-blur-xl shadow-2xl border-[var(--card-border)] bg-[var(--card-bg)]/85 transition-all duration-200 ${
          open
            ? "opacity-100 translate-x-0"
            : "pointer-events-none opacity-0 translate-x-2"
        }`}
        style={{ width: 260 }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(600px 300px at 80% -10%, rgba(99,102,241,.08), transparent 60%), radial-gradient(600px 300px at 20% 110%, rgba(16,185,129,.08), transparent 60%)",
          }}
        />
        <div className="relative p-3">
          <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted">
            Môj účet
          </div>
          <nav className="flex flex-col gap-1">
            {ITEMS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-[var(--bg)]/60 transition border border-transparent"
                onClick={() => setOpen(false)}
              >
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-[color:var(--fg)]/[0.05] ring-1 ring-[color:var(--card-border)]/80">
                  <Icon className="h-4.5 w-4.5 text-[var(--fg)]/80" />
                </span>
                <span className="text-sm">{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
