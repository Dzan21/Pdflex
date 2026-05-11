import Link from "next/link";
import { Twitter, Linkedin } from "lucide-react";

const COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "All tools",        href: "/#tools" },
      { label: "Pricing",          href: "/#pricing" },
      { label: "API documentation",href: "/docs/api" },
      { label: "Changelog",        href: "/changelog" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About",   href: "/about" },
      { label: "Blog",    href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy",   href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "GDPR",             href: "/gdpr" },
      { label: "Cookie Policy",    href: "/cookies" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--card-border)] bg-[var(--card-bg)]">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-[var(--fg)] hover:opacity-80 transition-opacity"
            >
              PDF<span className="text-[var(--brand-500)]">lex</span>
            </Link>
            <p className="text-sm text-[var(--muted)] leading-relaxed max-w-[200px]">
              The best AI-powered PDF toolkit for modern teams.
            </p>
            <div className="flex items-center gap-3 mt-1">
              <a
                href="https://twitter.com/pdflex"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="grid h-8 w-8 place-items-center rounded-full border border-[var(--card-border)] text-[var(--muted)] hover:border-[var(--brand-500)] hover:text-[var(--brand-500)] transition-all duration-200"
              >
                <Twitter className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://linkedin.com/company/pdflex"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="grid h-8 w-8 place-items-center rounded-full border border-[var(--card-border)] text-[var(--muted)] hover:border-[var(--brand-500)] hover:text-[var(--brand-500)] transition-all duration-200"
              >
                <Linkedin className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--fg)]">
                {col.heading}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[var(--card-border)] pt-6 text-xs text-[var(--muted)] sm:flex-row">
          <span>© {new Date().getFullYear()} PDFlex s.r.o. · All rights reserved.</span>
          <span className="hidden sm:block">
            Built with ♥ for document lovers.
          </span>
        </div>
      </div>
    </footer>
  );
}
