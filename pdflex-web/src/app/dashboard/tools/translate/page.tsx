"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { API_BASE } from "@/lib/api";
import {
  FileText,
  Languages,
  CheckCircle2,
  Loader2,
  Download,
  Globe2,
} from "lucide-react";

/* ----------------------------- types ----------------------------- */
type FileRow = {
  id: string;
  filename: string;
  size: number;
  mimeType: string;
  createdAt?: string;
};

type TranslateResponse = {
  file: { id: string; filename: string; size: number; mimeType: string; createdAt: string };
  downloadUrl: string;
  expiresIn: number;
  meta?: {
    targetLang: string;
    detectedSourceLang?: string;
    pageCount?: number;
  };
};

function cn(...a: (string | false | undefined | null)[]) {
  return a.filter(Boolean).join(" ");
}

function formatBytes(n?: number) {
  if (n == null || isNaN(n)) return "–";
  const u = ["B", "KB", "MB", "GB", "TB"];
  let i = 0, v = n;
  while (v >= 1024 && i < u.length - 1) { v /= 1024; i++; }
  const fixed = v >= 100 ? v.toFixed(0) : v >= 10 ? v.toFixed(1) : v.toFixed(2);
  return `${fixed} ${u[i]}`;
}

/* =======================================================================
   LANG SELECT (cíti sa prémiovo ✨)
======================================================================= */

type Lang = { code: string; label: string; hint?: string; flag?: string; popular?: boolean };

const TARGET_LANGS: Lang[] = [
  { code: "EN", label: "English", hint: "Angličtina", flag: "🇬🇧", popular: true },
  { code: "SK", label: "Slovenčina", hint: "Slovak", flag: "🇸🇰", popular: true },
  { code: "CS", label: "Čeština", hint: "Czech", flag: "🇨🇿", popular: true },
  { code: "DE", label: "Deutsch", hint: "German", flag: "🇩🇪", popular: true },
  { code: "PL", label: "Polski", hint: "Polish", flag: "🇵🇱" },
  { code: "HU", label: "Magyar", hint: "Hungarian", flag: "🇭🇺" },
  { code: "FR", label: "Français", hint: "French", flag: "🇫🇷" },
  { code: "ES", label: "Español", hint: "Spanish", flag: "🇪🇸" },
  { code: "IT", label: "Italiano", hint: "Italian", flag: "🇮🇹" },
  { code: "PT-PT", label: "Português (EU)", hint: "Portuguese EU", flag: "🇵🇹" },
  { code: "PT-BR", label: "Português (BR)", hint: "Portuguese BR", flag: "🇧🇷" },
  { code: "NL", label: "Nederlands", hint: "Dutch", flag: "🇳🇱" },
  { code: "SV", label: "Svenska", hint: "Swedish", flag: "🇸🇪" },
  { code: "DA", label: "Dansk", hint: "Danish", flag: "🇩🇰" },
  { code: "NO", label: "Norsk", hint: "Norwegian", flag: "🇳🇴" },
  { code: "FI", label: "Suomi", hint: "Finnish", flag: "🇫🇮" },
  { code: "ET", label: "Eesti", hint: "Estonian", flag: "🇪🇪" },
  { code: "LT", label: "Lietuvių", hint: "Lithuanian", flag: "🇱🇹" },
  { code: "LV", label: "Latviešu", hint: "Latvian", flag: "🇱🇻" },
  { code: "RO", label: "Română", hint: "Romanian", flag: "🇷🇴" },
  { code: "BG", label: "Български", hint: "Bulgarian", flag: "🇧🇬" },
  { code: "EL", label: "Ελληνικά", hint: "Greek", flag: "🇬🇷" },
  { code: "TR", label: "Türkçe", hint: "Turkish", flag: "🇹🇷" },
  { code: "RU", label: "Русский", hint: "Russian", flag: "🇷🇺" },
  { code: "UK", label: "Українська", hint: "Ukrainian", flag: "🇺🇦" },
  { code: "JA", label: "日本語", hint: "Japanese", flag: "🇯🇵" },
  { code: "ZH", label: "中文", hint: "Chinese", flag: "🇨🇳" },
  { code: "KO", label: "한국어", hint: "Korean", flag: "🇰🇷" },
];

function LangSelect({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const current = TARGET_LANGS.find((l) => l.code === value) || TARGET_LANGS[0];

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

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === "Escape") {
      setOpen(false);
      btnRef.current?.focus();
    }
    if (e.key === "Enter") {
      e.preventDefault();
      setOpen(false);
      btnRef.current?.focus();
    }
  }

  return (
    <div className="relative" onKeyDown={onKeyDown}>
      <label className="block text-sm font-medium mb-1">Cieľový jazyk</label>

      <button
        ref={btnRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full rounded-lg border px-3.5 py-2.5 text-left",
          "border-[var(--card-border)] bg-[var(--card-bg)]",
          "hover:border-[color:var(--brand-500)/0.6] transition-colors",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4 text-muted" />
            <div>
              <div className="font-medium">
                {current.flag ? `${current.flag} ` : ""}
                {current.label}
              </div>
              <div className="text-xs text-muted">{current.hint || current.code}</div>
            </div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" className={cn("shrink-0 transition-transform", open && "rotate-180")}>
            <path fill="currentColor" d="M12 14.5L6.5 9h11L12 14.5Z" opacity="0.9" />
          </svg>
        </div>
      </button>

      {open && (
        <div
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          className="absolute z-20 mt-2 w-full rounded-xl border border-[var(--card-border)]
                     bg-[var(--card-bg)]/95 backdrop-blur shadow-2xl overflow-hidden"
        >
          {/* POPULAR */}
          <div className="px-3 pt-3 pb-1 text-[11px] font-medium text-muted">Najčastejšie</div>
          <div className="max-h-80 overflow-auto py-1">
            {[...TARGET_LANGS.filter(l => l.popular), { code: "__DIV__", label: "", hint: "" } as any, ...TARGET_LANGS.filter(l => !l.popular)].map((l, i) => {
              if ((l as any).code === "__DIV__") {
                return <div key={`div-${i}`} className="my-1 border-t border-[var(--card-border)]" />;
              }
              const selected = l.code === value;
              return (
                <button
                  key={l.code}
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(l.code);
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
                    <span className="text-base">{l.flag ?? "🌐"}</span>
                    <div className="min-w-0">
                      <div className="truncate font-medium">{l.label}</div>
                      <div className="text-xs text-muted">{l.hint || l.code}</div>
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
   FILE SELECT (recyklované z Compress, vizuálne zladené)
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

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === "Escape") {
      setOpen(false);
      btnRef.current?.focus();
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
      <button
        ref={btnRef}
        type="button"
        disabled={disabled || files.length === 0}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full rounded-lg border px-3.5 py-2.5 text-left",
          "border-[var(--card-border)] bg-[var(--card-bg)]",
          "hover:border-[color:var(--brand-500)/0.6] transition-colors",
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

export default function TranslatePage() {
  const [files, setFiles] = React.useState<FileRow[]>([]);
  const [selectedId, setSelectedId] = React.useState<string>("");
  const [targetLang, setTargetLang] = React.useState<string>("EN");

  // progress
  const [progress, setProgress] = React.useState(0);
  const [phase, setPhase] = React.useState<0 | 1 | 2 | 3>(0); // 0:detekcia, 1:preklad, 2:render, 3:ukladanie
  const [running, setRunning] = React.useState(false);

  // result
  const [result, setResult] = React.useState<TranslateResponse | null>(null);

  // load files
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
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
      }
    })();
    return () => { alive = false; };
  }, []);

  // smooth progress to ~94%, then finish to 100%
  React.useEffect(() => {
    if (!running) return;
    let target = 94;
    let timer: number | undefined;
    let cancelled = false;
    const tick = () => {
      setProgress((p) => (p < target ? Math.min(target, p + Math.max(1, (100 - p) * 0.02)) : p));
      if (!cancelled) timer = window.setTimeout(tick, 120) as unknown as number;
    };
    timer = window.setTimeout(tick, 120) as unknown as number;
    return () => { cancelled = true; if (timer) clearTimeout(timer); };
  }, [running]);

  function finishProgress() {
    let raf: number | undefined;
    const step = () =>
      setProgress((p) => {
        if (p >= 100) { if (raf) cancelAnimationFrame(raf); return 100; }
        raf = requestAnimationFrame(step);
        return Math.min(100, p + 2.5);
      });
    raf = requestAnimationFrame(step);
  }

  async function runTranslate() {
    if (!selectedId) return toast.error("Vyber súbor.");
    try {
      setResult(null);
      setProgress(1);
      setPhase(0);
      setRunning(true);

      const token = typeof window !== "undefined" ? localStorage.getItem("pdflex_access_token") : null;

      const r = await fetch(`${API_BASE}/api/tools/translate`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          fileId: selectedId,
          targetLang,
          keepLayout: true,
        }),
      });

      setPhase(1);

      if (!r.ok) {
        let msg = `HTTP ${r.status}`;
        try {
          const j = await r.json();
          if (j?.error) msg = j.error;
        } catch {}
        throw new Error(msg);
      }

      setPhase(2);

      const j = (await r.json()) as TranslateResponse;
      setResult(j);

      setPhase(3);
      finishProgress();
      toast.success("Preklad hotový.");
    } catch (e: any) {
      setProgress(0);
      toast.error(e?.message || "Preklad zlyhal.");
    } finally {
      setRunning(false);
    }
  }

  const detected = result?.meta?.detectedSourceLang;
  const pages = result?.meta?.pageCount;

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 md:py-10 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Link href="/dashboard" className="underline text-muted hover:opacity-80">
          ← Späť na Dashboard
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">Preklad PDF</h1>
          <p className="text-muted mt-1">Rozpoznanie jazyka, preklad a verné zachovanie rozloženia.</p>
        </div>
      </div>

      {/* výber + akcia */}
      <div className="card p-4 md:p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FileSelect
            files={files}
            value={selectedId}
            onChange={setSelectedId}
            disabled={running || !files.length}
          />

          <LangSelect
            value={targetLang}
            onChange={setTargetLang}
            disabled={running}
          />
        </div>

        <div className="mt-5">
          <Button
            onClick={runTranslate}
            disabled={running || !selectedId}
            className="bg-[var(--brand-500)] hover:brightness-95 text-white px-7 py-2.5 text-[15px]"
          >
            {running ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Prekladám…
              </span>
            ) : (
              "Spustiť preklad"
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
            className="h-full bg-[var(--brand-500)] transition-[width] duration-200 ease-out"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-2">
          {[
            { label: "Detekujem jazyk", idx: 0 },
            { label: "Prekladám text", idx: 1 },
            { label: "Renderujem PDF", idx: 2 },
            { label: "Ukladám výsledok", idx: 3 },
          ].map((s) => {
            const active = running && phase === s.idx;
            const done = progress >= ((s.idx + 1) / 4) * 100 || (!running && progress === 100);
            return (
              <div
                key={s.idx}
                className={cn(
                  "flex items-center justify-between rounded-md border px-3 py-2",
                  "border-[var(--card-border)]",
                  done && "bg-[color:var(--brand-500)/0.08] border-[var(--brand-500)]"
                )}
              >
                <div className="text-sm">{s.label}</div>
                {done ? (
                  <CheckCircle2 className="h-4 w-4 text-[var(--brand-500)]" />
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="text-sm">
                Výstup: <b>{result.file.filename}</b>
                <div className="text-xs text-muted mt-0.5">
                  {result.meta?.targetLang ? (
                    <span className="inline-flex items-center gap-1">
                      <Globe2 className="h-3.5 w-3.5" />
                      {detected ? `Zistený jazyk: ${detected} → ` : ""}
                      Cieľ: {result.meta.targetLang}
                      {pages ? ` • Strán: ${pages}` : ""}
                    </span>
                  ) : null}
                </div>
              </div>

              <a
                className="inline-flex items-center gap-2 rounded-md bg-[var(--brand-500)] hover:brightness-95 text-white px-4 py-2 transition-colors"
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