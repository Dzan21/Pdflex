// src/app/login/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Mail, Lock, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [info, setInfo] = React.useState<string | null>(null);
  const router = useRouter();
  const qp = useSearchParams();
  const { login } = useAuth();

  React.useEffect(() => {
    if (qp.get("verified") === "1") {
      setInfo("E-mail úspešne overený. Môžeš sa prihlásiť.");
    }
  }, [qp]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (!email || !password) {
      setError("Vyplň e-mail aj heslo.");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Niečo sa pokazilo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.section
      aria-labelledby="login-title"
      className="relative isolate min-h-[100svh] overflow-hidden"
      initial={{ opacity: 0, y: 18, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ambient background */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 700px at 15% -10%, color-mix(in oklab, var(--brand-500) 16%, transparent), transparent 60%), radial-gradient(1000px 600px at 85% 110%, color-mix(in oklab, #10b981 14%, transparent), transparent 65%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* bubbles */}
      <motion.div
        aria-hidden
        className="blob absolute left-[-100px] top-[80px] h-[480px] w-[480px] rounded-[42%] blur-3xl opacity-80"
        style={{
          background:
            "radial-gradient(closest-side,rgba(255,255,255,.65),rgba(255,255,255,.15),transparent)",
          animation: "auth-float-a 13s ease-in-out infinite",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      />
      <motion.div
        aria-hidden
        className="blob absolute right-[-60px] bottom-[120px] h-[540px] w-[540px] rounded-[40%] blur-3xl opacity-70"
        style={{
          background:
            "radial-gradient(closest-side,rgba(255,255,255,.45),rgba(255,255,255,.1),transparent)",
          animation: "auth-float-b 16s ease-in-out infinite 2s",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      />

      {/* content */}
      <div className="container relative z-10 mx-auto flex min-h-[100svh] w-full items-center justify-center px-4 py-16">
        <motion.div
          className="relative w-full max-w-md"
          initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        >
          <div className="relative rounded-2xl border border-white/30 bg-white/15 dark:border-white/10 dark:bg-white/5 backdrop-blur-[22px] shadow-[0_8px_60px_-12px_rgba(0,0,0,0.25)]">
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.20] to-white/[0.04] dark:from-white/[0.06] dark:to-transparent" />
            <div className="relative p-6 md:p-8">
              <header className="text-center">
                <h1
                  id="login-title"
                  className="bg-gradient-to-r from-[var(--brand-500)] to-emerald-400 bg-clip-text text-3xl font-extrabold text-transparent md:text-4xl"
                >
                  Prihlásiť sa
                </h1>
                <p className="mx-auto mt-2 max-w-sm text-muted">
                  Vitaj späť. Zadaj prístupové údaje a pokračuj.
                </p>
              </header>

              <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                {info && (
                  <div className="flex items-center gap-2 rounded-md border border-emerald-300/70 bg-emerald-50/60 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200">
                    <CheckCircle2 className="h-4 w-4" />
                    {info}
                  </div>
                )}

                <label className="block">
                  <span className="mb-1 inline-flex items-center gap-2 text-sm font-medium">
                    <Mail className="h-4 w-4 text-accent" /> E-mail
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ja@example.com"
                    autoComplete="email"
                    className="w-full rounded-md border border-white/40 bg-white/20 px-3 py-2 text-[color:var(--fg)] placeholder:text-white/60 shadow-sm backdrop-blur-md focus:border-[var(--brand-500)] focus:ring-1 focus:ring-[var(--brand-500)] transition"
                    required
                  />
                </label>

                {/* Password + eye (hold-to-show) */}
                <label className="relative block">
                  <span className="mb-1 inline-flex items-center gap-2 text-sm font-medium">
                    <Lock className="h-4 w-4 text-accent" /> Heslo
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full rounded-md border border-white/40 bg-white/20 px-3 py-2 pr-10 text-[color:var(--fg)] placeholder:text-white/60 shadow-sm backdrop-blur-md focus:border-[var(--brand-500)] focus:ring-1 focus:ring-[var(--brand-500)] transition"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-[34px] text-white/70 transition hover:text-white"
                    onMouseDown={() => setShowPassword(true)}
                    onMouseUp={() => setShowPassword(false)}
                    onMouseLeave={() => setShowPassword(false)}
                    onTouchStart={() => setShowPassword(true)}
                    onTouchEnd={() => setShowPassword(false)}
                    tabIndex={-1}
                    aria-label="Zobraziť heslo dočasne"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </label>

                {error && (
                  <div className="rounded-md border border-red-300/70 bg-red-50/60 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-200">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn w-full rounded-lg bg-gradient-to-r from-[var(--brand-500)] to-emerald-500 px-4 py-2 font-semibold text-white shadow-md backdrop-blur-sm transition hover:brightness-95 disabled:opacity-60"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Prihlasujem…
                    </span>
                  ) : (
                    "Prihlásiť sa"
                  )}
                </button>
              </form>

              <div className="mt-5 flex items-center justify-between text-sm">
                <Link href="/register" className="underline hover:opacity-80">
                  Nemáš účet? Registruj sa
                </Link>
                <Link href="/reset-password" className="text-muted hover:underline">
                  Zabudnuté heslo
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* noise */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/></filter><rect width='140' height='140' filter='url(%23n)' opacity='.25'/></svg>\")",
          backgroundSize: "320px 320px",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.03 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      />

      <style jsx>{`
        @keyframes auth-float-a {
          0%,100% { transform: translate3d(0,0,0) }
          50% { transform: translate3d(0,-14px,0) }
        }
        @keyframes auth-float-b {
          0%,100% { transform: translate3d(0,0,0) }
          50% { transform: translate3d(0,-18px,0) }
        }
        @media (prefers-reduced-motion: reduce) {
          .blob { animation: none !important; }
        }
      `}</style>
    </motion.section>
  );
}