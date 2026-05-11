"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Languages,
  FileArchive,
  GitMerge,
  FileText,
  Lock,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";

const NAV = [
  { label: "Dashboard",    href: "/dashboard",                   icon: LayoutDashboard, live: true  },
  { label: "Translate PDF", href: "/dashboard/tools/translate",  icon: Languages,       live: true  },
  { label: "Compress PDF",  href: "/dashboard/tools/compress",   icon: FileArchive,     live: true  },
  { label: "Merge PDF",     href: "#",                           icon: GitMerge,        live: false },
  { label: "PDF → Word",    href: "#",                           icon: FileText,        live: false },
  { label: "Password Protect", href: "#",                        icon: Lock,            live: false },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2)
    : (user?.email?.[0]?.toUpperCase() ?? "G");

  return (
    <aside className="hidden md:flex fixed top-0 left-0 h-full w-[240px] flex-col border-r border-slate-200 bg-white z-40">
      {/* Logo */}
      <div className="flex h-14 shrink-0 items-center border-b border-slate-200 px-5">
        <Link
          href="/"
          className="text-xl font-black tracking-tight text-slate-900 hover:opacity-75 transition-opacity"
        >
          PDF<span className="text-[var(--brand-500)]">lex</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV.map((item) => {
          const Icon = item.icon;
          const isActive = item.live && (
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href)
          );

          if (!item.live) {
            return (
              <div
                key={item.label}
                className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300"
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
                <span className="ml-auto rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                  soon
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={[
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150",
                isActive
                  ? "bg-[var(--brand-500)]/10 text-[var(--brand-500)]"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
              ].join(" ")}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="shrink-0 border-t border-slate-200 p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--brand-500)] text-xs font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-slate-900 leading-tight">
              {user?.name || user?.email || "Guest"}
            </div>
            {user?.name && user?.email && (
              <div className="truncate text-xs text-slate-400 leading-tight">{user.email}</div>
            )}
            {!user && (
              <Link href="/login" className="text-xs text-[var(--brand-500)] hover:underline">
                Sign in
              </Link>
            )}
          </div>
          {user && (
            <button
              onClick={() => logout()}
              aria-label="Sign out"
              className="shrink-0 rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
