#!/bin/bash
echo "Killing old processes..."
pkill -f "tsx" 2>/dev/null
pkill -f "next" 2>/dev/null
sleep 2

echo "Starting backend..."
cd /Users/janvorcak/Desktop/PDFlex/pdflex-auth
pnpm dev &

sleep 4

echo "Starting frontend..."
cd /Users/janvorcak/Desktop/PDFlex/pdflex-web
exec pnpm dev
