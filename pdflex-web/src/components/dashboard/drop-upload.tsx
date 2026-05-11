// src/components/dashboard/drop-upload.tsx
"use client";

import * as React from "react";
import clsx from "clsx";
import { Upload } from "lucide-react";

export type DropUploadProps = {
  value?: File | null;
  onFiles?: (files: FileList | File[]) => void;
  accept?: Record<string, string[]>;
  maxSizeMB?: number;
  helperText?: string;
  className?: string;
};

export type DropUploadHandle = {
  /** Otvorí file picker programovo */
  open: () => void;
};

export const DropUpload = React.forwardRef<DropUploadHandle, DropUploadProps>(
  (
    {
      value,
      onFiles,
      accept = { "application/pdf": [".pdf"] },
      maxSizeMB = 100,
      helperText = "Drag & drop file here or click anywhere to select a PDF.",
      className,
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [isDragOver, setDragOver] = React.useState(false);
    const acceptAttr = React.useMemo(
      () => Object.values(accept).flat().join(","),
      [accept]
    );

    const open = () => {
      // extra ochrana: krátke oneskorenie, ak by niečo blokovalo focus
      setTimeout(() => inputRef.current?.click(), 0);
    };

    React.useImperativeHandle(ref, () => ({ open }), []);

    const handleFiles = (files: FileList | null) => {
      if (!files || !files.length) return;
      const f = files[0];

      const isPdf =
        f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf");
      if (!isPdf) {
        alert("Prosím vyber PDF súbor.");
        return;
      }

      const sizeMB = f.size / (1024 * 1024);
      if (sizeMB > maxSizeMB) {
        alert(
          `Súbor je príliš veľký (${sizeMB.toFixed(
            1
          )} MB). Limit je ${maxSizeMB} MB.`
        );
        return;
      }

      onFiles?.(files);
    };

    return (
      <div
        className={clsx(
          "relative w-full rounded-xl border border-dashed p-6 text-center transition-colors",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-neutral-300 hover:border-primary/60 hover:bg-primary/5",
          "pointer-events-auto",
          "select-none",
          className
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        role="region"
        aria-label="PDF upload area"
      >
        {/* NEVIDITEĽNÝ INPUT PREKRYJE CELÚ ZÓNU – garantuje, že klik otvorí dialog */}
        <input
          ref={inputRef}
          type="file"
          accept={acceptAttr}
          className="absolute inset-0 z-50 opacity-0 cursor-pointer"
          onChange={(e) => handleFiles(e.target.files)}
          tabIndex={0}
          title="" // skryje systémový tooltip
        />

        {/* Obsah dropzóny */}
        <div className="relative z-0 flex flex-col items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
            <Upload className="h-5 w-5" />
          </div>

          <p className="text-sm text-muted-foreground">
            {value ? (
              <>
                <span className="font-medium">{value.name}</span>{" "}
                <span className="text-xs">
                  ({(value.size / (1024 * 1024)).toFixed(1)} MB)
                </span>
              </>
            ) : (
              helperText
            )}
          </p>

          <p className="text-xs text-muted-foreground">
            Accepted: {acceptAttr || ".pdf"} • Max {maxSizeMB} MB
          </p>
        </div>
      </div>
    );
  }
);

DropUpload.displayName = "DropUpload";