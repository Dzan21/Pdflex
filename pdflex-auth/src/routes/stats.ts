// src/routes/stats.ts
import { Router } from "express";

export type JobKind = "translate" | "compress" | "merge" | "split" | "protect" | "ocr" | "pdf2word" | "pdf2excel" | "pdf2ppt";

type Overview = {
  monthCount: number;
  secured: number;
  avgMs: number;
  storageUsedBytes: number;
  translateCount: number;
  compressCount: number;
  mostUsedTool: string;
};

const stats = {
  overview: {
    monthCount: 0,
    secured: 0,
    avgMs: 0,
    _sumMs: 0,
    _countMs: 0,
    storageUsedBytes: 0,
    translateCount: 0,
    compressCount: 0,
    mostUsedTool: "—",
  } as Overview & { _sumMs: number; _countMs: number },
  weekly: {
    labels: [] as string[],
    values: [] as number[],
  },
};

function initWeekly() {
  const now = new Date();
  const labels: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    labels.push(
      d.toLocaleDateString("sk-SK", { weekday: "short" }).replace(".", "")
    );
  }
  stats.weekly.labels = labels;
  stats.weekly.values = new Array(7).fill(0);
}
initWeekly();

function bumpToday(cnt = 1) {
  const now = new Date();
  const todaysShort = now
    .toLocaleDateString("sk-SK", { weekday: "short" })
    .replace(".", "");

  const lastLabel = stats.weekly.labels[6];
  if (lastLabel !== todaysShort) {
    initWeekly();
  }
  stats.weekly.values[6] = (stats.weekly.values[6] || 0) + cnt;
}

export function recordJob(input: { kind: JobKind; ms: number; secured?: boolean }) {
  stats.overview.monthCount += 1;
  if (input.secured) stats.overview.secured += 1;

  if (input.kind === "translate") stats.overview.translateCount += 1;
  if (input.kind === "compress") stats.overview.compressCount += 1;

  stats.overview._sumMs += Math.max(0, Number(input.ms) || 0);
  stats.overview._countMs += 1;
  stats.overview.avgMs = stats.overview._countMs
    ? Math.round(stats.overview._sumMs / stats.overview._countMs)
    : 0;

  const counts: Record<string, number> = {};
  counts[input.kind] = (counts[input.kind] || 0) + 1;
  const topKind = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  if (topKind) stats.overview.mostUsedTool = topKind[0];

  bumpToday(1);
}

const router = Router();

// GET /api/stats/overview
router.get("/overview", (_req, res) => {
  const { _sumMs, _countMs, ...clean } = stats.overview;
  res.json(clean);
});

// GET /api/stats/weekly
router.get("/weekly", (_req, res) => {
  res.json({
    labels: stats.weekly.labels,
    values: stats.weekly.values,
  });
});

// POST /api/stats/debug/record — testovanie
router.post("/debug/record", (req, res) => {
  const { kind = "translate", ms = 420, secured = false } = req.body || {};
  recordJob({ kind, ms, secured });
  res.json({ ok: true });
});

export default router;
