# PDFlex — Spustenie projektu

## Požiadavky

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- Docker Desktop

## Prvé spustenie

### 1. Klonovanie

```bash
git clone https://github.com/Dzan21/Pdflex.git
cd Pdflex
```

### 2. Databáza a MinIO (Docker)

```bash
cd pdflex-auth
docker-compose up -d
# Voliteľne MinIO (S3 kompatibilné úložisko):
# docker-compose -f docker-compose.minio.yml up -d
```

### 3. Backend — Terminál 1

```bash
cd pdflex-auth
cp .env.example .env
# Vyplň hodnoty v .env (JWT_ACCESS_TOKEN_SECRET, S3_ACCESS_KEY, ...)
pnpm install
pnpm prisma generate
pnpm prisma migrate deploy
pnpm dev
# Očakávaný výstup: {"level":30,"name":"pdflex-api","msg":"PDFlex API listening on 4000"}
```

### 4. Frontend — Terminál 2

```bash
cd pdflex-web
cp .env.example .env.local
# .env.local: NEXT_PUBLIC_API_URL=http://localhost:4000
pnpm install
pnpm dev
# Očakávaný výstup: Local: http://localhost:3000
```

---

## Každodenné spustenie

### Terminál 1 — Backend

```bash
cd pdflex-auth
docker-compose up -d   # spustí PostgreSQL (ak nebeží)
pnpm dev
```

### Terminál 2 — Frontend

```bash
cd pdflex-web
pnpm dev
```

---

## Porty

| Služba       | Port  | URL                        |
|--------------|-------|----------------------------|
| Frontend     | 3000  | http://localhost:3000      |
| Backend API  | 4000  | http://localhost:4000      |
| PostgreSQL   | 5433  | localhost:5433             |
| Redis        | 6379  | localhost:6379             |
| MinIO UI     | 9001  | http://localhost:9001      |
| MinIO API    | 9000  | http://localhost:9000      |

---

## Zdravotný check

```bash
curl http://localhost:4000/health
# {"ok":true,"now":"2026-..."}
```

---

## Premenné prostredia

### pdflex-auth/.env

| Premenná                    | Popis                              |
|-----------------------------|------------------------------------|
| `DATABASE_URL`              | PostgreSQL connection string       |
| `JWT_ACCESS_TOKEN_SECRET`   | Tajný kľúč pre access tokeny       |
| `JWT_REFRESH_TOKEN_SECRET`  | Tajný kľúč pre refresh tokeny      |
| `REDIS_URL`                 | Redis URL                          |
| `S3_BUCKET`                 | MinIO bucket name                  |
| `S3_ACCESS_KEY`             | MinIO access key                   |
| `S3_SECRET_KEY`             | MinIO secret key                   |
| `S3_ENDPOINT`               | MinIO endpoint URL                 |
| `DEEPL_API_KEY`             | DeepL API kľúč (preklad PDF)       |
| `FRONTEND_URL`              | URL frontendu (CORS)               |
| `PORT`                      | Port backendu (default: 4000)      |

### pdflex-web/.env.local

| Premenná               | Popis                        |
|------------------------|------------------------------|
| `NEXT_PUBLIC_API_URL`  | URL backendu                 |

---

## Štruktúra projektu

```
Pdflex/
├── pdflex-auth/          # Express + Prisma backend (port 4000)
│   ├── src/
│   │   ├── routes/       # API routes (auth, files, tools, stats, jobs)
│   │   ├── services/     # S3/MinIO integrácia
│   │   ├── workers/      # BullMQ worker
│   │   └── index.ts      # Entry point
│   ├── prisma/           # Schéma a migrácie
│   └── docker-compose.yml
├── pdflex-web/           # Next.js 15 frontend (port 3000)
│   └── src/
│       ├── app/          # App Router stránky
│       ├── components/   # React komponenty
│       └── lib/          # API helpers, utilities
└── DEVELOPMENT.md
```
