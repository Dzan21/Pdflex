"use client";

import {
  FileText,
  Table2,
  Image,
  Monitor,
  GitMerge,
  Scissors,
  RotateCw,
  Droplets,
  EyeOff,
  Hash,
  Lock,
  Unlock,
  PenLine,
  Award,
  Languages,
  FileSearch,
  MessageSquare,
  FileArchive,
  ScanLine,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ── Types ─────────────────────────────────────────── */

type ToolStatus = "available" | "soon";

interface Tool {
  icon: LucideIcon;
  color: string;
  title: string;
  desc: string;
  status: ToolStatus;
  ai?: boolean;
}

interface Group {
  label: string;
  accent: string;
  tools: Tool[];
}

/* ── Data ───────────────────────────────────────────── */

const GROUPS: Group[] = [
  {
    label: "Convert",
    accent: "text-blue-500",
    tools: [
      { icon: FileText,   color: "text-blue-400",   title: "PDF → Word",        desc: "Editable .docx, layout preserved.",          status: "soon" },
      { icon: Table2,     color: "text-green-400",  title: "PDF → Excel",       desc: "Tables extracted with column precision.",    status: "soon" },
      { icon: Image,      color: "text-pink-400",   title: "PDF → JPG",         desc: "High-res page renders, one click.",          status: "soon" },
      { icon: FileText,   color: "text-indigo-400", title: "Word → PDF",        desc: "Fonts and formatting intact.",               status: "soon" },
      { icon: Image,      color: "text-orange-400", title: "JPG → PDF",         desc: "Multiple images into a single PDF.",         status: "soon" },
      { icon: Monitor,    color: "text-violet-400", title: "PDF → PowerPoint",  desc: "Slides rebuilt from your PDF pages.",       status: "soon" },
    ],
  },
  {
    label: "Edit",
    accent: "text-emerald-500",
    tools: [
      { icon: GitMerge,   color: "text-emerald-400", title: "Merge PDF",         desc: "Combine any number of files in seconds.",   status: "soon" },
      { icon: Scissors,   color: "text-teal-400",    title: "Split PDF",         desc: "Extract pages or ranges with precision.",   status: "soon" },
      { icon: RotateCw,   color: "text-cyan-400",    title: "Rotate & Reorder",  desc: "Drag, flip, rearrange pages freely.",       status: "soon" },
      { icon: Droplets,   color: "text-sky-400",     title: "Watermark",         desc: "Text or image watermarks on every page.",   status: "soon" },
      { icon: EyeOff,     color: "text-rose-400",    title: "Redaction",         desc: "Permanently hide sensitive text.",          status: "soon" },
      { icon: Hash,       color: "text-amber-400",   title: "Page Numbers",      desc: "Custom style, position, and start index.",  status: "soon" },
    ],
  },
  {
    label: "Security",
    accent: "text-rose-500",
    tools: [
      { icon: Lock,       color: "text-red-400",     title: "Password Protect",  desc: "AES-256 encryption, open & edit passwords.", status: "soon" },
      { icon: Unlock,     color: "text-orange-400",  title: "Unlock PDF",        desc: "Remove passwords from your own files.",      status: "soon" },
      { icon: PenLine,    color: "text-violet-400",  title: "E-Signature",       desc: "Draw, type, or upload your signature.",      status: "soon" },
      { icon: Award,      color: "text-yellow-400",  title: "Digital Stamp",     desc: "Company logos and approval stamps.",         status: "soon" },
    ],
  },
  {
    label: "AI Tools",
    accent: "text-purple-500",
    tools: [
      { icon: Languages,    color: "text-cyan-400",    title: "AI Translate",      desc: "DeepL-powered, 30+ languages, layout kept.", status: "available", ai: true },
      { icon: FileSearch,   color: "text-indigo-400",  title: "AI Summarize",      desc: "Key points extracted in one paragraph.",     status: "soon",      ai: true },
      { icon: MessageSquare,color: "text-emerald-400", title: "Chat with PDF",     desc: "Ask questions, get cited answers.",          status: "soon",      ai: true },
      { icon: FileArchive,  color: "text-blue-400",    title: "Smart Compress",    desc: "AI picks the best quality/size balance.",    status: "available", ai: true },
      { icon: ScanLine,     color: "text-pink-400",    title: "OCR",               desc: "Make scanned PDFs fully searchable.",        status: "soon",      ai: true },
    ],
  },
];

/* ── Badge ──────────────────────────────────────────── */

function Badge({ status, ai }: { status: ToolStatus; ai?: boolean }) {
  if (ai && status !== "available") {
    return (
      <span className="ml-auto shrink-0 rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-purple-500">
        AI
      </span>
    );
  }
  if (status === "available") {
    return (
      <span className="ml-auto shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-500">
        {ai ? "AI · Live" : "Live"}
      </span>
    );
  }
  return (
    <span className="ml-auto shrink-0 rounded-full bg-[var(--card-border)]/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
      Soon
    </span>
  );
}

/* ── Tool card ──────────────────────────────────────── */

function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  const isLive = tool.status === "available";

  return (
    <div
      className={[
        "group relative flex flex-col gap-3 rounded-xl border p-4 text-left",
        "bg-[var(--card-bg)] transition-all duration-200",
        isLive
          ? "border-[var(--brand-500)]/40 hover:border-[var(--brand-500)] hover:shadow-md hover:shadow-[var(--brand-500)]/10"
          : "border-[var(--card-border)] hover:border-[var(--brand-500)]/50 hover:shadow-md",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[color:var(--fg)]/[0.05]">
          <Icon className={`h-4 w-4 ${tool.color}`} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[var(--fg)] leading-snug">{tool.title}</span>
            <Badge status={tool.status} ai={tool.ai} />
          </div>
          <p className="mt-1 text-xs text-[var(--muted)] leading-relaxed">{tool.desc}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Section ────────────────────────────────────────── */

export default function Features() {
  return (
    <section
      id="tools"
      aria-labelledby="features-title"
      className="relative w-full py-24 md:py-32"
    >
      {/* ── Background (mirrors hero) ─────────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-30 overflow-hidden">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.35] dark:opacity-[0.15]"
          style={{
            backgroundImage: "radial-gradient(circle, var(--brand-500) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        {/* Edge vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, var(--bg) 100%)",
          }}
        />
      </div>

      {/* Animated blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
        {/* Teal — top-left */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-[0.16] dark:opacity-[0.10]"
          style={{
            top: "-10%", left: "-8%",
            background: "radial-gradient(circle at center, #10b981 0%, transparent 70%)",
            filter: "blur(80px)",
            animation: "fblob-a 18s ease-in-out infinite",
          }}
        />
        {/* Blue — top-right */}
        <div
          className="absolute w-[700px] h-[700px] rounded-full opacity-[0.15] dark:opacity-[0.10]"
          style={{
            top: "-15%", right: "-10%",
            background: "radial-gradient(circle at center, #327fff 0%, transparent 70%)",
            filter: "blur(72px)",
            animation: "fblob-b 16s ease-in-out infinite",
            animationDelay: "3s",
          }}
        />
        {/* Purple — center-bottom */}
        <div
          className="absolute w-[700px] h-[500px] rounded-full opacity-[0.09] dark:opacity-[0.07]"
          style={{
            bottom: "5%", left: "50%", transform: "translateX(-50%)",
            background: "radial-gradient(circle at center, #8b5cf6 0%, transparent 70%)",
            filter: "blur(90px)",
            animation: "fblob-c 20s ease-in-out infinite",
            animationDelay: "6s",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes fblob-a {
          0%,100% { transform: translate(0,0) scale(1); }
          40%     { transform: translate(40px,50px) scale(1.08); }
          70%     { transform: translate(-20px,20px) scale(0.95); }
        }
        @keyframes fblob-b {
          0%,100% { transform: translate(0,0) scale(1); }
          35%     { transform: translate(-50px,30px) scale(1.1); }
          65%     { transform: translate(20px,-30px) scale(0.93); }
        }
        @keyframes fblob-c {
          0%,100% { transform: translateX(-50%) scale(1); }
          50%     { transform: translateX(-50%) scale(1.12); }
        }
      `}</style>

      <div className="mx-auto max-w-6xl px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2
            id="features-title"
            className="text-4xl font-black tracking-tight md:text-5xl"
          >
            <span className="bg-gradient-to-r from-[var(--brand-500)] to-emerald-400 bg-clip-text text-transparent">
              Every PDF tool
            </span>{" "}
            <span className="text-[var(--fg)]">you'll ever need</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[var(--muted)] md:text-lg">
            Convert, edit, secure, and supercharge your documents with AI — all in one place.
          </p>
        </div>

        {/* Tool groups */}
        <div className="space-y-14">
          {GROUPS.map((group) => (
            <div key={group.label}>
              {/* Group label */}
              <div className="flex items-center gap-3 mb-5">
                <h3 className={`text-xs font-bold uppercase tracking-widest ${group.accent}`}>
                  {group.label}
                </h3>
                <div className="h-px flex-1 bg-[var(--card-border)]" />
              </div>

              {/* Cards grid */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.tools.map((tool) => (
                  <ToolCard key={tool.title} tool={tool} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
