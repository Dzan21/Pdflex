// src/components/dashboard/stats.tsx
"use client";

import * as React from "react";
import { api } from "@/lib/api";
import { FileText, Lock, Timer, HardDrive } from "lucide-react";

/* ----------------------------- typy odpovedí ----------------------------- */
type OverviewResp = {
  monthCount: number;          // počet spracovaní tento mesiac
  avgMs: number;               // priemerný čas v ms
  secured: number;             // počet zabezpečených dokumentov
  storageUsedBytes: number;    // využitie úložiska
  translateCount?: number;
  compressCount?: number;
  mostUsedTool?: string;
};

type WeeklyResp = { labels: string[]; values: number[] };

/* ------------------------------ util formáty ----------------------------- */
const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));
const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

function bytesFmt(n: number) {
  if (!isNum(n) || n <= 0) return "0";
  const u = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(u.length - 1, Math.floor(Math.log(n) / Math.log(1024)));
  const v = n / Math.pow(1024, i);
  return `${v.toFixed(v < 10 ? 1 : 0)} ${u[i]}`;
}

function msFmt(ms: number) {
  if (!isNum(ms) || ms <= 0) return "0 ms";
  if (ms < 1000) return `${Math.round(ms)} ms`;
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(s < 10 ? 1 : 0)} s`;
  const m = Math.floor(s / 60);
  const r = Math.round(s % 60);
  return `${m}m ${r}s`;
}

/* --------------------------------- UI dlaždica -------------------------------- */
function StatTile({
  icon,
  title,
  value,
  sub,
}: {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)]/80 p-4">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-[color:var(--fg)]/6 ring-1 ring-[color:var(--card-border)]/80">
          {icon}
        </span>
        <div className="min-w-0">
          <div className="text-xs text-muted">{title}</div>
          <div className="text-default text-lg font-semibold leading-6">{value}</div>
          {sub ? <div className="text-xs text-muted">{sub}</div> : null}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- malý sparkline ---------------------------- */
function Sparkline({ labels, values }: WeeklyResp) {
  // fallback: prázdno
  const vals = Array.isArray(values) ? values.filter(isNum) : [];
  const labs = Array.isArray(labels) ? labels : [];

  if (!vals.length) {
    return (
      <div className="grid h-40 place-items-center text-xs text-muted">
        No data
      </div>
    );
  }

  const w = 540, h = 160, pad = 10;
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const span = max - min || 1;
  const sx = (i: number) => pad + (i * (w - pad * 2)) / Math.max(vals.length - 1, 1);
  const sy = (v: number) => h - pad - ((v - min) / span) * (h - pad * 2);
  const points = vals.map((v, i) => `${sx(i)},${sy(v)}`).join(" ");
  const area = `M ${sx(0)},${h - pad} L ${points} L ${sx(vals.length - 1)},${h - pad} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="block">
      <defs>
        <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--brand-500)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--brand-500)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#g)" />
      <polyline
        fill="none"
        stroke="var(--brand-500)"
        strokeWidth="2"
        points={points}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* x-labels (max ~7) */}
      {labs.slice(-7).map((t, i, arr) => {
        const xi = sx(vals.length - arr.length + i);
        return (
          <text
            key={i}
            x={xi}
            y={h - 2}
            fontSize="10"
            textAnchor="middle"
            fill="var(--muted)"
          >
            {t}
          </text>
        );
      })}
    </svg>
  );
}

/* ----------------------------- hlavný komponent ----------------------------- */
export default function StatsPanel() {
  const [overview, setOverview] = React.useState<OverviewResp>({
    monthCount: 0,
    avgMs: 0,
    secured: 0,
    storageUsedBytes: 0,
    translateCount: 0,
    compressCount: 0,
    mostUsedTool: "—",
  });

  const [weekly, setWeekly] = React.useState<WeeklyResp>({ labels: [], values: [] });
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      setErr(null);

      const o = await api<OverviewResp>("/api/stats/overview");
      const w = await api<WeeklyResp>("/api/stats/weekly?days=7");

      if (!alive) return;
      setOverview(o || ({} as OverviewResp));
      setWeekly(Array.isArray(w.values) ? w : { labels: [], values: [] });
      setLoading(false);
    })().catch((e) => {
      if (!alive) return;
      setErr(e?.message || "Nepodarilo sa načítať štatistiky.");
      setLoading(false);
    });

    return () => {
      alive = false;
    };
  }, []);

  // odvodené hodnoty
  const storagePct = React.useMemo(() => {
    // ak máš v budúcnosti quota, daj ju sem; zatiaľ percento nie je zmysluplné => 0
    const pct = 0;
    return clamp(pct, 0, 100) * 100;
  }, [overview.storageUsedBytes]);

  return (
    <section className="mt-6 space-y-4">
      {/* horný rad 4 kociek */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          icon={<FileText className="h-5 w-5 text-indigo-400" />}
          title="Dokumenty tento mesiac"
          value={overview.monthCount || 0}
        />
        <StatTile
          icon={<Timer className="h-5 w-5 text-amber-400" />}
          title="Priemerný čas spracovania"
          value={msFmt(overview.avgMs)}
        />
        <StatTile
          icon={<Lock className="h-5 w-5 text-rose-400" />}
          title="Zabezpečené dokumenty"
          value={overview.secured || 0}
          sub={
            (overview.translateCount || overview.compressCount)
              ? (
                <>
                  Preklady • Kompresie {`${overview.translateCount ?? 0} • ${overview.compressCount ?? 0}`}
                </>
                )
              : undefined
          }
        />
        <StatTile
          icon={<HardDrive className="h-5 w-5 text-emerald-400" />}
          title="Úložisko"
          value={bytesFmt(overview.storageUsedBytes)}
          sub={`${Math.round(storagePct)}%`}
        />
      </div>

      {/* týždenná aktivita */}
      <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)]/80">
        <div className="border-b border-[var(--card-border)]/80 px-4 py-3">
          <div className="text-sm font-medium text-default">Týždenná aktivita</div>
          <div className="text-xs text-muted">Počet spracovaní za posledných 7 dní</div>
        </div>
        <div className="px-2 py-4 sm:px-4">
          {err ? (
            <div className="rounded-md border border-red-300/70 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
              {err}
            </div>
          ) : loading ? (
            <div className="grid h-40 place-items-center text-sm text-muted">Načítavam…</div>
          ) : (
            <Sparkline labels={weekly.labels} values={weekly.values} />
          )}
        </div>
      </div>
    </section>
  );
}