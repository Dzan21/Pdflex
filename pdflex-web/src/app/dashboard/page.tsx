"use client";

import StatsPanel from "@/components/dashboard/stats";
import { GuestBanner } from "@/components/dashboard/guest-banner";
import { GuestModal } from "@/components/dashboard/guest-modal";
import { useAuth } from "@/components/auth-provider";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import {
  ArrowLeft,
  FileArchive,
  Languages,
  X,
} from "lucide-react";
import * as React from "react";

import CompressWorkspace from "@/components/dashboard/tools/CompressTool";
import TranslateWorkspace from "@/components/dashboard/tools/TranslateTool";

const GUEST_LIMIT = 2;
const GUEST_KEY = "pdflex_guest_uses";

type ToolKey = "translate" | "compress";

type Tool = {
  key: ToolKey;
  title: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
};

const TOOLS: Tool[] = [
  {
    key: "translate",
    title: "Translate PDF",
    hint: "Preserve layout",
    icon: Languages,
    iconColor: "text-cyan-500",
  },
  {
    key: "compress",
    title: "Compress PDF",
    hint: "Reduce file size",
    icon: FileArchive,
    iconColor: "text-indigo-500",
  },
];

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [active, setActive] = React.useState<Tool | null>(null);
  const [guestUses, setGuestUses] = React.useState(0);
  const [showModal, setShowModal] = React.useState(false);

  React.useEffect(() => {
    const stored = parseInt(localStorage.getItem(GUEST_KEY) || "0", 10);
    setGuestUses(stored);
  }, []);

  const handleToolClick = (tool: Tool) => {
    if (!user) {
      const next = guestUses + 1;
      setGuestUses(next);
      localStorage.setItem(GUEST_KEY, String(next));
      if (next > GUEST_LIMIT) {
        setShowModal(true);
        return;
      }
    }
    setActive(tool);
  };

  const isGuest = !loading && !user;

  return (
    <LayoutGroup>
      <div className="relative mx-auto max-w-6xl px-4 py-8">
        {/* Guest banner */}
        {isGuest && (
          <GuestBanner usesLeft={Math.max(0, GUEST_LIMIT - guestUses)} />
        )}

        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)]/90 p-6">
          <h1 className="text-xl font-semibold md:text-2xl">
            Welcome{user?.name ? `, ${user.name.split(" ")[0]}` : " to PDFlex"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {isGuest
              ? "You're browsing as a guest. Register for unlimited access."
              : "Choose a tool to get started."}
          </p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {TOOLS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => handleToolClick(t)}
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

      {showModal && <GuestModal onClose={() => setShowModal(false)} />}
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
