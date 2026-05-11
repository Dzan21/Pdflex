// src/app/register/page.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, Lock, User, Eye, EyeOff, CheckCircle2 } from "lucide-react";

import MegaNav from "@/components/mega-nav";

const API = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:4000";

type RegState = { name: string; email: string; password: string };
type ApiError = { error?: string };

function getStrength(pw: string): 0 | 1 | 2 | 3 {
  if (pw.length === 0) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score as 0 | 1 | 2 | 3;
}

const STRENGTH_LABELS = ["", "Weak", "Fair", "Strong"];
const STRENGTH_COLORS = ["", "bg-red-500", "bg-yellow-400", "bg-emerald-500"];
const STRENGTH_TEXT   = ["", "text-red-500", "text-yellow-500", "text-emerald-500"];

export default function RegisterPage() {
  const [form, setForm] = React.useState<RegState>({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = React.useState(false);
  const [agreed, setAgreed] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [info, setInfo] = React.useState<string | null>(null);
  const router = useRouter();

  const strength = getStrength(form.password);

  const onChange = (key: keyof RegState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((s) => ({ ...s, [key]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (!form.email || !form.password) { setError("Please enter your email and password."); return; }
    if (!agreed) { setError("You must agree to the terms to continue."); return; }
    setLoading(true);
    try {
      // 1) register
      {
        const res = await fetch(`${API}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, password: form.password, name: form.name || undefined }),
          credentials: "include",
        });
        const data = (await res.json()) as ApiError | any;
        if (!res.ok) throw new Error(data?.error || "Registration failed.");
      }
      // 2) auto-login
      {
        const res = await fetch(`${API}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, password: form.password }),
          credentials: "include",
        });
        const data = (await res.json()) as ApiError | any;
        if (!res.ok || !data?.accessToken) throw new Error(data?.error || "Auto-login failed.");
        localStorage.setItem("pdflex_access_token", data.accessToken);
      }
      setInfo("Account created! Check your email to verify.");
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      aria-labelledby="register-title"
      className="relative isolate min-h-[100svh] overflow-hidden flex items-center justify-center px-4 py-16"
    >
      <MegaNav />
      {/* Background — same as login */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-30">
        <div
          className="absolute inset-0 opacity-[0.3] dark:opacity-[0.12]"
          style={{ backgroundImage: "radial-gradient(circle, var(--brand-500) 1px, transparent 1px)", backgroundSize: "36px 36px" }}
        />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, var(--bg) 100%)" }} />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-[0.18] dark:opacity-[0.10]"
          style={{ top: "-15%", left: "-10%", background: "radial-gradient(circle at center, #327fff 0%, transparent 70%)", filter: "blur(72px)", animation: "reg-blob-a 16s ease-in-out infinite" }} />
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.14] dark:opacity-[0.09]"
          style={{ bottom: "-10%", right: "-8%", background: "radial-gradient(circle at center, #10b981 0%, transparent 70%)", filter: "blur(80px)", animation: "reg-blob-b 20s ease-in-out infinite", animationDelay: "3s" }} />
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-6 text-center">
          <Link href="/" className="inline-block text-2xl font-black tracking-tight text-[var(--fg)] hover:opacity-75 transition-opacity">
            PDF<span className="text-[var(--brand-500)]">lex</span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-xl shadow-black/[0.06] p-8">
          <header className="text-center mb-7">
            <h1 id="register-title" className="text-3xl font-black tracking-tight text-[var(--fg)]">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Start for free. Upgrade whenever you're ready.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[var(--fg)]">
                <User className="h-3.5 w-3.5 text-[var(--muted)]" /> Name <span className="text-[var(--muted)] font-normal">(optional)</span>
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={onChange("name")}
                placeholder="Jane Smith"
                className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--fg)] placeholder:text-[var(--muted)]/60 shadow-sm transition-all duration-200 focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/20"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[var(--fg)]">
                <Mail className="h-3.5 w-3.5 text-[var(--muted)]" /> Email
              </label>
              <input
                id="reg-email"
                type="email"
                value={form.email}
                onChange={onChange("email")}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--fg)] placeholder:text-[var(--muted)]/60 shadow-sm transition-all duration-200 focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/20"
              />
            </div>

            {/* Password + strength */}
            <div>
              <label htmlFor="reg-password" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[var(--fg)]">
                <Lock className="h-3.5 w-3.5 text-[var(--muted)]" /> Password
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={onChange("password")}
                  placeholder="••••••••"
                  autoComplete="new-password"
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

              {/* Strength indicator */}
              {form.password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength ? STRENGTH_COLORS[strength] : "bg-[var(--card-border)]"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`mt-1 text-xs font-medium ${STRENGTH_TEXT[strength]}`}>
                    {STRENGTH_LABELS[strength]}
                  </p>
                </div>
              )}
            </div>

            {/* Messages */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                {error}
              </div>
            )}
            {info && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0" />{info}
              </div>
            )}

            {/* Terms checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-[var(--card-border)] accent-[var(--brand-500)] cursor-pointer"
              />
              <span className="text-xs text-[var(--muted)] leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" className="text-[var(--brand-500)] hover:underline">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-[var(--brand-500)] hover:underline">Privacy Policy</Link>
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-[var(--brand-500)] to-[var(--brand-600)] py-3 text-sm font-semibold text-white shadow-md shadow-[var(--brand-500)]/25 transition-all duration-200 hover:brightness-110 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Creating account…
                </span>
              ) : "Create account"}
            </button>
          </form>
        </div>

        {/* Below card */}
        <p className="mt-5 text-center text-sm text-[var(--muted)]">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[var(--brand-500)] hover:underline transition-colors">
            Sign in →
          </Link>
        </p>
      </div>

      <style jsx>{`
        @keyframes reg-blob-a { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,40px) scale(1.08)} }
        @keyframes reg-blob-b { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-30px,-30px) scale(1.06)} }
      `}</style>
    </section>
  );
}
