"use client";

import * as React from "react";
import Link from "next/link";
import { RecentFiles, type FileRow } from "@/components/dashboard/recent-files";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/toaster";
import { api } from "@/lib/api";
import { getDownloadUrl } from "@/lib/files";
import { workbench } from "@/lib/workbench";

type FetchState = "idle" | "loading" | "error";

export function FilesPanel() {
  const [files, setFiles] = React.useState<FileRow[]>([]);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [state, setState] = React.useState<FetchState>("idle");
  const [busy, setBusy] = React.useState<"download" | "delete" | null>(null);

  const load = React.useCallback(async () => {
    try {
      setState("loading");
      const j = await api<{ files: FileRow[] }>("/api/files");
      setFiles(j.files || []);
      setSelected(workbench.get().filter((id) => (j.files || []).some((f) => f.id === id)));
      setState("idle");
    } catch (e: any) {
      setState("error");
      toast.error(e?.message || "Nepodarilo sa načítať súbory.");
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      workbench.set(next);
      return next;
    });
  };

  const handleDownload = async () => {
    if (selected.length !== 1) {
      toast.error("Vyber presne 1 súbor na stiahnutie.");
      return;
    }
    const id = selected[0];
    try {
      setBusy("download");
      const token =
        typeof window !== "undefined" ? localStorage.getItem("pdflex_access_token") : null;
      const url = await getDownloadUrl(id, token || undefined);
      window.location.href = url;
    } catch (e: any) {
      toast.error(e?.message || "Stiahnutie zlyhalo.");
    } finally {
      setBusy(null);
    }
  };

  const handleDelete = async () => {
    if (selected.length === 0) {
      toast.error("Vyber aspoň 1 súbor na zmazanie.");
      return;
    }
    try {
      setBusy("delete");
      for (const id of selected) {
        await api(`/api/files/${id}`, { method: "DELETE" });
      }
      toast.success("Súbory boli zmazané.");
      workbench.clear();
      setSelected([]);
      await load();
    } catch (e: any) {
      toast.error(e?.message || "Zmazanie zlyhalo.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="card p-4 md:p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold">Posledné nahrané</h3>
          <p className="text-sm text-muted">Tvoje naposledy použité súbory.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            disabled={busy === "download" || selected.length !== 1}
          >
            {busy === "download" ? "Sťahujem…" : "Stiahnuť"}
          </Button>

          <Button
            variant="subtle"
            size="sm"
            onClick={handleDelete}
            disabled={busy === "delete" || selected.length === 0}
          >
            {busy === "delete" ? "Mažem…" : "Zmazať"}
          </Button>
        </div>
      </div>

      {selected.length > 0 && (
        <div className="flex items-center justify-between gap-3 px-1 pb-2">
          <div className="text-sm text-muted">{selected.length} vybratý/é súbor/y</div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/tools/compress" className="btn btn-primary btn-sm">
              Compress
            </Link>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                workbench.clear();
                setSelected([]);
                toast.success("Výber bol zrušený.");
              }}
            >
              Zrušiť výber
            </button>
          </div>
        </div>
      )}

      {state === "error" ? (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm">
          Nepodarilo sa načítať súbory.{" "}
          <button className="underline" onClick={load}>
            Skúsiť znova
          </button>
        </div>
      ) : (
        <RecentFiles files={files} selectedIds={selected} onToggle={toggle} />
      )}

      <div className="mt-3 flex justify-end">
        <Button variant="link" href="/dashboard/files">
          Zobraziť všetky
        </Button>
      </div>
    </div>
  );
}