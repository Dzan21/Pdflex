// src/lib/utils/redirect.ts
"use client";

export function redirectBasedOnDevice() {
  if (typeof window === "undefined") return "/";

  const isMobile = window.innerWidth <= 768;
  return isMobile ? "/m" : "/";
}