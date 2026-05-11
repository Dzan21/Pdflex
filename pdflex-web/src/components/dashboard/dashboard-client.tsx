// src/components/dashboard/dashboard-client.tsx
"use client";

import { ArrowRight, Download, History, Trash2 } from "lucide-react";
import * as React from "react";

import { DropUpload } from "@/components/dashboard/drop-upload";
import QuickActions from "@/components/dashboard/quick-actions";
import { RecentFiles, type FileRow } from "@/components/dashboard/recent-files";
import StatsRow from "@/components/dashboard/stats";
import TranslateTool from "@/components/dashboard/tools/TranslateTool"; // ⬅️ PRIDANÉ
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { uploadFile } from "@/lib/uploader";

function Card({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="card p-5 md:p-6 rounded-xl">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-default">{title}</h3>
        {desc ? <p className="text-sm text-muted">{desc}</p> : null}
      </div>
      {children}
    </div>
  );
}

export function DashboardClient() {
  // ---- state pre súbory ----
  const [files, setFiles] = React.useState<FileRow[]>([]);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);

  // načítanie zoznamu
  const loadFiles = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await api<{ files: FileRow[] }>("/api/files");
      setFiles(data.files ?? []);
    } catch (e) {
      console.error("Loading files failed:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  // toggle checkbox
  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  // nahratie cez DropUpload -> uploader -> refresh
  const handleDropUpload = async (incoming: FileList | File[]) => {
    try {
      const filesToUpload = Array.from(incoming);
      await Promise.all(filesToUpload.map((f) => uploadFile(f)));
      await loadFiles();
    } catch (e) {
      console.error("Upload failed:", e);
    }
  };

  // zmazanie vybraných
  const deleteSelected = async () => {
    if (selected.length === 0) return;
    const sure = window.confirm(
      selected.length === 1 ? "Zmazať vybraný súbor?" : `Zmazať ${selected.length} súborov?`
    );
    if (!sure) return;

    try {
      setLoading(true);
      await Promise.all(selected.map((id) => api(`/api/files/${id}`, { method: "DELETE" })));
      setSelected([]);
      await loadFiles();
    } catch (e) {
      console.error("Delete failed:", e);
      alert("Zmazanie zlyhalo.");
    } finally {
      setLoading(false);
    }
  };

  // stiahnutie prvého vybraného (alebo konkrétneho)
  const downloadFile = async (id?: string) => {
    const target = id ?? selected[0];
    if (!target) return;
    try {
      const { url } = await api<{ url: string }>(`/api/files/${target}/download-url`);
      window.open(url, "_blank");
    } catch (e) {
      console.error("Download failed:", e);
      alert("Stiahnutie zlyhalo.");
    }
  };

  return (
    <>
      {/* headline */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-default">
            Vitaj v PDFlex. Poďme na to ⚡
          </h1>
          <p className="text-muted mt-1">
            Vyber si nástroj nižšie alebo pokračuj v rozrobených úlohách.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" href="/pricing">Cenník</Button>
          <Button
            variant="primary"
            rightIcon={<ArrowRight className="h-4 w-4" />}
            href="/dashboard/upload"
          >
            Začať teraz
          </Button>
        </div>
      </div>

      {/* Drop upload (napojený na uploader) */}
      <DropUpload onFiles={handleDropUpload} />

      {/* --- TU PRIDÁVAM PREKLAD PDF ako súčasť dashboardu (SPA) --- */}
      <Card
        title="Preklad PDF"
        desc="Nahraj PDF a jedným klikom prelož do zvoleného jazyka."
      >
        <TranslateTool />
      </Card>

      {/* Quick actions */}
      <Card
        title="Rýchle akcie"
        desc="Najčastejšie nástroje na jeden klik. Pripni si obľúbené."
      >
        <QuickActions />
      </Card>

      {/* Stats */}
      <StatsRow />

      {/* two columns: files + jobs + tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Posledné nahrané" desc="Tvoje naposledy použité súbory.">
          {/* akcie nad zoznamom */}
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="text-xs text-muted">
              {loading ? "Načítavam..." : `${files.length} súborov`}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                leftIcon={<Download className="h-4 w-4" />}
                disabled={selected.length === 0}
                onClick={() => downloadFile()}
              >
                Stiahnuť
              </Button>
              <Button
                size="sm"
                variant="subtle"
                leftIcon={<Trash2 className="h-4 w-4" />}
                disabled={selected.length === 0}
                onClick={deleteSelected}
              >
                Zmazať
              </Button>
            </div>
          </div>

          <RecentFiles files={files} selectedIds={selected} onToggle={toggle} />

          <div className="mt-4 flex justify-end">
            <Button
              variant="link"
              href="/dashboard/files"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Zobraziť všetky
            </Button>
          </div>
        </Card>

        <Card title="Nedávne úlohy" desc="Posledné spracovania a ich stav.">
          <div className="mt-2 space-y-3">
            {[
              { id: "J-02931", type: "Spojenie", status: "DOKONČENÉ" },
              { id: "J-02912", type: "Zmenšenie", status: "DOKONČENÉ" },
              { id: "J-02897", type: "Preklad", status: "PREBIEHA" },
            ].map((j, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 rounded-lg border border-[var(--card-border)] px-3 py-2"
              >
                <div className="text-sm">
                  <div className="text-default font-medium">
                    {j.type} <span className="text-muted font-normal">• {j.id}</span>
                  </div>
                  <div className="text-xs text-muted">{j.status}</div>
                </div>
                <Button size="sm" variant="ghost" href={`/dashboard/jobs/${j.id}`}>
                  Detail
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              variant="link"
              href="/dashboard/jobs"
              rightIcon={<History className="h-4 w-4" />}
            >
              História úloh
            </Button>
          </div>
        </Card>

        <Card title="Krátke tipy" desc="Ako urobiť veci rýchlo a pohodlne.">
          <ul className="space-y-2 text-sm text-muted">
            <li>• Nahrávaj naraz viac súborov.</li>
            <li>• Najpoužívanejšie nástroje si pripni hore.</li>
            <li>• Hotové súbory nájdeš v histórii.</li>
          </ul>
          <div className="mt-4">
            <Button variant="ghost" href="/navod">
              Zobraziť návod
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}