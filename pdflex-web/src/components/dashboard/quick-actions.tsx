"use client";

import * as React from "react";
import {
  Lock,
  Unlock,
  Scissors,
  FileSymlink,
  FileText,
  Languages,
  Shrink,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ToolKey =
  | "upload"
  | "merge"
  | "split"
  | "compress"
  | "translate"
  | "protect"
  | "unlock"
  | "pdf2word";

type Tool = {
  key: ToolKey;
  label: string;
  icon: React.ReactNode;
  href: string;
};

const ALL_TOOLS: Tool[] = [
  {
    key: "upload",
    label: "Nahrať PDF",
    icon: <FileSymlink size={16} />,
    href: "/dashboard/upload",
  },
  {
    key: "merge",
    label: "Spojiť PDF",
    icon: <FileText size={16} />,
    href: "/dashboard/tools/merge",
  },
  {
    key: "split",
    label: "Rozdeliť PDF",
    icon: <Scissors size={16} />,
    href: "/dashboard/tools/split",
  },
  {
    key: "compress",
    label: "Compress (PDF/Word)",
    icon: <Shrink size={16} />,
    href: "/dashboard/tools/compress", // ✅ OPRAVENÉ
  },
  {
    key: "translate",
    label: "Preložiť PDF",
    icon: <Languages size={16} />,
    href: "/dashboard/tools/translate",
  },
  {
    key: "protect",
    label: "Zaheslovať PDF",
    icon: <Lock size={16} />,
    href: "/dashboard/tools/protect",
  },
  {
    key: "unlock",
    label: "Odomknúť PDF",
    icon: <Unlock size={16} />,
    href: "/dashboard/tools/unlock",
  },
  {
    key: "pdf2word",
    label: "PDF → Word",
    icon: <FileText size={16} />,
    href: "/dashboard/tools/pdf2word",
  },
];

const DEFAULT_PINNED: ToolKey[] = [
  "upload",
  "merge",
  "compress",
  "translate",
  "protect",
  "pdf2word",
];

function byKeys(keys: ToolKey[]) {
  const map = new Map(ALL_TOOLS.map((t) => [t.key, t]));
  return keys.map((k) => map.get(k)!).filter(Boolean);
}

function ToolButton({
  tool,
  pinned,
  onToggle,
}: {
  tool: Tool;
  pinned: boolean;
  onToggle: (key: ToolKey) => void;
}) {
  return (
    <a
      href={tool.href}
      className={cn(
        "group relative rounded-lg border border-[var(--card-border)] px-4 py-3 hover:shadow-sm transition-colors",
        "bg-[var(--card-bg)] text-[var(--fg)]"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {tool.icon}
          <span className="font-medium">{tool.label}</span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onToggle(tool.key);
          }}
          aria-label={pinned ? "Odpnúť" : "Pripnúť"}
          className="text-muted hover:text-[var(--fg)] transition-colors text-xs"
        >
          {pinned ? "★" : "☆"}
        </button>
      </div>
    </a>
  );
}

export default function QuickActions() {
  const [pinned, setPinned] = React.useState<ToolKey[]>(DEFAULT_PINNED);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("pdflex:pinned-tools");
      if (raw) {
        const parsed = JSON.parse(raw) as ToolKey[];
        if (Array.isArray(parsed) && parsed.length) {
          setPinned(parsed);
        }
      }
    } catch {}
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem("pdflex:pinned-tools", JSON.stringify(pinned));
    } catch {}
  }, [pinned, hydrated]);

  const togglePin = (k: ToolKey) => {
    setPinned((prev) =>
      prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]
    );
  };

  const pinnedTools = byKeys(pinned);
  const others = ALL_TOOLS.filter((t) => !pinned.includes(t.key));

  return (
    <div className="space-y-4">
      <div className="text-xs text-muted mb-2">Pripnuté</div>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {pinnedTools.map((t) => (
          <ToolButton key={`p-${t.key}`} tool={t} pinned={true} onToggle={togglePin} />
        ))}
      </div>

      <div className="text-xs text-muted mt-6 mb-2">Ďalšie nástroje</div>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {others.map((t) => (
          <ToolButton key={`o-${t.key}`} tool={t} pinned={false} onToggle={togglePin} />
        ))}
      </div>
    </div>
  );
}