#!/bin/bash
pkill -f "tsx watch" 2>/dev/null
pkill -f "next dev" 2>/dev/null
sleep 1

echo "Starting PDFlex backend..."
cd /Users/janvorcak/Desktop/PDFlex/pdflex-auth
pnpm dev > /tmp/pdflex-auth.log 2>&1 &
AUTH_PID=$!
echo "Backend PID: $AUTH_PID"

sleep 3

echo "Starting PDFlex frontend..."
cd /Users/janvorcak/Desktop/PDFlex/pdflex-web
pnpm dev
