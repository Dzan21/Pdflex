"use client";

import Link from "next/link";
import { Sparkles, X } from "lucide-react";

interface GuestModalProps {
  onClose: () => void;
}

export function GuestModal({ onClose }: GuestModalProps) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" aria-hidden />

      {/* Panel */}
      <div className="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl shadow-black/20 text-center">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-[var(--brand-500)]/10">
          <Sparkles className="h-7 w-7 text-[var(--brand-500)]" />
        </div>

        <h2 className="text-xl font-black tracking-tight text-slate-900">
          You've used your free tries
        </h2>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          Create a free account to keep going — unlimited access to all tools,
          no credit card required.
        </p>

        <div className="mt-7 flex flex-col gap-3">
          <Link
            href="/register"
            className="block w-full rounded-xl bg-gradient-to-r from-[var(--brand-500)] to-[var(--brand-600)] py-3 text-sm font-semibold text-white shadow-md shadow-[var(--brand-500)]/25 transition-all hover:brightness-110 hover:scale-[1.01]"
          >
            Create free account
          </Link>
          <button
            onClick={onClose}
            className="block w-full rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            Maybe later
          </button>
        </div>

        <p className="mt-4 text-xs text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--brand-500)] hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
