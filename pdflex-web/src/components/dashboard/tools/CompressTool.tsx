"use client";

import * as React from "react";
import {
  uploadPdfAndGetId,
  downloadUrlAsFile,
  api
} from "@/lib/api";
import { Upload, FileArchive } from "lucide-react";

export default function CompressWorkspace() {
  const [fileId, setFileId] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleFile(f: File | null) {
    if (!f) return;

    try {
      setError(null);
      setLoading(true);

      const rec = await uploadPdfAndGetId(f);
      setFileId(rec.id);
    } catch (e: any) {
      setError(e.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  async function onCompress() {
    if (!fileId) return;

    try {
      setError(null);
      setLoading(true);

      const resp = await api<{
        file: { filename: string };
        downloadUrl: string;
      }>("/api/tools/compress", {
        method: "POST",
        body: JSON.stringify({ fileId }),
      });

      await downloadUrlAsFile(resp.downloadUrl, resp.file.filename);
    } catch (e: any) {
      setError(e.message || "Compression failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <button
          onClick={() => document.getElementById("file2")?.click()}
          disabled={loading}
          className="btn-neo px-4"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload PDF
        </button>

        <button
          onClick={onCompress}
          disabled={!fileId || loading}
          className="btn-neo px-4"
        >
          <FileArchive className="mr-2 h-4 w-4" />
          {loading ? "Processing..." : "Compress"}
        </button>
      </div>

      {error && (
        <div className="text-red-400 text-sm">
          {error}
        </div>
      )}

      <input
        id="file2"
        type="file"
        hidden
        accept="application/pdf"
        onChange={(e) => handleFile(e.target.files?.[0] || null)}
      />
    </div>
  );
}