"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Moon, Sun, User, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

const NAV_LINKS = [
  { label: "Tools",   href: "/#tools" },
  { label: "Pricing", href: "/#pricing" },
  { label: "About",   href: "/about" },
];

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors duration-200"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

export default function MegaNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isDashboard = pathname?.startsWith("/dashboard");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleLogoClick = () => {
    router.push("/");
  };

  if (isDashboard) return null;

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
        "bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md",
        "border-b border-[var(--card-border)]",
        scrolled ? "shadow-sm shadow-black/[0.06]" : "shadow-none",
      ].join(" ")}
    >
      {/* flex row: logo | nav (desktop) | buttons */}
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between gap-4">

        {/* LEFT — Logo */}
        <div className="flex items-center">
          <button
            onClick={handleLogoClick}
            aria-label="Go to homepage"
            className="text-lg font-bold tracking-tight text-[var(--fg)] hover:opacity-75 transition-opacity"
          >
            PDF<span className="text-[var(--brand-500)]">lex</span>
          </button>
        </div>

        {/* CENTER — Nav links (desktop) */}
        <nav className="hidden md:flex items-center justify-center gap-7">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--muted)] hover:text-[var(--fg)] transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* RIGHT — Buttons */}
        <div className="flex items-center justify-end gap-2">
          <ThemeToggle />

          {user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-[var(--muted)] hover:text-[var(--fg)] transition-colors px-3 py-1.5"
              >
                <User className="w-4 h-4" />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 transition-colors px-3 py-1.5"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center text-sm font-medium text-[var(--fg)] border border-[var(--card-border)] hover:border-[var(--brand-500)] hover:text-[var(--brand-500)] transition-all duration-200 px-3.5 py-1.5 rounded-full"
              >
                Sign in
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center text-sm font-semibold bg-[var(--brand-500)] hover:bg-[var(--brand-600)] text-white px-4 py-1.5 rounded-full transition-colors duration-200 shadow-sm"
              >
                Try for free
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile fullscreen overlay */}
      <div
        className={[
          "md:hidden fixed inset-0 z-40 flex flex-col",
          "bg-white dark:bg-[#0f172a]",
          "transition-all duration-300 ease-in-out",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        style={{ top: 0 }}
        aria-hidden={!mobileOpen}
      >
        {/* Overlay header — mirrors navbar height */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--card-border)]">
          <button
            onClick={handleLogoClick}
            aria-label="Go to homepage"
            className="text-lg font-bold tracking-tight text-[var(--fg)]"
          >
            PDF<span className="text-[var(--brand-500)]">lex</span>
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col px-6 pt-6 gap-1 flex-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-3 text-xl font-semibold text-[var(--fg)] border-b border-[var(--card-border)] hover:text-[var(--brand-500)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <Link href="/dashboard" className="py-3 text-xl font-semibold text-[var(--fg)] border-b border-[var(--card-border)] hover:text-[var(--brand-500)] transition-colors">
              Dashboard
            </Link>
          )}
        </nav>

        {/* Auth buttons at bottom */}
        <div className="px-6 pb-10 flex flex-col gap-3">
          {user ? (
            <button
              onClick={handleLogout}
              className="w-full py-3 rounded-full border border-red-200 dark:border-red-800 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Sign out
            </button>
          ) : (
            <>
              <Link
                href="/dashboard"
                className="w-full py-3 rounded-full text-center text-sm font-semibold bg-[var(--brand-500)] hover:bg-[var(--brand-600)] text-white transition-colors shadow-sm"
              >
                Try for free
              </Link>
              <Link
                href="/login"
                className="w-full py-3 rounded-full text-center text-sm font-semibold border border-[var(--card-border)] text-[var(--fg)] hover:border-[var(--brand-500)] hover:text-[var(--brand-500)] transition-colors"
              >
                Sign in
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
