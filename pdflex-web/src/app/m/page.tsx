// src/app/m/page.tsx
"use client";

import CTAMobile from "@/components/landing/cta.mobile";
import FeaturesMobile from "@/components/landing/features.mobile";
import HeroMobile from "@/components/landing/hero.mobile";
import ShowcaseMobile from "@/components/landing/showcase.mobile";
import MegaNavMobile from "@/components/nav/mega-nav.mobile"; // 👈 import

export default function MobileLandingPage() {
    return (
        <div className="w-full min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
            {/* 👇 Nav musí byť mimo main, aby nezmizol pri prepnutí stavu */}
            <MegaNavMobile />

            <main className="flex flex-col gap-24 pb-20">
                <HeroMobile />
                <FeaturesMobile />
                <ShowcaseMobile />
                <CTAMobile />
                <footer className="text-center text-xs text-[color:var(--muted)] px-6 pt-10">
                    <p>© {new Date().getFullYear()} PDFlex. All rights reserved.</p>
                </footer>
            </main>
        </div>
    );
}