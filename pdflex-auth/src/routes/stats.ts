// src/routes/stats.ts
import { Router } from "express";

export type JobKind = "translate" | "compress" | "merge" | "split" | "protect" | "ocr" | "pdf2word" | "pdf2excel" | "pdf2ppt";

type Overview = {
  monthCount: number;       // celkový počet jobov za aktuálny mesiac
  secured: number;          // koľko bolo "secured" (napr. protect/redact)
  avgMs: number;            // priemerný čas spracovania
  storageUsedPct: number;   // placeholder, ak máš storage -> tu si dosadíš
};

const stats = {
  overview: {
    monthCount: 0,
    secured: 0,
    avgMs: 0,
    _sumMs: 0,
    _countMs: 0,
    storageUsedPct: 0,
  } as Overview & { _sumMs: number; _countMs: number },
  weekly: {
    // posledných 7 dní (index 0 = dnes)
    labels: [] as string[],
    values: [] as number[],
  },
};

// init weekly labels
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

// nazbierať do dnešnej priehradky
function bumpToday(cnt = 1) {
  const now = new Date();
  const dow = now.getDay(); // 0-6
  // weekly.labels sú za posledných 7 dní; ak prejde deň, posunieme okno
  const todaysShort = now
    .toLocaleDateString("sk-SK", { weekday: "short" })
    .replace(".", "");

  const lastLabel = stats.weekly.labels[6];
  if (lastLabel !== todaysShort) {
    // posuň okno o (1..n) dní dopredu
    initWeekly();
  }
  stats.weekly.values[6] = (stats.weekly.values[6] || 0) + cnt;
}

// >>> Toto zavolaj po úspešnom dokončení akcie (translate/compress/...)
export function recordJob(input: { kind: JobKind; ms: number; secured?: boolean }) {
  // mesačné (jednoducho… pri reštarte sa nuluje; na produkcii si to naviaž na DB)
  stats.overview.monthCount += 1;
  if (input.secured) stats.overview.secured += 1;

  // priemer ms
  stats.overview._sumMs += Math.max(0, Number(input.ms) || 0);
  stats.overview._countMs += 1;
  stats.overview.avgMs = stats.overview._countMs
    ? Math.round(stats.overview._sumMs / stats.overview._countMs)
    : 0;

  // týždenné
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

// Pomocný endpoint na testovanie (môžeš vypnúť na produkcii)
router.post("/debug/record", (req, res) => {
  const { kind = "translate", ms = 420, secured = false } = req.body || {};
  recordJob({ kind, ms, secured });
  res.json({ ok: true });
});

export default router;