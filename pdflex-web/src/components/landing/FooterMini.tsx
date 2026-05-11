export function FooterMini() {
  return (
    <footer className="border-t border-[color:var(--card-border)]/70">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 text-sm">
        <p className="text-muted">© {new Date().getFullYear()} PDFlex</p>
        <nav className="flex gap-4">
          <a className="hover:opacity-80" href="/privacy">
            Privacy
          </a>
          <a className="hover:opacity-80" href="/terms">
            Terms
          </a>
          <a className="hover:opacity-80" href="/support">
            Support
          </a>
        </nav>
      </div>
    </footer>
  );
}