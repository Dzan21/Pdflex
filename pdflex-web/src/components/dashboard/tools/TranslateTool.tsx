"use client";

import dynamic from "next/dynamic";
import * as React from "react";

import {
  getFileDownloadUrl,
  getTranslateJobStatus,
  startTranslateJob,
  uploadPdfAndGetId,
  type StartTranslateResponse,
} from "@/lib/api";

import {
  CheckCircle2,
  FileText,
  Languages,
  Loader2,
  UploadCloud,
} from "lucide-react";

/* ========================= */
/* ==== DYNAMIC IMPORT ===== */
/* ========================= */

const PDFViewer = dynamic(
  () =>
    import("./PdfViewerClient").then((mod) => mod.default),
  { ssr: false }
) as React.ComponentType<{ fileUrl: string }>;

/* ===================================================== */
/* ================= TRANSLATE TOOL ==================== */
/* ===================================================== */

export default function TranslateTool() {
  const [fileId, setFileId] = React.useState<string | null>(null);
  const [filename, setFilename] = React.useState<string | null>(null);
  const [targetLang, setTargetLang] = React.useState("EN");

  const [uploading, setUploading] = React.useState(false);
  const [translating, setTranslating] = React.useState(false);
  const [progressText, setProgressText] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [showPreview, setShowPreview] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  /* ===================== UPLOAD ===================== */

  async function handleFile(f: File | null) {
    if (!f) return;

    setError(null);
    setUploading(true);

    try {
      const rec = await uploadPdfAndGetId(f);
      setFileId(rec.id);
      setFilename(rec.filename);
    } catch (e: any) {
      setError(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  /* ===================== TRANSLATE ===================== */

  async function onTranslate() {
    if (!fileId) return;

    setError(null);
    setTranslating(true);
    setProgressText("Preparing document...");

    try {
      const resp: StartTranslateResponse =
        await startTranslateJob({ fileId, targetLang });

      pollStatus(resp.jobId);
    } catch (e: any) {
      setError(e.message || "Translation failed");
      setTranslating(false);
    }
  }

  function pollStatus(id: string) {
    const interval = setInterval(async () => {
      try {
        const job = await getTranslateJobStatus(id);

        if (job.status === "PROCESSING") {
          setProgressText("Translating with AI...");
        }

        if (job.status === "DONE") {
          clearInterval(interval);

          if (job.resultFileId) {
            const file = await getFileDownloadUrl(job.resultFileId);
            setPreviewUrl(file.downloadUrl);
            setShowPreview(true);
          }

          setTranslating(false);
        }

        if (job.status === "ERROR") {
          clearInterval(interval);
          setTranslating(false);
          setError(job.errorMessage || "Translation failed");
        }
      } catch {
        clearInterval(interval);
        setTranslating(false);
      }
    }, 2000);
  }

  /* ===================== UI ===================== */

  return (
    <>
      <div className="max-w-5xl mx-auto px-6 py-20 space-y-16">

        {/* HEADER */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">
            AI PDF Translator
          </h1>
          <p className="text-white/60 max-w-xl mx-auto">
            Preserve layout, structure and formatting with AI precision.
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-5 py-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* MAIN CARD */}
        <div className="bg-gradient-to-b from-white/5 to-white/[0.03] border border-white/10 rounded-3xl p-10 space-y-8 shadow-2xl">

          {/* UPLOAD */}
          {!filename && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/15 hover:border-purple-500/50 transition rounded-2xl p-16 text-center cursor-pointer bg-black/40"
            >
              {uploading ? (
                <Loader2 className="mx-auto h-10 w-10 animate-spin text-purple-400" />
              ) : (
                <>
                  <UploadCloud className="mx-auto h-10 w-10 text-purple-400 mb-4" />
                  <p className="text-white font-medium text-lg">
                    Drag & drop PDF here
                  </p>
                  <p className="text-white/40 text-sm mt-2">
                    or click to browse
                  </p>
                </>
              )}
            </div>
          )}

          {/* FILE CARD */}
          {filename && (
            <div className="flex items-center justify-between bg-black/50 border border-white/10 rounded-xl px-6 py-5">
              <div className="flex items-center gap-4">
                <FileText className="text-purple-400 h-5 w-5" />
                <span className="text-white text-sm truncate max-w-xs">
                  {filename}
                </span>
              </div>
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <CheckCircle2 className="h-4 w-4" />
                Ready
              </div>
            </div>
          )}

          {/* LANGUAGE + CTA */}
          {filename && (
            <div className="flex flex-col md:flex-row gap-4 items-center">

              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full md:w-60 bg-black/60 border border-white/10 rounded-xl px-4 h-12 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="EN">English</option>
                <option value="DE">German</option>
                <option value="FR">French</option>
                <option value="ES">Spanish</option>
                <option value="CS">Czech</option>
                <option value="PL">Polish</option>
              </select>

              <button
                onClick={onTranslate}
                disabled={translating}
                className="w-full md:w-auto px-8 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:scale-[1.03] active:scale-[0.97] transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
              >
                {translating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {progressText || "Translating..."}
                  </>
                ) : (
                  <>
                    <Languages className="h-4 w-4" />
                    Translate
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          hidden
          accept="application/pdf"
          onChange={(e) => handleFile(e.target.files?.[0] || null)}
        />
      </div>

      {showPreview && previewUrl && filename && (
        <TranslationPreviewModal
          url={previewUrl}
          filename={filename}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
}

/* ===================================================== */
/* ================= PREVIEW MODAL ===================== */
/* ===================================================== */
function TranslationPreviewModal({
  url,
  filename,
  onClose,
}: {
  url: string;
  filename: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">

      {/* HEADER */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-white/10 bg-black">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Translation Preview
          </h2>
          <p className="text-sm text-white/40 truncate max-w-lg">
            {filename}
          </p>
        </div>

        <button
          onClick={onClose}
          className="text-white/60 hover:text-white transition"
        >
          ✕
        </button>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto px-6 py-10">
        <div className="max-w-4xl mx-auto relative">

          {/* ===== PDF CONTAINER ===== */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-neutral-900">

            {/* PDF VIEWER */}
            <PDFViewer fileUrl={url} />

            {/* LOCK OVERLAY (IBA SPODOK) */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[55%] pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.95) 100%)",
              }}
            />
          </div>

          {/* PAYWALL */}
          <div className="text-center mt-16 space-y-6">
            <h3 className="text-3xl font-semibold text-white">
              Unlock Full Translation
            </h3>

            <p className="text-white/60 max-w-md mx-auto">
              Your document has been successfully translated.
              Unlock full access to download the complete file.
            </p>

            <button
              onClick={() => alert("Stripe integration next 💳")}
              className="px-10 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium shadow-xl hover:scale-[1.03] active:scale-[0.98] transition"
            >
              Unlock & Download
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}