# infra (DB, Redis, MinIO)
cd ~/Desktop/PDFlex/pdflex-auth
docker compose down
docker compose up -d
docker compose -f docker-compose.minio.yml up -d
docker ps
mc alias set local http://localhost:9000 minioadmin minioadmin || true
mc mb local/pdflex-dev || true
cat > cors.json <<'JSON'
{
  "CORSRules": [
    {
      "AllowedOrigins": [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
      ],
      "AllowedMethods": ["GET","PUT","POST","HEAD"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3600
    }
  ]
}
JSON
mc cors set local/pdflex-dev ./cors.json || true

# backend
cd ~/Desktop/PDFlex/pdflex-auth
rm -rf node_modules
npm install
npx prisma generate
npx tsx src/index.ts

# health check
curl -sS http://localhost:4000/health

# frontend
cd ~/Desktop/PDFlex/pdflex-web
rm -rf node_modules .next
npm install
npm run dev