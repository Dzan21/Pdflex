"use client";

import * as React from "react";
import {
  Languages,
  FileArchive,
  FileText,
  Timer,
  HardDrive,
  Lock,
  Download,
  Trash2,
  ArrowRight,
  Heart,
  Leaf,
  Droplets,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { useToolDrawer } from "@/components/dashboard/tool-drawer-context";
import { api } from "@/lib/api";
import { uploadFile } from "@/lib/uploader";
import { DropUpload } from "@/components/dashboard/drop-upload";
import { type FileRow } from "@/components/dashboard/recent-files";

/* ═══════════════════════════════════════════
   Helpers
═══════════════════════════════════════════ */
function greeting(name?: string | null) {
  const h = new Date().getHours();
  const prefix =
    h < 5  ? "Dobrú noc"   :
    h < 12 ? "Dobré ráno"  :
    h < 18 ? "Dobrý deň"   : "Dobrý večer";
  return name ? `${prefix}, ${name.split(" ")[0]} 👋` : `${prefix} 👋`;
}

function bytesFmt(n: number) {
  if (!n || n <= 0) return "0 B";
  const u = ["B", "KB", "MB", "GB"];
  const i = Math.min(u.length - 1, Math.floor(Math.log(n) / Math.log(1024)));
  const v = n / Math.pow(1024, i);
  return `${v.toFixed(v < 10 ? 1 : 0)} ${u[i]}`;
}

function msFmt(ms: number) {
  if (!ms || ms <= 0) return "—";
  if (ms < 1000) return `${Math.round(ms)} ms`;
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(s < 10 ? 1 : 0)} s`;
  return `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`;
}

/* ═══════════════════════════════════════════
   Stat tile
═══════════════════════════════════════════ */
function StatTile({
  icon,
  label,
  value,
  sub,
  delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  sub?: string;
  delay?: number;
}) {
  return (
    <div className="dash-stat-tile dash-rise" style={{ animationDelay: `${delay}s` }}>
      <div className="flex items-start gap-3">
        <div
          className="grid h-10 w-10 place-items-center rounded-lg shrink-0"
          style={{ background: "rgba(248,248,255,0.06)", border: "1px solid var(--dash-border)" }}
        >
          {icon}
        </div>
        <div>
          <div className="text-xs" style={{ color: "var(--dash-muted)" }}>{label}</div>
          <div
            className="text-xl font-bold leading-7 dash-count-up"
            style={{ color: "var(--dash-fg)" }}
          >
            {value}
          </div>
          {sub && <div className="text-xs" style={{ color: "var(--dash-muted)" }}>{sub}</div>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Mini area chart (teal gradient)
═══════════════════════════════════════════ */
function ActivityChart({
  labels,
  values,
}: {
  labels: string[];
  values: number[];
}) {
  const vals = values.filter((v) => typeof v === "number" && isFinite(v));
  const labs = labels ?? [];

  if (!vals.length) {
    return (
      <div
        className="grid h-36 place-items-center text-xs rounded-lg"
        style={{ color: "var(--dash-muted)", background: "rgba(248,248,255,0.02)" }}
      >
        Zatiaľ žiadna aktivita
      </div>
    );
  }

  const W = 540, H = 140, P = 12;
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const span = max - min || 1;
  const sx = (i: number) => P + (i * (W - P * 2)) / Math.max(vals.length - 1, 1);
  const sy = (v: number) => H - P - ((v - min) / span) * (H - P * 2);
  const pts = vals.map((v, i) => `${sx(i)},${sy(v)}`).join(" ");
  const area = `M ${sx(0)},${H - P} L ${pts} L ${sx(vals.length - 1)},${H - P} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full">
      <defs>
        <linearGradient id="dashGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"   stopColor="#00C9A7" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#00C9A7" stopOpacity="0"   />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#dashGrad)" />
      <polyline
        fill="none"
        stroke="#00C9A7"
        strokeWidth="2"
        points={pts}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {labs.slice(-7).map((t, i, arr) => {
        const xi = sx(vals.length - arr.length + i);
        return (
          <text key={i} x={xi} y={H - 2} fontSize="9" textAnchor="middle" fill="#8B8B9E">
            {t}
          </text>
        );
      })}
    </svg>
  );
}

/* ═══════════════════════════════════════════
   Charity icons map
═══════════════════════════════════════════ */
const CHARITY_DATA: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  "ocean-cleanup": { label: "Ocean Cleanup",  icon: Droplets, color: "#38bdf8" },
  "tree-nation":   { label: "Tree-Nation",    icon: Leaf,     color: "#4ade80" },
  "water-org":     { label: "Water.org",      icon: Droplets, color: "#60a5fa" },
  "food-banks":    { label: "Food Banks",     icon: Utensils, color: "#fb923c" },
};

/* ═══════════════════════════════════════════
   Live tool cards
═══════════════════════════════════════════ */
const LIVE_TOOLS = [
  {
    key:   "translate",
    title: "Translate PDF",
    hint:  "Prelož dokument bez straty formátovania",
    icon:  Languages,
    color: "var(--dash-accent)",
  },
  {
    key:   "compress",
    title: "Compress PDF",
    hint:  "Zmenši veľkosť súboru jedným klikom",
    icon:  FileArchive,
    color: "var(--dash-accent2)",
  },
] as const;

/* ═══════════════════════════════════════════
   Types
═══════════════════════════════════════════ */
type OverviewResp = {
  monthCount: number;
  avgMs: number;
  secured: number;
  storageUsedBytes: number;
  translateCount?: number;
  compressCount?: number;
};

type WeeklyResp = { labels: string[]; values: number[] };

/* ═══════════════════════════════════════════
   Main page
═══════════════════════════════════════════ */
export default function DashboardPage() {
  const { user } = useAuth();
  const { openTool } = useToolDrawer();

  /* stats */
  const [overview, setOverview] = React.useState<OverviewResp>({
    monthCount: 0, avgMs: 0, secured: 0, storageUsedBytes: 0,
    translateCount: 0, compressCount: 0,
  });
  const [weekly, setWeekly] = React.useState<WeeklyResp>({ labels: [], values: [] });

  /* files */
  const [files,    setFiles]    = React.useState<FileRow[]>([]);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [filesLoading, setFilesLoading] = React.useState(false);

  const loadFiles = React.useCallback(async () => {
    try {
      setFilesLoading(true);
      const data = await api<{ files: FileRow[] }>("/api/files");
      setFiles(data.files ?? []);
    } catch { /* silent */ } finally {
      setFilesLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [o, w] = await Promise.all([
          api<OverviewResp>("/api/stats/overview"),
          api<WeeklyResp>("/api/stats/weekly?days=7"),
        ]);
        if (!alive) return;
        setOverview(o ?? {} as OverviewResp);
        setWeekly(Array.isArray(w?.values) ? w : { labels: [], values: [] });
      } catch { /* silent */ }
    })();
    loadFiles();
    return () => { alive = false; };
  }, [loadFiles]);

  const toggle = (id: string) =>
    setSelected((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const deleteSelected = async () => {
    if (!selected.length) return;
    if (!window.confirm(`Zmazať ${selected.length} súbor${selected.length > 1 ? "y" : ""}?`)) return;
    try {
      await Promise.all(selected.map((id) => api(`/api/files/${id}`, { method: "DELETE" })));
      setSelected([]);
      await loadFiles();
    } catch { alert("Zmazanie zlyhalo."); }
  };

  const downloadFile = async (id?: string) => {
    const target = id ?? selected[0];
    if (!target) return;
    try {
      const { url } = await api<{ url: string }>(`/api/files/${target}/download-url`);
      window.open(url, "_blank");
    } catch { alert("Stiahnutie zlyhalo."); }
  };

  const handleDrop = async (incoming: FileList | File[]) => {
    try {
      await Promise.all(Array.from(incoming).map((f) => uploadFile(f)));
      await loadFiles();
    } catch { /* silent */ }
  };

  /* charity */
  const charityKey   = ((user as Record<string, unknown>)?.charityChoice as string | undefined) ?? "ocean-cleanup";
  const charityInfo  = CHARITY_DATA[charityKey] ?? CHARITY_DATA["ocean-cleanup"];
  const CharityIcon  = charityInfo.icon;
  const contributed  = ((user as Record<string, unknown>)?.totalContributed as number | undefined) ?? 0;
  const contribMonths = ((user as Record<string, unknown>)?.contributionMonths as number | undefined) ?? 0;

  /* ── render ── */
  return (
    <div className="mx-auto max-w-6xl space-y-6 dash-fade-in">

      {/* ── Greeting ── */}
      <div>
        <h1
          className="text-2xl md:text-3xl font-bold"
          style={{ color: "var(--dash-fg)" }}
        >
          {greeting(user?.name)}
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--dash-muted)" }}>
          {new Date().toLocaleDateString("sk-SK", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </div>

      {/* ── Drop upload ── */}
      <DropUpload onFiles={handleDrop} />

      {/* ── Live tools ── */}
      <div className="grid gap-4 sm:grid-cols-2 dash-stagger">
        {LIVE_TOOLS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => openTool(t.key)}
              className="dash-tool-card dash-rise"
            >
              <div className="flex items-center gap-3">
                <div
                  className="grid h-10 w-10 place-items-center rounded-lg shrink-0"
                  style={{ background: `${t.color}1A` }}
                >
                  <Icon className="h-5 w-5" style={{ color: t.color }} />
                </div>
                <div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: "var(--dash-fg)" }}
                  >
                    {t.title}
                  </div>
                  <div
                    className="text-xs mt-0.5"
                    style={{ color: "var(--dash-muted)" }}
                  >
                    {t.hint}
                  </div>
                </div>
                <ArrowRight
                  className="ml-auto h-4 w-4 shrink-0 opacity-40"
                  style={{ color: t.color }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Stats row ── */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 dash-stagger">
        <StatTile
          icon={<FileText className="h-5 w-5" style={{ color: "var(--dash-accent2)" }} />}
          label="Dokumenty tento mesiac"
          value={overview.monthCount ?? 0}
          delay={0.04}
        />
        <StatTile
          icon={<Timer className="h-5 w-5" style={{ color: "#fbbf24" }} />}
          label="Priemerný čas"
          value={msFmt(overview.avgMs)}
          delay={0.08}
        />
        <StatTile
          icon={<Lock className="h-5 w-5" style={{ color: "#f87171" }} />}
          label="Zabezpečené"
          value={overview.secured ?? 0}
          sub={`Preklady ${overview.translateCount ?? 0} · Kompresie ${overview.compressCount ?? 0}`}
          delay={0.12}
        />
        <StatTile
          icon={<HardDrive className="h-5 w-5" style={{ color: "var(--dash-accent)" }} />}
          label="Úložisko"
          value={bytesFmt(overview.storageUsedBytes)}
          delay={0.16}
        />
      </div>

      {/* ── Chart + Charity side by side ── */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Chart (2/3) */}
        <div
          className="dash-card p-4 lg:col-span-2 dash-rise"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="mb-3">
            <div
              className="text-sm font-semibold"
              style={{ color: "var(--dash-fg)" }}
            >
              Týždenná aktivita
            </div>
            <div
              className="text-xs"
              style={{ color: "var(--dash-muted)" }}
            >
              Počet spracovaní za posledných 7 dní
            </div>
          </div>
          <ActivityChart labels={weekly.labels} values={weekly.values} />
        </div>

        {/* Charity card (1/3) */}
        <div
          className="dash-charity-card flex flex-col justify-between dash-rise"
          style={{ animationDelay: "0.24s" }}
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Heart className="h-4 w-4" style={{ color: "var(--dash-accent)" }} />
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--dash-fg)" }}
              >
                Charity
              </span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <CharityIcon className="h-4 w-4 shrink-0" style={{ color: charityInfo.color }} />
              <span className="text-sm font-medium" style={{ color: "var(--dash-fg)" }}>
                {charityInfo.label}
              </span>
            </div>
            <p className="text-xs" style={{ color: "var(--dash-muted)" }}>
              Za každý mesiac prémiového predplatného posielame €0,45 zvolenej organizácii.
            </p>
          </div>

          <div className="mt-4 space-y-1">
            <div className="flex justify-between text-xs" style={{ color: "var(--dash-muted)" }}>
              <span>Celkovo prispené</span>
              <span
                className="font-semibold"
                style={{ color: "var(--dash-accent)" }}
              >
                €{contributed.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-xs" style={{ color: "var(--dash-muted)" }}>
              <span>Počet mesiacov</span>
              <span style={{ color: "var(--dash-fg)" }}>{contribMonths}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent files ── */}
      <div
        className="dash-card dash-rise overflow-hidden"
        style={{ animationDelay: "0.28s" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: "1px solid var(--dash-border)" }}
        >
          <div>
            <div
              className="text-sm font-semibold"
              style={{ color: "var(--dash-fg)" }}
            >
              Posledné súbory
            </div>
            <div
              className="text-xs"
              style={{ color: "var(--dash-muted)" }}
            >
              {filesLoading ? "Načítavam…" : `${files.length} súborov`}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => downloadFile()}
              disabled={!selected.length}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all disabled:opacity-30"
              style={{ color: "var(--dash-muted)", border: "1px solid var(--dash-border)" }}
              onMouseEnter={(e) => {
                if (selected.length) {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = "var(--dash-fg)";
                  el.style.borderColor = "rgba(248,248,255,0.2)";
                }
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = "var(--dash-muted)";
                el.style.borderColor = "var(--dash-border)";
              }}
            >
              <Download className="h-3.5 w-3.5" />
              Stiahnuť
            </button>
            <button
              onClick={deleteSelected}
              disabled={!selected.length}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all disabled:opacity-30"
              style={{ color: "var(--dash-muted)", border: "1px solid var(--dash-border)" }}
              onMouseEnter={(e) => {
                if (selected.length) {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = "#f87171";
                  el.style.borderColor = "rgba(248,113,113,0.3)";
                }
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = "var(--dash-muted)";
                el.style.borderColor = "var(--dash-border)";
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Zmazať
            </button>
          </div>
        </div>

        {/* File list */}
        {files.length === 0 ? (
          <div
            className="px-5 py-8 text-sm text-center"
            style={{ color: "var(--dash-muted)" }}
          >
            Zatiaľ žiadne súbory. Nahraj svoj prvý PDF!
          </div>
        ) : (
          <ul>
            {files.slice(0, 8).map((f) => {
              const sel = selected.includes(f.id);
              return (
                <li
                  key={f.id}
                  onClick={() => toggle(f.id)}
                  className="flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors"
                  style={{
                    borderBottom: "1px solid var(--dash-border)",
                    background: sel ? "rgba(0,201,167,0.05)" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!sel) (e.currentTarget as HTMLElement).style.background = "rgba(248,248,255,0.02)";
                  }}
                  onMouseLeave={(e) => {
                    if (!sel) (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  <div
                    className="grid h-5 w-5 shrink-0 place-items-center rounded"
                    style={{
                      border: `1px solid ${sel ? "var(--dash-accent)" : "var(--dash-border)"}`,
                      background: sel ? "rgba(0,201,167,0.15)" : "transparent",
                    }}
                  >
                    {sel && (
                      <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="var(--dash-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>

                  <FileText
                    className="h-4 w-4 shrink-0"
                    style={{ color: "var(--dash-accent2)" }}
                  />

                  <div className="flex-1 min-w-0">
                    <div
                      className="truncate text-sm font-medium"
                      style={{ color: "var(--dash-fg)" }}
                    >
                      {f.filename}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "var(--dash-muted)" }}
                    >
                      {bytesFmt(f.size)}
                    </div>
                  </div>

                  {f.createdAt && (
                    <div
                      className="text-xs shrink-0"
                      style={{ color: "var(--dash-muted)" }}
                    >
                      {new Date(f.createdAt).toLocaleDateString("sk-SK")}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {/* Footer */}
        <div
          className="px-5 py-3 flex justify-end"
          style={{ borderTop: "1px solid var(--dash-border)" }}
        >
          <Link
            href="/dashboard/files"
            className="flex items-center gap-1.5 text-xs font-medium transition-colors"
            style={{ color: "var(--dash-accent)" }}
          >
            Zobraziť všetky
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
