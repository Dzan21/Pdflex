"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type Ctx = { theme: Theme; toggle: () => void };

const ThemeCtx = createContext<Ctx>({ theme: "light", toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  const applyTheme = (next: Theme) => {
    const root = document.documentElement;
    // batch do jedného frame pre minimum layout thrashingu
    requestAnimationFrame(() => {
      root.classList.toggle("dark", next === "dark");
      root.classList.toggle("light", next === "light");
      root.setAttribute("data-theme", next);
    });
  };

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as Theme) || systemPref();
    setTheme(saved);
    applyTheme(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const systemPref = (): Theme =>
    (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);

    const anyDoc = document as any;
    if (typeof anyDoc.startViewTransition === "function") {
      anyDoc.startViewTransition(() => {
        applyTheme(next); // DOM zmena musí byť synchrónne v callbacku
      });
    } else {
      // fallback – jemný color transition v CSS
      applyTheme(next);
    }
  };

  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);