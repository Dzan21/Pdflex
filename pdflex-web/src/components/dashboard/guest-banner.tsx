"use client";

import Link from "next/link";
import { UserPlus, X } from "lucide-react";
import { useState } from "react";

interface GuestBannerProps {
  usesLeft: number;
}

export function GuestBanner({ usesLeft }: GuestBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-[var(--brand-500)]/30 bg-[var(--brand-500)]/[0.07] px-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <UserPlus className="h-4 w-4 shrink-0 text-[var(--brand-500)]" />
        <p className="text-sm text-[var(--fg)]">
          You're using PDFlex as a guest —{" "}
          <span className="font-semibold">
            {usesLeft > 0 ? `${usesLeft} free use${usesLeft !== 1 ? "s" : ""} remaining` : "no free uses left"}
          </span>
          .{" "}
          <Link
            href="/register"
            className="font-semibold text-[var(--brand-500)] hover:underline"
          >
            Register for more →
          </Link>
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="shrink-0 rounded p-1 text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
