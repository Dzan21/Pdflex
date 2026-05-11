import type { Metadata } from "next";
import "@/app/globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { ThemeScript } from "@/components/theme-script";
import { inter } from "@/styles/font";
import MegaNavMobile from "@/components/nav/mega-nav.mobile"; // alebo MobileNav podľa verzie

export const metadata: Metadata = {
  title: "PDFlex – Mobil",
  description: "Mobilná verzia aplikácie PDFlex",
};

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeScript />
      <div className={`${inter.variable} min-h-screen bg-[var(--bg)] text-[var(--fg)] antialiased safe-top safe-px`}>
        <AuthProvider>
          <MegaNavMobile />
          <main className="pt-16">{children}</main>
        </AuthProvider>
      </div>
    </>
  );
}