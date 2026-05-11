// src/index.ts
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth";
import fileRoutes from "./routes/files";
import jobRoutes from "./routes/jobs";
import toolsRoutes from "./routes/tools";
import statsRoutes from "./routes/stats";

const app = express();

const FRONTEND = (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/$/, "");
const BACKEND  = (process.env.BACKEND_URL  || "http://localhost:4000").replace(/\/$/, "");

// Povolené originy (explicit + všetky localhosty s portom)
const allowed = new Set<string>([
  FRONTEND,
  BACKEND,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

app.use(helmet());

// CORS MUSÍ byť pred routes
app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true); // napr. curl / native apps
      if (allowed.has(origin)) return cb(null, true);
      if (/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["ETag"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.get("/health", (_req, res) => res.json({ ok: true, now: new Date().toISOString() }));

// 🔌 routes
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/tools", toolsRoutes);
app.use("/api/stats", statsRoutes);

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => console.log(`PDFlex API listening on ${PORT}`));