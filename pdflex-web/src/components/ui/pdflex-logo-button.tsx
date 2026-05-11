"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PDFlexLogoButton() {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth <= 768);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleClick = () => {
    router.push(isMobile ? "/m" : "/");
  };

  return (
    <button
      onClick={handleClick}
      className="group inline-flex items-center gap-2"
      aria-label="Prejsť na domov"
    >
      <span className="rounded-md bg-[var(--fg)] px-1.5 py-0.5 text-xs font-black text-[var(--bg)] shadow-sm transition group-active:scale-95">
        PDF
      </span>
      <span className="text-sm font-semibold tracking-tight transition group-hover:text-[var(--brand-500)]">
        lex
      </span>
    </button>
  );
}