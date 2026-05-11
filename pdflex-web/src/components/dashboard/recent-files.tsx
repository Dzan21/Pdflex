"use client";

import * as React from "react";
import { FileText, CheckSquare, Square } from "lucide-react";

export type FileRow = {
  id: string;
  filename: string;
  size: number;
  mimeType: string;
  createdAt?: string;
};

type Props = {
  files: FileRow[];
  selectedIds: string[];
  onToggle(id: string): void;
};

export function RecentFiles({ files, selectedIds, onToggle }: Props) {
  return (
    <div className="card overflow-hidden p-0">
      <div className="border-b border-[var(--card-border)] px-4 py-3">
        <h3 className="text-sm font-semibold">Moje súbory</h3>
      </div>

      {files.length === 0 ? (
        <div className="p-6 text-sm text-muted">Zatiaľ nič nebolo nahraté.</div>
      ) : (
        <ul className="divide-y divide-[var(--card-border)]">
          {files.map((f) => {
            const sel = selectedIds.includes(f.id);
            return (
              <li
                key={f.id}
                className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                  sel ? "bg-[color:var(--brand-500)/0.06]" : "hover:bg-[var(--card-bg)]"
                }`}
              >
                <button
                  onClick={() => onToggle(f.id)}
                  className={`rounded-md border p-1 transition ${
                    sel
                      ? "border-[var(--brand-500)] bg-[color:var(--brand-500)/0.08] text-[var(--brand-500)]"
                      : "border-[var(--card-border)] text-[var(--brand-500)] hover:border-[var(--brand-500)]"
                  }`}
                  aria-label={sel ? "Odznačiť" : "Označiť"}
                >
                  {sel ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 -z-10 rounded-md bg-[var(--card-bg)] blur-sm opacity-0 transition-opacity" />
                  <FileText className="h-5 w-5 text-muted" />
                </div>

                <div className="flex-1 truncate">
                  <div className="truncate text-sm font-medium">{f.filename}</div>
                  <div className="text-xs text-muted">
                    {f.mimeType || "application/octet-stream"} • {formatBytes(f.size)}
                  </div>
                </div>

                {f.createdAt && (
                  <div className="text-xs text-muted">
                    {new Date(f.createdAt).toLocaleString()}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  return `${(n / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}