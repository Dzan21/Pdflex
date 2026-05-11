// pdflex-web/src/app/page.tsx
import MegaNav from "../components/mega-nav";
import HeroCarousel from "../components/hero-carousel";
import SectionTiles from "../components/section-tiles";
import TrustBar from "../components/trust-bar";
import CookieBar from "../components/cookie-bar";

export default function HomePage() {
  return (
    <div className="relative">
      {/* Top nav (Tesla look) */}
      <MegaNav />

      {/* Hero s karuselom (futuristic vibe) */}
      <section aria-label="Úvod">
        <HeroCarousel />
      </section>

      {/* Trust / logá / badges */}
      <section aria-label="Dôveryhodnosť" className="mt-10">
        <div className="container">
          <TrustBar />
        </div>
      </section>

      {/* Sekcia “čo dokáže PDFlex” – vizuálne karty */}
      <section aria-label="Funkcie" className="mt-16">
        <div className="container">
          <SectionTiles />
        </div>
      </section>

      {/* Cookie bar dolu (sticky) */}
      <CookieBar />
    </div>
  );
}