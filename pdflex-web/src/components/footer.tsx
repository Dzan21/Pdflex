export function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--card-border)]/70">
      <div className="container flex flex-col items-center justify-between gap-3 py-6 text-sm md:flex-row">
        <p className="text-muted">© {new Date().getFullYear()} PDFlex. Všetky práva vyhradené.</p>
        <nav className="flex gap-4">
          <a className="hover:underline" href="/terms">Podmienky</a>
          <a className="hover:underline" href="/privacy">Súkromie</a>
          <a className="hover:underline" href="/support">Podpora</a>
        </nav>
      </div>
    </footer>
  );
}