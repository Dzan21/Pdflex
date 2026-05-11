// src/styles/fonts.ts
import { Inter } from "next/font/google";

export const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
    preload: false,
    fallback: ["system-ui", "arial"],
});