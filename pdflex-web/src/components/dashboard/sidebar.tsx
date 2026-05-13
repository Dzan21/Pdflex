"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutGrid,
  FolderOpen,
  Clock,
  ChevronDown,
  Languages,
  FileArchive,
  FileText,
  MessageSquare,
  ScanText,
  FilePlus,
  FileOutput,
  FileImage,
  GitMerge,
  Scissors,
  Stamp,
  RotateCcw,
  Highlighter,
  Lock,
  Shield,
  KeyRound,
  EyeOff,
  LogOut,
  Heart,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useToolDrawer } from "@/components/dashboard/tool-drawer-context";

/* ── Main navigation ─────────────────────────────────── */
const NAV_MAIN = [
  { label: "Dashboard",   href: "/dashboard",       icon: LayoutGrid },
  { label: "Moje súbory", href: "/dashboard/files", icon: FolderOpen },
  { label: "História",    href: "/dashboard/jobs",  icon: Clock },
] as const;

/* ── Tool sections ───────────────────────────────────── */
type ToolItem = {
  label: string;
  icon: React.ElementType;
  live: boolean;
  key?: string;
};

type Section = { label: string; tools: ToolItem[] };

const SECTIONS: Section[] = [
  {
    label: "AI Nástroje",
    tools: [
      { label: "Translate PDF", icon: Languages,     live: true,  key: "translate" },
      { label: "Compress PDF",  icon: FileArchive,   live: true,  key: "compress"  },
      { label: "Summarize",     icon: FileText,      live: false },
      { label: "Chat with PDF", icon: MessageSquare, live: false },
      { label: "OCR",           icon: ScanText,      live: false },
    ],
  },
  {
    label: "Konvertovanie",
    tools: [
      { label: "PDF → Word",  icon: FileOutput, live: false },
      { label: "PDF → Image", icon: FileImage,  live: false },
      { label: "Word → PDF",  icon: FilePlus,   live: false },
      { label: "Merge PDF",   icon: GitMerge,   live: false },
    ],
  },
  {
    label: "Úpravy",
    tools: [
      { label: "Split PDF",  icon: Scissors,    live: false },
      { label: "Watermark",  icon: Stamp,       live: false },
      { label: "Rotate",     icon: RotateCcw,   live: false },
      { label: "Annotate",   icon: Highlighter, live: false },
    ],
  },
  {
    label: "Bezpečnosť",
    tools: [
      { label: "Password Protect", icon: Lock,     live: false },
      { label: "Sign PDF",         icon: Shield,   live: false },
      { label: "Redact",           icon: EyeOff,   live: false },
      { label: "Encrypt",          icon: KeyRound, live: false },
    ],
  },
];

const CHARITY_LABELS: Record<string, string> = {
  "ocean-cleanup": "Ocean Cleanup",
  "tree-nation":   "Tree-Nation",
  "water-org":     "Water.org",
  "food-banks":    "Food Banks",
};

/* ── Badge helpers ───────────────────────────────────── */
function LiveBadge() {
  return (
    <span
      className="ml-auto rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide shrink-0"
      style={{
        background: "rgba(0,201,167,0.18)",
        color: "var(--dash-accent)",
      }}
    >
      LIVE
    </span>
  );
}

function SoonBadge() {
  return (
    <span
      className="ml-auto rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide shrink-0"
      style={{
        background: "rgba(139,139,158,0.12)",
        color: "var(--dash-muted)",
      }}
    >
      SOON
    </span>
  );
}

/* ── Main component ──────────────────────────────────── */
export default function DashboardSidebar() {
  const pathname  = usePathname();
  const { user, logout } = useAuth();
  const { openTool }     = useToolDrawer();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggle = (label: string) =>
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));

  const initials = user?.name
    ? user.name.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2)
    : (user?.email?.[0]?.toUpperCase() ?? "G");

  // charity fields will be undefined until BOD 4 migration lands
  const charityChoice  = (user as Record<string, unknown>)?.charityChoice as string | undefined;
  const totalContrib   = (user as Record<string, unknown>)?.totalContributed as number | undefined;
  const charityLabel   = CHARITY_LABELS[charityChoice ?? "ocean-cleanup"] ?? "Ocean Cleanup";
  const contributed    = totalContrib ?? 0;

  return (
    <aside
      className="hidden md:flex fixed top-0 left-0 h-full w-[240px] flex-col z-40"
      style={{
        background:  "var(--dash-sidebar)",
        borderRight: "1px solid var(--dash-border)",
      }}
    >
      {/* ── Logo ── */}
      <div
        className="flex h-16 shrink-0 items-center px-5"
        style={{ borderBottom: "1px solid var(--dash-border)" }}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg grid place-items-center text-sm font-black shrink-0"
            style={{
              background: "linear-gradient(135deg, var(--dash-accent), var(--dash-accent2))",
              color: "#000",
            }}
          >
            P
          </div>
          <span
            className="text-lg font-black tracking-tight"
            style={{ color: "var(--dash-fg)" }}
          >
            PDF<span style={{ color: "var(--dash-accent)" }}>lex</span>
          </span>
        </Link>
      </div>

      {/* ── Scrollable nav ── */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {/* Main nav items */}
        {NAV_MAIN.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`dash-nav-item${isActive ? " is-active" : ""}`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}

        {/* Divider */}
        <div className="my-3" style={{ borderTop: "1px solid var(--dash-border)" }} />

        {/* "Nástroje" label */}
        <div
          className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-widest"
          style={{ color: "var(--dash-muted)" }}
        >
          Nástroje
        </div>

        {/* Expandable sections */}
        {SECTIONS.map((section) => {
          const isOpen = !!expanded[section.label];

          return (
            <div key={section.label}>
              {/* Section header */}
              <button
                onClick={() => toggle(section.label)}
                className="dash-section-btn"
              >
                {section.label}
                <ChevronDown
                  className="ml-auto h-3.5 w-3.5 shrink-0 transition-transform duration-200"
                  style={{ transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)" }}
                />
              </button>

              {/* Section tools */}
              {isOpen && (
                <div
                  className="ml-3 mt-0.5 mb-1 pl-2.5 space-y-0.5"
                  style={{ borderLeft: "1px solid var(--dash-border)" }}
                >
                  {section.tools.map((tool) => {
                    const Icon = tool.icon;

                    if (tool.live && tool.key) {
                      return (
                        <button
                          key={tool.label}
                          onClick={() => openTool(tool.key!)}
                          className="dash-tool-live"
                        >
                          <Icon className="h-3.5 w-3.5 shrink-0" />
                          {tool.label}
                          <LiveBadge />
                        </button>
                      );
                    }

                    return (
                      <div key={tool.label} className="dash-tool-soon">
                        <Icon className="h-3.5 w-3.5 shrink-0 opacity-40" />
                        {tool.label}
                        <SoonBadge />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Bottom pinned section ── */}
      <div className="shrink-0" style={{ borderTop: "1px solid var(--dash-border)" }}>
        {/* Charity mini-widget */}
        <div className="px-4 pt-3 pb-2">
          <div
            className="rounded-xl p-3 flex items-center gap-3"
            style={{
              background: "rgba(0,201,167,0.07)",
              border:     "1px solid rgba(0,201,167,0.18)",
            }}
          >
            <div
              className="w-8 h-8 rounded-full grid place-items-center shrink-0"
              style={{ background: "rgba(0,201,167,0.18)" }}
            >
              <Heart className="h-3.5 w-3.5" style={{ color: "var(--dash-accent)" }} />
            </div>
            <div className="min-w-0">
              <div
                className="text-xs font-semibold truncate leading-tight"
                style={{ color: "var(--dash-fg)" }}
              >
                {charityLabel}
              </div>
              <div
                className="text-[10px] truncate leading-tight"
                style={{ color: "var(--dash-muted)" }}
              >
                €{contributed.toFixed(2)} celkom
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid var(--dash-border)" }} />

        {/* User footer */}
        <div className="px-3 py-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <div
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold"
              style={{
                background: "linear-gradient(135deg, var(--dash-accent), var(--dash-accent2))",
                color: "#000",
              }}
            >
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <div
                className="truncate text-xs font-semibold leading-tight"
                style={{ color: "var(--dash-fg)" }}
              >
                {user?.name || user?.email || "Guest"}
              </div>
              {user?.name && user?.email && (
                <div
                  className="truncate text-[10px] leading-tight"
                  style={{ color: "var(--dash-muted)" }}
                >
                  {user.email}
                </div>
              )}
            </div>

            {user && (
              <button
                onClick={() => logout()}
                aria-label="Odhlásiť sa"
                className="shrink-0 rounded-lg p-1.5 transition-colors"
                style={{ color: "var(--dash-muted)" }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = "#f87171";
                  el.style.background = "rgba(248,113,113,0.1)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = "var(--dash-muted)";
                  el.style.background = "transparent";
                }}
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
