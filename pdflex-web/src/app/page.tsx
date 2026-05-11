import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import Stats from "@/components/landing/stats";
import Pricing from "@/components/landing/pricing";
import MegaNav from "@/components/mega-nav";

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      <MegaNav />

      <main className="pt-16">
        <section id="home">
          <Hero />
        </section>

        <section id="tools">
          <Features />
        </section>

        <section id="stats">
          <Stats />
        </section>

        <section id="pricing">
          <Pricing />
        </section>
      </main>
    </div>
  );
}
