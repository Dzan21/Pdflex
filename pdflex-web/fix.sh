
echo "🔨 Čistenie a reset projektu PDFlex..."

cd ~/Desktop/PDFlex/pdflex-web || exit 1

killall node npm 2>/dev/null || true

rm -rf node_modules .next package-lock.json
npm cache clean --force

echo "🧹 Odstraňujem chybný balík motion-dom a motion-utils (nepotrebné)..."
npm uninstall motion-dom motion-utils || true

echo "📥 Inštalujem závislosti..."
npm install

echo "📦 Doinštalujem Tailwind závislý modul"
npm install --save-dev --save-exact @alloc/quick-lru

echo "🚀 Spúšťam Next.js vývojový server..."
npm run dev

