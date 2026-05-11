"use client";

import { useAuth } from "@/components/auth-provider";
import { LogOut, Menu, Moon, Sun, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardTopBar() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);

    // 🔁 Mobil detekcia cez screen width
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // run hneď po mountnutí
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const handleLogout = async () => {
    await logout();
    router.push(isMobile ? "/m" : "/");
  };

  const handleLogoClick = () => {
    router.push(isMobile ? "/m" : "/");
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between bg-[var(--bg)] px-4 shadow-md">
        <button
          onClick={handleLogoClick}
          className="text-lg font-bold flex items-center gap-1"
          aria-label="PDFlex domov"
        >
          <span className="rounded bg-[var(--fg)] px-1 py-0.5 text-xs text-[var(--bg)] font-black">
            PDF
          </span>
          <span className="text-sm font-semibold tracking-tight">lex</span>
        </button>

        <button onClick={() => setOpen(true)} aria-label="Otvoriť menu">
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 bg-[var(--bg)] text-[var(--fg)] px-6 py-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Dashboard menu</h2>
            <button onClick={() => setOpen(false)} aria-label="Zavrieť menu">
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-4 mt-4 text-base font-medium">
            <Link href="/dashboard" onClick={() => setOpen(false)}>Prehľad</Link>
            <Link href="/dashboard/account" onClick={() => setOpen(false)}>Účet</Link>
            <Link href="/dashboard/billing" onClick={() => setOpen(false)}>Fakturácia</Link>
          </nav>

          <div className="border-t pt-4 mt-auto flex flex-col gap-3">
            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 text-sm"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {dark ? "Svetlý režim" : "Tmavý režim"}
            </button>

            {user && (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 text-red-600 text-sm"
              >
                <LogOut className="w-4 h-4" />
                Odhlásiť sa
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}