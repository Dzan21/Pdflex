"use client";

import { toast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { API_BASE } from "@/lib/api";
import {
  CheckCircle2,
  Download,
  FileText,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

/* ---------- types ---------- */
type FileRow = {
  id: string;
  filename: string;
  size: number;
  mimeType: string;
  createdAt?: string;
};

type Stats = {
  preset: "screen" | "ebook" | "printer" | "prepress" | "default";
  originalBytes: number;
  compressedBytes: number;
  savedBytes: number;
  savedPercent: number; // 0.0 – 100.0
  improved: boolean;
};

type RunResponse = {
  file: { id: string; filename: string; size: number; mimeType: string; createdAt: string };
  downloadUrl: string;
  expiresIn: number;
  stats?: Stats;
};

/* ---------- helpers ---------- */
function formatBytes(n?: number) {
  if (n == null || isNaN(n)) return "–";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  let v = n;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  const fixed = v >= 100 ? v.toFixed(0) : v >= 10 ? v.toFixed(1) : v.toFixed(2);
  return `${fixed} ${units[i]}`;
}

function cn(...a: (string | false | undefined)[]) {
  return a.filter(Boolean).join(" ");
}

/* =======================================================================
   FANCY PRESET SELECT
======================================================================= */

type PresetKey = "screen" | "ebook" | "printer" | "prepress" | "default";

const PRESETS: Array<{
  key: PresetKey;
  title: string;
  subtitle: string;
  badge?: string;
}> = [
    {
      key: "screen",
      title: "screen",
      subtitle: "najmenší súbor • ~72dpi • pre náhľad / web",
      badge: "Najmenší",
    },
    {
      key: "ebook",
      title: "ebook",
      subtitle: "balans kvality a veľkosti • ~150dpi",
      badge: "Odporúčané",
    },
    {
      key: "printer",
      title: "printer",
      subtitle: "vyššia kvalita • ~300dpi • vhodné pre tlač",
    },
    {
      key: "prepress",
      title: "prepress",
      subtitle: "max. kvalita textu a grafiky • predtlač",
    },
    {
      key: "default",
      title: "default",
      subtitle: "štandardné nastavenie Ghostscriptu",
    },
  ];

function PresetSelect({
  value,
  onChange,
  disabled,
}: {
  value: PresetKey;
  onChange: (v: PresetKey) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  const idx = PRESETS.findIndex((p) => p.key === value);
  const current = PRESETS[idx] ?? PRESETS[0];

  // close on outside click
  React.useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (!listRef.current?.contains(t) && !btnRef.current?.contains(t)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  // keyboard nav
  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === "Escape") {
      setOpen(false);
      btnRef.current?.focus();
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const dir = e.key === "ArrowDown" ? 1 : -1;
      const next = Math.max(0, Math.min(PRESETS.length - 1, idx + dir));
      onChange(PRESETS[next].key);
    }
    if (e.key === "Enter") {
      e.preventDefault();
      setOpen(false);
      btnRef.current?.focus();
    }
  }

  return (
    <div className="relative" onKeyDown={onKeyDown}>
      <label className="block text-sm font-medium mb-1">Profil</label>

      {/* Trigger */}
      <button
        ref={btnRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full rounded-lg border px-3.5 py-2.5 text-left",
          "border-[var(--card-border)] bg-[var(--card-bg)]",
          "hover:border-[color:var(--brand-500)/60] transition-colors",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{current.title}</span>
              {current.badge && (
                <span className="rounded-full bg-[color:var(--brand-500)/0.12] text-[var(--brand-500)] px-2 py-0.5 text-[11px]">
                  {current.badge}
                </span>
              )}
            </div>
            <div className="text-xs text-muted">{current.subtitle}</div>
          </div>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            className={cn("shrink-0 transition-transform", open && "rotate-180")}
          >
            <path fill="currentColor" d="M12 14.5L6.5 9h11L12 14.5Z" opacity="0.9" />
          </svg>
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          className="absolute z-20 mt-2 w-full rounded-xl border border-[var(--card-border)]
                     bg-[var(--card-bg)]/95 backdrop-blur shadow-2xl overflow-hidden"
        >
          <div className="max-h-72 overflow-auto py-1">
            {PRESETS.map((p) => {
              const selected = p.key === value;
              return (
                <button
                  key={p.key}
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(p.key);
                    setOpen(false);
                    btnRef.current?.focus();
                  }}
                  className={cn(
                    "w-full text-left px-3.5 py-2.5",
                    "hover:bg-[color:var(--brand-500)/0.08] transition",
                    selected && "bg-[color:var(--brand-500)/0.10] border-l-2 border-[var(--brand-500)]"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{p.title}</span>
                    {p.badge && (
                      <span className="rounded-full bg-[color:var(--brand-500)/0.12] text-[var(--brand-500)] px-2 py-0.5 text-[11px]">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted">{p.subtitle}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* =======================================================================
   FANCY FILE SELECT
======================================================================= */

function FileSelect({
  files,
  value,
  onChange,
  disabled,
}: {
  files: FileRow[];
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  const current = files.find((f) => f.id === value);

  // close on outside click
  React.useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (!listRef.current?.contains(t) && !btnRef.current?.contains(t)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  // keyboard nav
  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    const idx = files.findIndex((f) => f.id === value);
    if (e.key === "Escape") {
      setOpen(false);
      btnRef.current?.focus();
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const dir = e.key === "ArrowDown" ? 1 : -1;
      const next = Math.max(0, Math.min(files.length - 1, idx + dir));
      onChange(files[next]?.id ?? value);
    }
    if (e.key === "Enter") {
      e.preventDefault();
      setOpen(false);
      btnRef.current?.focus();
    }
  }

  return (
    <div className="relative" onKeyDown={onKeyDown}>
      <label className="block text-sm font-medium mb-1">Súbor</label>

      {/* Trigger */}
      <button
        ref={btnRef}
        type="button"
        disabled={disabled || files.length === 0}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full rounded-lg border px-3.5 py-2.5 text-left",
          "border-[var(--card-border)] bg-[var(--card-bg)]",
          "hover:border-[color:var(--brand-500)/60] transition-colors",
          (disabled || files.length === 0) && "opacity-50 cursor-not-allowed"
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex items-center gap-2">
            <span className="text-muted"><FileText className="h-4 w-4" /></span>
            <div className="min-w-0">
              <div className="truncate font-medium">
                {current ? current.filename : files.length ? "Vyber súbor..." : "Žiadne súbory"}
              </div>
              <div className="text-xs text-muted">
                {current ? `${current.mimeType || "application/pdf"} • ${formatBytes(current.size)}` : ""}
              </div>
            </div>
          </div>
          <span
            className={cn(
              "inline-flex items-center rounded-full text-xs px-2 py-0.5",
              "bg-[color:var(--brand-500)/0.10] text-[var(--brand-500)]"
            )}
          >
            {current ? formatBytes(current.size) : ""}
          </span>
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          className="absolute z-20 mt-2 w-full rounded-xl border border-[var(--card-border)]
                     bg-[var(--card-bg)]/95 backdrop-blur shadow-2xl overflow-hidden"
        >
          <div className="max-h-72 overflow-auto py-1">
            {files.map((f) => {
              const selected = f.id === value;
              return (
                <button
                  key={f.id}
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(f.id);
                    setOpen(false);
                    btnRef.current?.focus();
                  }}
                  className={cn(
                    "w-full text-left px-3.5 py-2.5",
                    "hover:bg-[color:var(--brand-500)/0.08] transition",
                    selected && "bg-[color:var(--brand-500)/0.10] border-l-2 border-[var(--brand-500)]"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted" />
                    <div className="min-w-0">
                      <div className="truncate font-medium">{f.filename}</div>
                      <div className="text-xs text-muted">
                        {f.mimeType || "application/pdf"} • {formatBytes(f.size)}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* =======================================================================
   PAGE
======================================================================= */

export default function CompressPage() {
  const [files, setFiles] = React.useState<FileRow[]>([]);
  const [selectedId, setSelectedId] = React.useState<string>("");
  const [preset, setPreset] = React.useState<PresetKey>("ebook");

  const [loadingFiles, setLoadingFiles] = React.useState(true);

  // progress state
  const [progress, setProgress] = React.useState(0); // 0..100
  const [phase, setPhase] = React.useState<0 | 1 | 2>(0); // 0:prepare, 1:compress, 2:upload
  const [running, setRunning] = React.useState(false);

  // result
  const [result, setResult] = React.useState<RunResponse | null>(null);

  // load my files
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadingFiles(true);
        const token = typeof window !== "undefined" ? localStorage.getItem("pdflex_access_token") : null;
        const r = await fetch(`${API_BASE}/api/files`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const j = (await r.json()) as { files: FileRow[] };
        if (!alive) return;
        setFiles(j.files || []);
        if (j.files?.length) setSelectedId(j.files[0].id);
      } catch (e: any) {
        toast.error(e?.message || "Nepodarilo sa načítať súbory.");
      } finally {
        if (alive) setLoadingFiles(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  /* ---------- progress driver ---------- */
  React.useEffect(() => {
    if (!running) return;
    // plynule do 94 %, potom backend, na konci dobehne do 100
    let target = 94;
    let timer: number | undefined;
    let cancelled = false;

    const tick = () => {
      setProgress((p) => {
        if (p < target) return Math.min(target, p + Math.max(1, (100 - p) * 0.02));
        return p;
      });
      if (!cancelled) timer = window.setTimeout(tick, 120) as unknown as number;
    };

    timer = window.setTimeout(tick, 120) as unknown as number;
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [running]);

  function finishProgress() {
    // dobeh na 100 po výsledku
    let raf: number | undefined;
    const step = () =>
      setProgress((p) => {
        if (p >= 100) {
          if (raf) cancelAnimationFrame(raf);
          return 100;
        }
        raf = requestAnimationFrame(step);
        return Math.min(100, p + 2.5);
      });
    raf = requestAnimationFrame(step);
  }

  /* ---------- run compress ---------- */
  async function runCompress() {
    if (!selectedId) return toast.error("Vyber súbor.");
    try {
      setResult(null);
      setProgress(1);
      setPhase(0);
      setRunning(true);

      const token = typeof window !== "undefined" ? localStorage.getItem("pdflex_access_token") : null;
      const r = await fetch(`${API_BASE}/api/tools/compress`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ fileId: selectedId, preset }),
      });

      setPhase(1);

      if (!r.ok) {
        let msg = `HTTP ${r.status}`;
        try {
          const j = await r.json();
          if (j?.error) msg = j.error;
        } catch { }
        throw new Error(msg);
      }

      setPhase(2);

      const j = (await r.json()) as RunResponse;
      setResult(j);

      finishProgress();
      toast.success("Kompresia dokončená.");
    } catch (e: any) {
      setProgress(0);
      toast.error(e?.message || "Kompresia zlyhala.");
    } finally {
      setRunning(false);
    }
  }

  /* ---------- derived numbers pre UI ---------- */
  const originalBytes =
    result?.stats?.originalBytes ??
    files.find((f) => f.id === selectedId)?.size ??
    undefined;

  const compressedBytes = result?.stats?.compressedBytes ?? result?.file?.size;
  const savedBytes =
    result?.stats?.savedBytes ??
    (originalBytes != null && compressedBytes != null ? Math.max(0, originalBytes - compressedBytes) : undefined);
  const savedPercent =
    result?.stats?.savedPercent ??
    (originalBytes && compressedBytes
      ? Number((((originalBytes - compressedBytes) / originalBytes) * 100).toFixed(1))
      : undefined);

  const downloadReady = Boolean(result?.downloadUrl);

  /* ---------- UI ---------- */
  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 md:py-10 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Link href="/dashboard" className="underline text-muted hover:opacity-80">
          ← Späť na Dashboard
        </Link>

      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">Compress</h1>
          <p className="text-muted mt-1">Vyber súbor a spusti kompresiu (Ghostscript).</p>
        </div>
      </div>

      {/* výber + akcie */}
      <div className="card p-4 md:p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FileSelect
            files={files}
            value={selectedId}
            onChange={setSelectedId}
            disabled={loadingFiles || !files.length || running}
          />

          <PresetSelect
            value={preset}
            onChange={setPreset}
            disabled={running}
          />
        </div>

        <div className="mt-5">
          <Button
            onClick={runCompress}
            disabled={running || !selectedId}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-7 py-2.5 text-[15px]"
          >
            {running ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Prebieha…
              </span>
            ) : (
              "Spustiť compress"
            )}
          </Button>
        </div>
      </div>

      {/* progres + výsledok */}
      <div className="card p-4 md:p-5 space-y-4">
        <div className="flex items-center justify-between mb-1">
          <div className="text-sm font-medium">Stav spracovania</div>
          <div className="text-sm text-muted">{Math.round(progress)}%</div>
        </div>

        <div className="h-2 w-full rounded-md bg-[var(--card-border)] overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-[width] duration-200 ease-out"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
          {[
            { label: "Príprava", idx: 0 },
            { label: "Kompresia", idx: 1 },
            { label: "Ukladanie", idx: 2 },
          ].map((s) => {
            const active = running && phase === s.idx;
            const done = progress >= ((s.idx + 1) / 3) * 100 || (!running && progress === 100);
            return (
              <div
                key={s.idx}
                className={cn(
                  "flex items-center justify-between rounded-md border px-3 py-2",
                  "border-[var(--card-border)]",
                  done && "bg-[color:var(--brand-500)/0.08] border-emerald-500"
                )}
              >
                <div className="text-sm">{s.label}</div>
                {done ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : active ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted" />
                ) : (
                  <span className="text-muted">—</span>
                )}
              </div>
            );
          })}
        </div>

        {result && (
          <div className="mt-4 rounded-lg border border-[var(--card-border)] p-3">
            <div className="text-sm mb-2">
              Výstup: <b>{result.file.filename}</b>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-md border border-[var(--card-border)] p-3">
                <div className="text-xs text-muted mb-1">Pôvodná veľkosť</div>
                <div className="font-medium">{formatBytes(originalBytes)}</div>
              </div>
              <div className="rounded-md border border-[var(--card-border)] p-3">
                <div className="text-xs text-muted mb-1">Po kompresii</div>
                <div className="font-medium">{formatBytes(compressedBytes)}</div>
              </div>
              <div className="rounded-md border border-emerald-500 bg-[color:var(--brand-500)/0.06] p-3">
                <div className="text-xs text-muted mb-1">Ušetrené</div>
                <div className="font-medium text-emerald-500">
                  {formatBytes(savedBytes)} {savedPercent != null ? `• ${savedPercent}%` : ""}
                </div>
              </div>
            </div>

            <div className="mt-3">
              <a
                className="inline-flex items-center gap-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 transition-colors"
                href={result.downloadUrl}
              >
                <Download className="h-4 w-4" />
                Stiahnuť
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}