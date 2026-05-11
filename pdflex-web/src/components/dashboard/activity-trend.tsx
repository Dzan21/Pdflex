"use client";
import * as React from "react";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/$/,"");

type Weekly = { labels: string[]; values: number[] };

function Sparkline({ labels, values }: Weekly) {
  const w = 560, h = 120, pad = 12;
  if (!values.length || values.every(v => v === 0)) {
    return (
      <div className="grid h-[140px] place-items-center rounded-xl border border-dashed border-[var(--card-border)]/70 text-xs text-muted">
        No data
      </div>
    );
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(1, max - min);
  const stepX = (w - pad * 2) / Math.max(1, values.length - 1);
  const points = values.map((v,i)=>{
    const x = pad + i*stepX;
    const y = pad + (h - pad*2) * (1 - (v - min)/span);
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="block h-[140px] w-full rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)]/80 p-2">
      <polyline points={points} fill="none" stroke="var(--brand-500)" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export default function ActivityTrend() {
  const [week, setWeek] = React.useState<Weekly>({ labels: [], values: [] });

  React.useEffect(() => {
    let alive = true;
    fetch(`${API_BASE}/api/stats/weekly`, { credentials: "include", cache: "no-store" })
      .then(r => r.ok ? r.json() : { labels:[], values:[] })
      .then(raw => alive ? setWeek({
        labels: Array.isArray(raw?.labels) ? raw.labels.map(String) : [],
        values: Array.isArray(raw?.values) ? raw.values.map((v:any)=> Number.isFinite(+v) ? +v : 0) : [],
      }) : void 0)
      .catch(()=> alive && setWeek({ labels:[], values:[] }));
    return () => { alive = false; };
  }, []);

  return (
    <section className="mt-6">
      <h3 className="mb-2 text-sm font-semibold text-[color:var(--fg)]">Týždenná aktivita</h3>
      <Sparkline {...week}/>
    </section>
  );
}