import Fullpage from "@/components/effects/fullpage";
import Reveal from "@/components/effects/reveal";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import Showcase from "@/components/landing/showcase";
import CTA from "@/components/landing/cta";
import MegaNav from "@/components/mega-nav"; // 👈 pridaj toto

export default function HomePage() {
  return (
    <div className="landing-bg relative min-h-screen">
      <MegaNav /> {/* 👈 pridaj sem */}

      <div aria-hidden className="landing-grid absolute inset-0" />
      <Fullpage className="relative z-10">
        {/* sekcie */}
        <section id="home" data-snap="section" className="min-h-[100svh] flex items-center justify-center">
          <div className="w-full">
            <Reveal><Hero /></Reveal>
          </div>
        </section>

        <section id="features" data-snap="section" className="min-h-[100svh] flex items-center justify-center">
          <div className="w-full">
            <Reveal delay={80}><Features /></Reveal>
          </div>
        </section>

        <section id="showcase" data-snap="section" className="min-h-[100svh] flex items-center justify-center">
          <div className="w-full">
            <Reveal delay={100}><Showcase /></Reveal>
          </div>
        </section>

        <section id="cta" data-snap="section" className="min-h-[100svh] flex items-center justify-center">
          <div className="w-full">
            <Reveal delay={120}><CTA /></Reveal>
          </div>
        </section>
      </Fullpage>
    </div>
  );
}