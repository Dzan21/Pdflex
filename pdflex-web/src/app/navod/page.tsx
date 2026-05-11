"use client";

import Link from "next/link";
import { ArrowRight, Upload, CreditCard, XCircle, FileText, Shield, RefreshCw } from "lucide-react";

export default function NavodPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-10 space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-semibold">Návod</h1>
        <p className="text-muted max-w-2xl mx-auto">
          Krátke a jasné postupy. Žiadne odborné slová, len kroky ako na to.
        </p>
      </header>

      {/* TOC */}
      <nav className="card p-5 md:p-6 rounded-xl">
        <h2 className="text-lg font-semibold text-default mb-2">Obsah</h2>
        <ul className="grid gap-2 text-sm">
          <li><a className="text-[var(--brand-500)] hover:opacity-80" href="#nahratie"><Upload className="inline mr-2 h-4 w-4" />Nahratie súboru</a></li>
          <li><a className="text-[var(--brand-500)] hover:opacity-80" href="#spracovanie"><FileText className="inline mr-2 h-4 w-4" />Spustenie úlohy (Merge, Split, Compress…)</a></li>
          <li><a className="text-[var(--brand-500)] hover:opacity-80" href="#stiahnutie"><RefreshCw className="inline mr-2 h-4 w-4" />Stiahnutie výsledku</a></li>
          <li><a className="text-[var(--brand-500)] hover:opacity-80" href="#platba"><CreditCard className="inline mr-2 h-4 w-4" />Platba a predplatné</a></li>
          <li><a className="text-[var(--brand-500)] hover:opacity-80" href="#zrusenie"><XCircle className="inline mr-2 h-4 w-4" />Zrušenie predplatného</a></li>
          <li><a className="text-[var(--brand-500)] hover:opacity-80" href="#bezpecnost"><Shield className="inline mr-2 h-4 w-4" />Bezpečnosť a súkromie</a></li>
        </ul>
      </nav>

      {/* Sekcia: Nahratie */}
      <section id="nahratie" className="card p-5 md:p-6 rounded-xl scroll-mt-24">
        <h2 className="text-lg font-semibold text-default">Nahratie súboru</h2>
        <ol className="mt-2 space-y-2 text-sm">
          <li>1. Na <Link href="/dashboard" className="text-[var(--brand-500)] hover:opacity-80">Dashboarde</Link> klikni na <b>Vybrať PDF</b> alebo pretiahni súbor do okna.</li>
          <li>2. Môžeš pridať aj viac súborov naraz.</li>
          <li>3. Ak si vybral omylom, pri súbore klikni na <b>✕</b> a odstráň ho zo zoznamu.</li>
        </ol>
        <div className="mt-3 text-xs text-muted">Tip: Veľké súbory nechaj nahrávať na pozadí a pokračuj v práci.</div>
      </section>

      {/* Sekcia: Spracovanie */}
      <section id="spracovanie" className="card p-5 md:p-6 rounded-xl scroll-mt-24">
        <h2 className="text-lg font-semibold text-default">Spustenie úlohy (Merge, Split, Compress, …)</h2>
        <ol className="mt-2 space-y-2 text-sm">
          <li>1. V časti <b>Rýchle akcie</b> vyber, čo chceš spraviť (napr. <b>Merge</b> alebo <b>Compress</b>).</li>
          <li>2. Nastav jednoduché možnosti (poradie, kvalita, heslo…).</li>
          <li>3. Potvrď. Uvidíš stav úlohy v zozname „Posledné spracovania“.</li>
        </ol>
        <div className="mt-3 text-xs text-muted">Tip: Ak máš viac vecí naraz, spusti ich postupne — hotové nájdeš v histórii.</div>
      </section>

      {/* Sekcia: Stiahnutie */}
      <section id="stiahnutie" className="card p-5 md:p-6 rounded-xl scroll-mt-24">
        <h2 className="text-lg font-semibold text-default">Stiahnutie výsledku</h2>
        <ol className="mt-2 space-y-2 text-sm">
          <li>1. Keď sa úloha dokončí, pri položke sa objaví tlačidlo <b>Stiahnuť</b>.</li>
          <li>2. Klikni a súbor sa uloží do tvojho zariadenia.</li>
          <li>3. Neskôr sa dá nájsť v histórii v <Link href="/dashboard" className="text-[var(--brand-500)] hover:opacity-80">Dashborde</Link>.</li>
        </ol>
      </section>

      {/* Sekcia: Platba */}
      <section id="platba" className="card p-5 md:p-6 rounded-xl scroll-mt-24">
        <h2 className="text-lg font-semibold text-default">Platba a predplatné</h2>
        <ol className="mt-2 space-y-2 text-sm">
          <li>1. Otvor <Link href="/pricing" className="text-[var(--brand-500)] hover:opacity-80">Cenník</Link> a zvoľ si plán.</li>
          <li>2. Po prihlásení dokonči platbu kartou.</li>
          <li>3. Hneď po úhrade sa ti odomknú výhody plánu.</li>
        </ol>
        <div className="mt-3 text-xs text-muted">Platby sú bezpečné a môžeš ich kedykoľvek spravovať.</div>
      </section>

      {/* Sekcia: Zrušenie */}
      <section id="zrusenie" className="card p-5 md:p-6 rounded-xl scroll-mt-24">
        <h2 className="text-lg font-semibold text-default">Zrušenie predplatného</h2>
        <ol className="mt-2 space-y-2 text-sm">
          <li>1. V účte otvor „Predplatné“.</li>
          <li>2. Klikni na <b>Zrušiť</b> a potvrď.</li>
          <li>3. Predplatné bude aktívne do konca zaplateného obdobia.</li>
        </ol>
      </section>

      {/* Sekcia: Bezpečnosť */}
      <section id="bezpecnost" className="card p-5 md:p-6 rounded-xl scroll-mt-24">
        <h2 className="text-lg font-semibold text-default">Bezpečnosť a súkromie</h2>
        <ul className="mt-2 space-y-2 text-sm">
          <li>• Súbory po čase mažeme. Nezdieľame ich s nikým cudzím.</li>
          <li>• Účet si chráň heslom a overením e-mailu.</li>
          <li>• Výsledky si môžeš kedykoľvek stiahnuť a vymazať.</li>
        </ul>
        <div className="mt-4 flex justify-end">
          <a href="#top" className="btn btn-ghost">
            Hore <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </div>
      </section>
    </div>
  );
}