"use client";

import * as React from "react";
import { X, Languages, FileArchive } from "lucide-react";
import { useToolDrawer } from "@/components/dashboard/tool-drawer-context";
import TranslateTool from "@/components/dashboard/tools/TranslateTool";
import CompressTool from "@/components/dashboard/tools/CompressTool";

const TOOL_META: Record<string, { title: string; icon: React.ElementType; color: string }> = {
  translate: { title: "Translate PDF",  icon: Languages,    color: "var(--dash-accent)"  },
  compress:  { title: "Compress PDF",   icon: FileArchive,  color: "var(--dash-accent2)" },
};

export function ToolDrawer() {
  const { state, closeDrawer } = useToolDrawer();
  const [closing, setClosing] = React.useState(false);

  // Close with animation
  const handleClose = React.useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      closeDrawer();
    }, 200);
  }, [closeDrawer]);

  // Escape key
  React.useEffect(() => {
    if (!state.open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [state.open, handleClose]);

  // Prevent body scroll when open
  React.useEffect(() => {
    if (state.open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [state.open]);

  if (!state.open && !closing) return null;

  const meta = state.toolKey ? TOOL_META[state.toolKey] : null;
  const Icon = meta?.icon ?? Languages;

  return (
    <>
      {/* Overlay */}
      <div
        className="dash-drawer-overlay"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className={`dash-drawer${closing ? " dash-drawer-closing" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={meta?.title ?? "Nástroj"}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-5 py-4 shrink-0"
          style={{ borderBottom: "1px solid var(--dash-border)" }}
        >
          <div
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg"
            style={{ background: `${meta?.color ?? "var(--dash-accent)"}1A` }}
          >
            <Icon className="h-4 w-4" style={{ color: meta?.color ?? "var(--dash-accent)" }} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold" style={{ color: "var(--dash-fg)" }}>
              {meta?.title ?? "Nástroj"}
            </div>
            <div className="text-xs" style={{ color: "var(--dash-muted)" }}>
              PDFlex
            </div>
          </div>

          <button
            onClick={handleClose}
            className="rounded-lg p-2 transition-colors"
            style={{ color: "var(--dash-muted)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--dash-fg)";
              (e.currentTarget as HTMLElement).style.background = "rgba(248,248,255,0.06)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--dash-muted)";
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
            aria-label="Zavrieť"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-6">
          {state.toolKey === "translate" && <TranslateTool />}
          {state.toolKey === "compress"  && <CompressTool />}
          {state.toolKey && !TOOL_META[state.toolKey] && (
            <div className="flex flex-col items-center justify-center h-64 gap-3" style={{ color: "var(--dash-muted)" }}>
              <div className="text-4xl">🔜</div>
              <p className="text-sm font-medium">Tento nástroj čoskoro príde</p>
              <p className="text-xs">Pracujeme na ňom — zostaň v obraze!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
