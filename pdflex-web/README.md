d ~/Desktop/PDFlex/pdflex-auth
docker compose up -d
cd ..
cd pdflex-auth
npm run dev &
cd ../pdflex-web
npm run dev &
echo "✅ PDFlex beží na http://localhost:3000 (frontend) a http://localhost:4000 (backend)"