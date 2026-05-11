// src/app/dashboard/layout.tsx
import type { Metadata } from "next";
import DashboardTopBar from "@/components/dashboard/top-bar";
import DashboardSidebar from "@/components/dashboard/sidebar";

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
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] transition-colors duration-300">
      {/* Sidebar — desktop only (md+) */}
      <DashboardSidebar />

      {/* Top bar — mobile only (hidden md+) */}
      <div className="md:hidden">
        <DashboardTopBar />
      </div>

      {/* Main content — offset by sidebar on desktop, by topbar on mobile */}
      <main className="md:ml-[240px] flex-1 px-3 pb-12 pt-20 md:pt-8 sm:px-5 max-w-full">
        {children}
      </main>
    </div>
  );
}
