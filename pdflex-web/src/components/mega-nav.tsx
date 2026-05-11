"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Moon, Sun, User, LogOut } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button onClick={toggle} className="p-2 rounded-full hover:bg-[var(--card-bg)] transition">
      {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}

export default function MegaNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const [isMobile, setIsMobile] = useState(false);
  const [ready, setReady] = useState(false);

  const isDashboard = pathname?.startsWith("/dashboard");

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      setReady(true);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
    <header className="sticky top-0 z-50 flex items-center justify-between bg-[var(--bg)] px-4 h-14 border-b border-[var(--card-border)]">
      <button
        onClick={handleLogoClick}
        className="text-lg font-bold"
        aria-label="Prejsť na úvodnú stránku"
      >
        PDFlex
      </button>

      <div className="flex items-center gap-4">
        <ThemeToggle />

        {user ? (
          <>
            <Link href="/dashboard" className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4" />
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="text-red-600 text-sm flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Odhlásiť sa
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm">
              Prihlásenie
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium bg-[var(--brand-500)] text-white px-3 py-1.5 rounded-full"
            >
              Registrovať
            </Link>
          </>
        )}
      </div>
    </header>
  );
}