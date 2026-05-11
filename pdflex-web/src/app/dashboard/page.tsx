"use client";

import StatsPanel from "@/components/dashboard/stats";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import {
  ArrowLeft,
  FileArchive,
  Languages,
  X
} from "lucide-react";
import * as React from "react";

import CompressWorkspace from "@/components/dashboard/tools/CompressTool";
import TranslateWorkspace from "@/components/dashboard/tools/TranslateTool";

type ToolKey = "translate" | "compress";

type Tool = {
  key: ToolKey;
  title: string;
  hint: string;
  icon: React.ComponentType<any>;
  iconColor: string;
};

const TOOLS: Tool[] = [
  {
    key: "translate",
    title: "Translate PDF",
    hint: "Preserve layout",
    icon: Languages,
    iconColor: "text-cyan-300",
  },
  {
    key: "compress",
    title: "Compress PDF",
    hint: "Reduce file size",
    icon: FileArchive,
    iconColor: "text-indigo-300",
  },
];

export default function DashboardPage() {
  const [active, setActive] = React.useState<Tool | null>(null);

  return (
    <LayoutGroup>
      <div className="relative mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)]/90 p-6">
          <h1 className="text-xl font-semibold md:text-2xl">
            Welcome back to PDFlex
          </h1>
          <p className="mt-1 text-sm text-muted">
            Choose a tool to get started.
          </p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {TOOLS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setActive(t)}
                className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)]/80 p-6 text-left hover:shadow-xl transition"
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-6 w-6 ${t.iconColor}`} />
                  <div>
                    <div className="font-semibold">{t.title}</div>
                    <div className="text-xs text-muted">{t.hint}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <StatsPanel />
      </div>

      <AnimatePresence>
        {active && (
          <ToolPanel tool={active} onClose={() => setActive(null)} />
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}

function ToolPanel({
  tool,
  onClose,
}: {
  tool: Tool;
  onClose: () => void;
}) {
  const Icon = tool.icon;

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-[var(--bg)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="mx-auto flex h-full max-w-6xl flex-col px-4">
        <div className="mt-6 flex items-center justify-between">
          <button onClick={onClose} className="btn-neo h-9 px-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </button>

          <div className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${tool.iconColor}`} />
            <span className="font-semibold">{tool.title}</span>
          </div>

          <button onClick={onClose} className="btn-neo h-9 px-4">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 mt-6">
          {tool.key === "translate" && <TranslateWorkspace />}
          {tool.key === "compress" && <CompressWorkspace />}
        </div>
      </div>
    </motion.div>
  );
}