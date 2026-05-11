// src/lib/auth.ts
export type User = {
  id: string;
  email: string;
  name?: string | null;
  isEmailVerified?: boolean;
  createdAt?: string;
};

const LS_KEY = "pdflex_access_token";

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LS_KEY);
}
export function setAccessToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, token);
}
export function clearAccessToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LS_KEY);
}

const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/$/, "");

// pokus o refresh – backend používa httpOnly cookie, preto credentials: "include"
export async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { accessToken?: string };
    if (data?.accessToken) {
      setAccessToken(data.accessToken);
      return data.accessToken;
    }
    return null;
  } catch {
    return null;
  }
}

export async function fetchMe(token: string): Promise<User | null> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { user?: User };
    return data.user ?? null;
  } catch {
    return null;
  }
}

export async function apiLogout() {
  try {
    await fetch(`${API_BASE}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch {}
  clearAccessToken();
}