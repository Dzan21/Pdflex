"use client";

import * as React from "react";
import { api } from "@/lib/api";
import { Loader2, Download, Clock, CheckCircle2, XCircle } from "lucide-react";

type Job = {
  id: string;
  type: string;
  status: "PENDING" | "PROCESSING" | "DONE" | "ERROR";
  errorMessage?: string | null;
  resultFile?: { id: string; filename: string };
  createdAt?: string;
};

type Props = {
  refreshKey?: string;
};

export function JobList({ refreshKey }: Props) {
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        const data = await api<{ jobs: Job[] }>("/api/jobs");
        if (!alive) return;
        setJobs(data.jobs || []);
      } catch {
        // ignore
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    const t = setInterval(load, 2500);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [refreshKey]);

  return (
    <div className="card overflow-hidden p-0">
      <div className="flex items-center gap-2 border-b border-[var(--card-border)] px-4 py-3">
        <h3 className="text-sm font-semibold">Posledné spracovania</h3>
        {loading && <Loader2 className="h-4 w-4 animate-spin text-muted" />}
      </div>

      {jobs.length === 0 ? (
        <div className="p-6 text-sm text-muted">Zatiaľ žiadne spracovania.</div>
      ) : (
        <ul className="divide-y divide-[var(--card-border)]">
          {jobs.map((j) => (
            <li key={j.id} className="flex items-center gap-3 px-4 py-3">
              <StatusBadge status={j.status} />
              <div className="flex-1">
                <div className="text-sm font-medium">{labelFor(j.type)}</div>
                <div className="text-xs text-muted">
                  {j.status === "ERROR"
                    ? j.errorMessage || "Chyba"
                    : j.createdAt
                    ? new Date(j.createdAt).toLocaleString()
                    : ""}
                </div>
              </div>

              {j.status === "DONE" && j.resultFile && (
                <a
                  className="btn btn-ghost text-sm"
                  href={`${API_FILE_DOWNLOAD_URL(j.resultFile.id)}`}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Stiahnuť: {j.resultFile.filename}
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Job["status"] }) {
  if (status === "PENDING" || status === "PROCESSING")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-1 text-xs font-medium text-amber-600 ring-1 ring-amber-500/30">
        <Clock className="h-3.5 w-3.5" />
        {status === "PENDING" ? "Vo fronte" : "Prebieha"}
      </span>
    );
  if (status === "DONE")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-medium text-emerald-600 ring-1 ring-emerald-500/30">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Hotovo
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-1 text-xs font-medium text-red-600 ring-1 ring-red-500/30">
      <XCircle className="h-3.5 w-3.5" />
      Chyba
    </span>
  );
}

function labelFor(t: string) {
  switch (t) {
    case "MERGE":
      return "Merge PDF/Word";
    case "SPLIT":
      return "Split PDF";
    case "COMPRESS":
      return "Compress";
    case "PROTECT":
      return "Zaheslovanie";
    case "UNPROTECT":
      return "Odstránenie hesla";
    case "WATERMARK":
      return "Watermark";
    case "TRANSLATE":
      return "Preklad";
    case "REDACT":
      return "Redakcia";
    default:
      return t;
  }
}

function API_FILE_DOWNLOAD_URL(id: string) {
  const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/$/, "");
  return `${base}/api/files/${id}/download`;
}