// src/lib/files.ts
import { API_BASE } from "@/lib/api";

/** Vráti podpisanú URL na stiahnutie konkrétneho súboru. */
export async function getDownloadUrl(id: string, token?: string) {
  const r = await fetch(`${API_BASE}/api/files/${id}/download-url`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  });
  if (!r.ok) {
    let msg = `HTTP ${r.status}`;
    try {
      const j = await r.json();
      if (j?.error) msg = j.error;
    } catch {}
    throw new Error(msg);
  }
  const j = (await r.json()) as { url: string; expiresIn?: number };
  return j.url;
}