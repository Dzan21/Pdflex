// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";

import { AuthProvider } from "@/components/auth-provider";
import { Footer } from "@/components/footer";
import { ToasterHost } from "@/components/toaster";
import { ThemeScript } from "@/components/theme-script";
import { PageTransition } from "@/components/page-transition";
import { inter } from "@/styles/font";

export const metadata: Metadata = {
  title: "PDFlex",
  description: "Moderný PDF nástroj powered by AI.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body
        className={`${inter.variable} min-h-screen bg-[var(--bg)] text-[var(--fg)] antialiased safe-top safe-px`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-[var(--card-bg)] focus:px-3 focus:py-2 focus:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
        >
          Preskočiť na obsah
        </a>

        <AuthProvider>
          <main id="main" className="relative z-0">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <ToasterHost />
        </AuthProvider>
      </body>
    </html>
  );
}