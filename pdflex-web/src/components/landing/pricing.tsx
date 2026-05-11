"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

/* ── Types ─────────────────────────────────────────── */

interface Plan {
  id: string;
  name: string;
  badge?: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  description: string;
  cta: string;
  ctaHref: string;
  highlighted: boolean;
  features: string[];
}

/* ── Plan data ──────────────────────────────────────── */

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Everything you need to get started.",
    cta: "Get started for free",
    ctaHref: "/register",
    highlighted: false,
    features: [
      "10 documents / month",
      "Max 5 pages / document",
      "Max 10 MB / file",
      "Conversions (3× / month)",
      "Basic compression",
      "PDFlex watermark",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    badge: "Most popular",
    monthlyPrice: 8.99,
    yearlyPrice: 89,
    description: "For professionals who move fast.",
    cta: "Try Pro",
    ctaHref: "/register?plan=pro",
    highlighted: true,
    features: [
      "100 documents / month",
      "Max 200 pages / document",
      "Max 50 MB / file",
      "All conversions — unlimited",
      "All editing tools",
      "AI Translate — 30+ languages",
      "AI Summarization",
      "Smart Compress",
      "No watermark",
      "Priority queue",
      "Email support",
    ],
  },
  {
    id: "business",
    name: "Business",
    monthlyPrice: 24.99,
    yearlyPrice: 249,
    description: "Scale without limits.",
    cta: "Contact sales",
    ctaHref: "/contact",
    highlighted: false,
    features: [
      "Unlimited documents",
      "Unlimited pages",
      "Max 200 MB / file",
      "All tools + AI Chat with PDF",
      "Batch processing (10 files)",
      "API access",
      "OCR",
      "E-Signature",
      "Custom watermark",
      "Dedicated support",
      "Company invoice",
    ],
  },
];

/* ── Toggle ─────────────────────────────────────────── */

function BillingToggle({
  yearly,
  onChange,
}: {
  yearly: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] p-1">
      <button
        onClick={() => onChange(false)}
        className={[
          "rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
          !yearly
            ? "bg-[var(--brand-500)] text-white shadow-sm"
            : "text-[var(--muted)] hover:text-[var(--fg)]",
        ].join(" ")}
      >
        Monthly
      </button>
      <button
        onClick={() => onChange(true)}
        className={[
          "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
          yearly
            ? "bg-[var(--brand-500)] text-white shadow-sm"
            : "text-[var(--muted)] hover:text-[var(--fg)]",
        ].join(" ")}
      >
        Yearly
        <span
          className={[
            "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide transition-colors",
            yearly
              ? "bg-white/20 text-white"
              : "bg-emerald-500/15 text-emerald-500",
          ].join(" ")}
        >
          −2 months
        </span>
      </button>
    </div>
  );
}

/* ── Price display ──────────────────────────────────── */

function Price({ plan, yearly }: { plan: Plan; yearly: boolean }) {
  const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;

  if (price === 0) {
    return (
      <div className="mt-6 flex items-end gap-1">
        <span className="text-5xl font-black text-[var(--fg)]">€0</span>
        <span className="mb-1.5 text-sm text-[var(--muted)]">forever</span>
      </div>
    );
  }

  return (
    <div className="mt-6 flex items-end gap-1">
      <span className="text-5xl font-black text-[var(--fg)]">
        €{yearly ? price : price?.toFixed(2)}
      </span>
      <span className="mb-1.5 text-sm text-[var(--muted)]">
        {yearly ? "/ year" : "/ month"}
      </span>
    </div>
  );
}

/* ── Card ───────────────────────────────────────────── */

function PlanCard({ plan, yearly }: { plan: Plan; yearly: boolean }) {
  return (
    <div
      className={[
        "relative flex flex-col rounded-2xl border p-8 transition-all duration-200",
        plan.highlighted
          ? "border-[var(--brand-500)] border-2 shadow-xl shadow-[var(--brand-500)]/10 scale-[1.03] bg-[var(--card-bg)]"
          : "border-[var(--card-border)] bg-[var(--card-bg)] hover:shadow-lg hover:border-[var(--brand-500)]/40",
      ].join(" ")}
    >
      {/* Popular badge */}
      {plan.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-[var(--brand-500)] px-4 py-1 text-xs font-bold text-white shadow-md shadow-[var(--brand-500)]/30">
            ★ {plan.badge}
          </span>
        </div>
      )}

      {/* Header */}
      <div>
        <h3 className="text-lg font-bold text-[var(--fg)]">{plan.name}</h3>
        <p className="mt-1 text-sm text-[var(--muted)]">{plan.description}</p>
        <Price plan={plan} yearly={yearly} />
        {yearly && plan.monthlyPrice !== 0 && (
          <p className="mt-1 text-xs text-[var(--muted)]">
            ≈ €{((plan.yearlyPrice ?? 0) / 12).toFixed(2)} / month
          </p>
        )}
      </div>

      {/* CTA */}
      <Link
        href={plan.ctaHref}
        className={[
          "mt-8 block rounded-full py-2.5 text-center text-sm font-semibold transition-all duration-200",
          plan.highlighted
            ? "bg-[var(--brand-500)] text-white shadow-md shadow-[var(--brand-500)]/25 hover:bg-[var(--brand-600)] hover:scale-[1.02]"
            : "border border-[var(--card-border)] text-[var(--fg)] hover:border-[var(--brand-500)] hover:text-[var(--brand-500)]",
        ].join(" ")}
      >
        {plan.cta}
      </Link>

      {/* Divider */}
      <div className="my-6 h-px w-full bg-[var(--card-border)]" />

      {/* Feature list */}
      <ul className="flex flex-col gap-3">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--muted)]">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-500)]" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Section ────────────────────────────────────────── */

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="relative w-full py-24 md:py-32 overflow-hidden"
    >
      {/* Background — dot grid + vignette + blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-30">
        <div
          className="absolute inset-0 opacity-[0.35] dark:opacity-[0.15]"
          style={{
            backgroundImage: "radial-gradient(circle, var(--brand-500) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, var(--bg) 100%)",
          }}
        />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
        <div
          className="absolute w-[700px] h-[500px] rounded-full opacity-[0.12] dark:opacity-[0.08]"
          style={{
            top: "10%", left: "-10%",
            background: "radial-gradient(circle at center, var(--brand-500) 0%, transparent 70%)",
            filter: "blur(80px)",
            animation: "pricing-blob-a 18s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-[0.10] dark:opacity-[0.07]"
          style={{
            bottom: "0%", right: "-5%",
            background: "radial-gradient(circle at center, #10b981 0%, transparent 70%)",
            filter: "blur(90px)",
            animation: "pricing-blob-b 22s ease-in-out infinite",
            animationDelay: "4s",
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2
            id="pricing-title"
            className="text-4xl font-black tracking-tight md:text-5xl"
          >
            <span className="text-[var(--fg)]">Simple, </span>
            <span className="bg-gradient-to-r from-[var(--brand-500)] to-emerald-400 bg-clip-text text-transparent">
              transparent pricing
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[var(--muted)]">
            Start for free. Upgrade when you need more.
          </p>

          {/* Toggle */}
          <div className="mt-8 flex justify-center">
            <BillingToggle yearly={yearly} onChange={setYearly} />
          </div>
        </div>

        {/* Cards */}
        <div className="grid gap-6 lg:grid-cols-3 items-center">
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} yearly={yearly} />
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-10 text-center text-xs text-[var(--muted)]">
          All prices in EUR, VAT may apply. Cancel anytime.
        </p>
      </div>

      <style jsx>{`
        @keyframes pricing-blob-a {
          0%,100% { transform: translate(0,0) scale(1); }
          50%     { transform: translate(30px,40px) scale(1.1); }
        }
        @keyframes pricing-blob-b {
          0%,100% { transform: translate(0,0) scale(1); }
          50%     { transform: translate(-40px,-30px) scale(1.08); }
        }
      `}</style>
    </section>
  );
}
