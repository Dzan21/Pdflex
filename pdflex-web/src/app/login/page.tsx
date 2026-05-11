// src/app/login/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Mail, Lock, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import MegaNav from "@/components/mega-nav";

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
      setInfo("Email successfully verified. You can now sign in.");
    }
  }, [qp]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true);
    try {
      await login(email, password);
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      aria-labelledby="login-title"
      className="relative isolate min-h-[100svh] overflow-hidden flex items-center justify-center px-4 py-16"
    >
      <MegaNav />
      {/* Background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-30">
        <div
          className="absolute inset-0 opacity-[0.3] dark:opacity-[0.12]"
          style={{
            backgroundImage: "radial-gradient(circle, var(--brand-500) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, var(--bg) 100%)" }}
        />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-[0.18] dark:opacity-[0.10]"
          style={{ top: "-15%", left: "-10%", background: "radial-gradient(circle at center, #327fff 0%, transparent 70%)", filter: "blur(72px)", animation: "auth-blob-a 16s ease-in-out infinite" }} />
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.14] dark:opacity-[0.09]"
          style={{ bottom: "-10%", right: "-8%", background: "radial-gradient(circle at center, #10b981 0%, transparent 70%)", filter: "blur(80px)", animation: "auth-blob-b 20s ease-in-out infinite", animationDelay: "3s" }} />
      </div>

      <div className="w-full max-w-md">
        {/* Logo above card */}
        <div className="mb-6 text-center">
          <Link href="/" className="inline-block text-2xl font-black tracking-tight text-[var(--fg)] hover:opacity-75 transition-opacity">
            PDF<span className="text-[var(--brand-500)]">lex</span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-xl shadow-black/[0.06] p-8">
          <header className="text-center mb-7">
            <h1 id="login-title" className="text-3xl font-black tracking-tight text-[var(--fg)]">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-[var(--muted)]">Sign in to your PDFlex account</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4">
            {info && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0" />{info}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[var(--fg)]">
                <Mail className="h-3.5 w-3.5 text-[var(--muted)]" /> Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--fg)] placeholder:text-[var(--muted)]/60 shadow-sm transition-all duration-200 focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/20"
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="flex items-center gap-1.5 text-sm font-medium text-[var(--fg)]">
                  <Lock className="h-3.5 w-3.5 text-[var(--muted)]" /> Password
                </label>
                <Link href="/reset-password" className="text-xs text-[var(--muted)] hover:text-[var(--brand-500)] transition-colors duration-200">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--bg)] px-4 py-3 pr-11 text-sm text-[var(--fg)] placeholder:text-[var(--muted)]/60 shadow-sm transition-all duration-200 focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/20"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
                  onMouseDown={() => setShowPassword(true)}
                  onMouseUp={() => setShowPassword(false)}
                  onMouseLeave={() => setShowPassword(false)}
                  onTouchStart={() => setShowPassword(true)}
                  onTouchEnd={() => setShowPassword(false)}
                  tabIndex={-1}
                  aria-label="Hold to show password"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-[var(--brand-500)] to-[var(--brand-600)] py-3 text-sm font-semibold text-white shadow-md shadow-[var(--brand-500)]/25 transition-all duration-200 hover:brightness-110 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
                </span>
              ) : "Sign in"}
            </button>

            {/* Divider */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--card-border)]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[var(--card-bg)] px-3 text-xs text-[var(--muted)]">or continue with</span>
              </div>
            </div>

            {/* Social placeholder */}
            <button
              type="button"
              disabled
              className="w-full rounded-xl border border-[var(--card-border)] py-3 text-sm font-medium text-[var(--muted)] transition-colors hover:bg-[var(--bg)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Google — coming soon
            </button>
          </form>
        </div>

        {/* Below card */}
        <p className="mt-5 text-center text-sm text-[var(--muted)]">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-[var(--brand-500)] hover:underline transition-colors">
            Create one →
          </Link>
        </p>
      </div>

      <style jsx>{`
        @keyframes auth-blob-a { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,40px) scale(1.08)} }
        @keyframes auth-blob-b { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-30px,-30px) scale(1.06)} }
      `}</style>
    </section>
  );
}
