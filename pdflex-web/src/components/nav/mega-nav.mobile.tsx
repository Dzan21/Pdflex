"use client";

import { useAuth } from "@/components/auth-provider";
import { LogOut, Menu, Moon, Sun, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MegaNavMobile() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [ready, setReady] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  const isDashboard = pathname?.startsWith("/dashboard");

  useEffect(() => {
    // Téma
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);

    // Mobil detekcia cez screen width
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      setReady(true);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

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
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between bg-[var(--bg)] px-4 shadow-md">
        <button
          onClick={handleLogoClick}
          className="text-lg font-bold"
          aria-label="PDFlex domov"
        >
          PDFlex
        </button>

        <button onClick={() => setOpen(true)} aria-label="Otvoriť menu">
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 bg-[var(--bg)] text-[var(--fg)] px-6 py-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Menu</h2>
            <button onClick={() => setOpen(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-4 mt-4">
            <a href="/#features" onClick={() => setOpen(false)}>Funkcie</a>
            <a href="/#cta" onClick={() => setOpen(false)}>Cenník</a>
            <Link href="/navod" onClick={() => setOpen(false)}>Návod</Link>
          </nav>

          <div className="border-t pt-4 mt-auto flex flex-col gap-3">
            <button onClick={toggleTheme} className="inline-flex items-center gap-2 text-sm">
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {dark ? "Svetlý režim" : "Tmavý režim"}
            </button>

            {!loading && (
              user ? (
                <>
                  <Link href="/dashboard" onClick={() => setOpen(false)} className="inline-flex items-center gap-2">
                    <User className="w-4 h-4" /> Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 text-red-600"
                  >
                    <LogOut className="w-4 h-4" /> Odhlásiť sa
                  </button>
                </>
              ) : (
                <>
                  <Link href="/m/login" onClick={() => setOpen(false)}>Prihlásenie</Link>
                  <Link href="/m/register" onClick={() => setOpen(false)}>Registrácia</Link>
                </>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
}