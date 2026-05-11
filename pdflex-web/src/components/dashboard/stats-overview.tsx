"use client";

import * as React from "react";
import { apiJSON } from "@/lib/api";
import { ShieldCheck, FileText, Gauge, HardDrive } from "lucide-react";

type Overview = {
  documentsTotal: number;
  thisMonth: number;
  translatedCount: number;
  compressedCount: number;
  protectedCount: number;
  avgProcessingMs: number;
  storageUsedBytes: number;
  storageQuotaBytes: number;
  mostUsedTool: string;
};

function bytesFmt(n: number) {
  if (!n && n !== 0) return "-";
  const u = ["B","KB","MB","GB","TB"];
  let i = 0; let v = n;
  while (v >= 1024 && i < u.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(v >= 10 ? 0 : 1)} ${u[i]}`;
}

export default function StatsOverview() {
  const [data, setData] = React.useState<Overview | null>(null);
  const [err, setErr] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await apiJSON<Overview>("/api/stats/overview");
        if (!alive) return;
        setData(res);
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message || "Nepodarilo sa načítať štatistiky.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const usedPct =
    data && data.storageQuotaBytes > 0
      ? Math.min(100, Math.round((data.storageUsedBytes / data.storageQuotaBytes) * 100))
      : 0;

  return (
    <section aria-labelledby="stats-title" className="relative">
      <h2 id="stats-title" className="sr-only">Štatistiky</h2>

      {err && (
        <div className="mb-4 rounded-lg border border-red-300/60 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
          {err}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          loading={loading}
          icon={<FileText className="h-5 w-5 text-[var(--brand-500)]" />}
          label="Dokumenty tento mesiac"
          value={data?.thisMonth}
          hint={`${data?.documentsTotal ?? 0} celkom`}
        />
        <StatCard
          loading={loading}
          icon={<Gauge className="h-5 w-5 text-emerald-400" />}
          label="Priemerný čas spracovania"
          value={data ? `${Math.round(data.avgProcessingMs)} ms` : undefined}
          hint={data?.mostUsedTool ? `Najčastejšie: ${data.mostUsedTool}` : undefined}
        />
        <StatCard
          loading={loading}
          icon={<ShieldCheck className="h-5 w-5 text-indigo-400" />}
          label="Zabezpečené dokumenty"
          value={data?.protectedCount}
          hint={`Preklady ${data?.translatedCount ?? 0} • Kompresie ${data?.compressedCount ?? 0}`}
        />
        <div className="group relative overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)]/70 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-[color:var(--fg)]/[0.05] ring-1 ring-[color:var(--card-border)]/80">
              <HardDrive className="h-5 w-5 text-amber-400" />
            </span>
            <div className="min-w-0">
              <div className="font-semibold">Úložisko</div>
              <div className="text-xs text-muted">
                {data ? `${bytesFmt(data.storageUsedBytes)} / ${bytesFmt(data.storageQuotaBytes)}` : "—"}
              </div>
            </div>
          </div>

          {/* progress */}
          <div className="mt-4 h-2 w-full rounded-full bg-[color:var(--fg)]/10">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-[var(--brand-500)] to-emerald-400 transition-[width] duration-700"
              style={{ width: `${usedPct}%` }}
            />
          </div>
          <div className="mt-1 text-right text-[11px] text-muted">{usedPct}%</div>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  loading,
  icon,
  label,
  value,
  hint,
}: {
  loading: boolean;
  icon: React.ReactNode;
  label: string;
  value?: number | string;
  hint?: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)]/70 p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-[color:var(--fg)]/[0.05] ring-1 ring-[color:var(--card-border)]/80">
          {icon}
        </span>
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wide text-muted">{label}</div>
          {loading ? (
            <div className="mt-1 h-6 w-20 rounded bg-[color:var(--fg)]/10" />
          ) : (
            <div className="truncate text-xl font-semibold">{value ?? "—"}</div>
          )}
          {hint ? <div className="text-[11px] text-muted">{hint}</div> : null}
        </div>
      </div>
    </div>
  );
}