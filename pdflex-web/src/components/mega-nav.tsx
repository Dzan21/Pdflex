"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Moon, Sun, User, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

const NAV_LINKS = [
  { label: "Nástroje", href: "/#tools" },
  { label: "Cenník", href: "/#pricing" },
  { label: "O nás", href: "/about" },
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
      aria-label="Prepnúť tému"
      className="p-2 rounded-full hover:bg-[var(--card-bg)] transition-colors duration-200"
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
  const [isMobile, setIsMobile] = useState(false);
  const [ready, setReady] = useState(false);

  const isDashboard = pathname?.startsWith("/dashboard");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    const onResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setReady(true);
    };

    onResize();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const handleLogout = async () => {
    await logout();
    if (!ready) return;
    router.push(isMobile ? "/m" : "/");
  };

  const handleLogoClick = () => {
    if (!ready) return;
    router.push(isMobile ? "/m" : "/");
  };

  if (isDashboard) return null;

  return (
    <header
      className={[
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[var(--bg)]/80 backdrop-blur-md border-b border-[var(--card-border)] shadow-sm"
          : "bg-transparent border-b border-transparent",
      ].join(" ")}
    >
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <button
          onClick={handleLogoClick}
          aria-label="Prejsť na úvodnú stránku"
          className="text-lg font-bold tracking-tight text-[var(--fg)] hover:opacity-80 transition-opacity"
        >
          PDF<span className="text-[var(--brand-500)]">lex</span>
        </button>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-6">
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

        {/* Right side */}
        <div className="flex items-center gap-2">
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
                Odhlásiť
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center text-sm font-medium text-[var(--fg)] border border-[var(--card-border)] hover:border-[var(--brand-500)] hover:text-[var(--brand-500)] transition-all duration-200 px-3.5 py-1.5 rounded-full"
              >
                Prihlásiť sa
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center text-sm font-semibold bg-[var(--brand-500)] hover:bg-[var(--brand-600)] text-white px-4 py-1.5 rounded-full transition-colors duration-200 shadow-sm"
              >
                Vyskúšať zdarma
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-[var(--card-bg)] transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        className={[
          "md:hidden overflow-hidden transition-all duration-300 bg-[var(--bg)]/95 backdrop-blur-md border-b border-[var(--card-border)]",
          mobileOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <nav className="flex flex-col px-4 py-3 gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {!user && (
            <Link
              href="/login"
              className="mt-2 py-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
            >
              Prihlásiť sa
            </Link>
          )}
          {user && (
            <>
              <Link href="/dashboard" className="py-2 text-sm font-medium text-[var(--muted)]">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="py-2 text-sm text-left text-red-500"
              >
                Odhlásiť sa
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
