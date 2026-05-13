// src/app/dashboard/layout.tsx
import type { Metadata } from "next";
import DashboardTopBar from "@/components/dashboard/top-bar";
import DashboardSidebar from "@/components/dashboard/sidebar";
import { ToolDrawerProvider } from "@/components/dashboard/tool-drawer-context";
import { ToolDrawer } from "@/components/dashboard/ToolDrawer";

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
    <ToolDrawerProvider>
      <div
        className="min-h-screen"
        style={{ background: "var(--dash-bg)", color: "var(--dash-fg)" }}
      >
        {/* Sidebar — desktop only (md+) */}
        <DashboardSidebar />

        {/* Top bar — mobile only */}
        <div className="md:hidden">
          <DashboardTopBar />
        </div>

        {/* Main content */}
        <main className="md:ml-[240px] flex-1 px-4 pb-16 pt-20 md:pt-8 sm:px-6 max-w-full">
          {children}
        </main>

        {/* Right-side tool drawer (renders portal-style above everything) */}
        <ToolDrawer />
      </div>
    </ToolDrawerProvider>
  );
}
