// src/app/dashboard/layout.tsx
import type { Metadata } from "next";
import DashboardTopBar from "@/components/dashboard/top-bar";

export const metadata: Metadata = {
  title: "PDFlex • Dashboard",
  description:
    "Your personal PDF workspace — translate, compress, and manage files with ease.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--fg)] transition-colors duration-300">
      <DashboardTopBar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-3 pb-12 pt-6 sm:px-5">
        {children}
      </main>
    </div>
  );
}