"use client";

import * as React from "react";
import { Document, Page, pdfjs } from "react-pdf";

/* ===================================================== */
/* ================= PDF WORKER FIX ==================== */
/* ===================================================== */

/**
 * Pre pdfjs-dist 4.x musí byť .mjs worker
 * Toto je STABILNÉ riešenie pre Next 15 + Webpack
 */
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

/* ===================================================== */

type Props = {
  fileUrl: string;
};

export default function PdfViewerClient({ fileUrl }: Props) {
  const [numPages, setNumPages] = React.useState<number>(0);
  const [error, setError] = React.useState<string | null>(null);

  const memoizedFile = React.useMemo(() => {
    return fileUrl ? { url: fileUrl } : null;
  }, [fileUrl]);

  const onLoadSuccess = React.useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
      setError(null);
    },
    []
  );

  const onLoadError = React.useCallback((err: unknown) => {
    console.error("PDF load error:", err);
    setError("Failed to load PDF file.");
  }, []);

  if (!memoizedFile) {
    return (
      <div className="bg-black rounded-2xl p-6 border border-white/10 shadow-2xl text-white">
        No PDF URL provided
      </div>
    );
  }

  return (
    <div className="bg-black rounded-2xl p-6 border border-white/10 shadow-2xl text-white">
      {error && (
        <div className="mb-4 text-red-400 font-medium">
          {error}
        </div>
      )}

      <Document
        file={memoizedFile}
        onLoadSuccess={onLoadSuccess}
        onLoadError={onLoadError}
        loading={<p className="text-white/60">Loading PDF...</p>}
      >
        {Array.from({ length: numPages }, (_, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            width={900}
            className="mb-6"
          />
        ))}
      </Document>
    </div>
  );
}