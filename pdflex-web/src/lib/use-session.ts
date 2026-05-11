"use client";

import { useEffect, useState } from "react";

const API =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:4000";

const TOKEN_KEY = "pdflex_access_token";
const EVT = "session-change";

function emitSessionChange() {
  window.dispatchEvent(new Event(EVT));
}

export function setAccessToken(token: string) {
  try { localStorage.setItem(TOKEN_KEY, token); } catch {}
  emitSessionChange();
}

export function clearAccessToken() {
  try { localStorage.removeItem(TOKEN_KEY); } catch {}
  try {
    document.cookie.split(";").forEach((c) => {
      const [name] = c.split("=").map((s) => s.trim());
      if (!name) return;
      document.cookie = `${name}=; Max-Age=0; path=/`;
    });
  } catch {}
  emitSessionChange();
}

export async function logoutClient(redirect: string = "/") {
  try {
    await fetch(`${API}/api/auth/logout`, { method: "POST", credentials: "include" });
  } catch {}
  finally {
    clearAccessToken();
    window.location.href = redirect;
  }
}

export function useSession() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    const read = () => !!localStorage.getItem(TOKEN_KEY);
    setAuthed(read());
    const onChange = () => setAuthed(read());
    window.addEventListener("storage", onChange);
    window.addEventListener(EVT, onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener(EVT, onChange);
    };
  }, []);

  const login = async ({ email, password }: { email: string; password: string }) => {
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();
      if (res.ok && json?.accessToken) {
        setAccessToken(json.accessToken);
        return { success: true };
      } else {
        return { success: false, error: json?.error || "Login failed" };
      }
    } catch (e) {
      return { success: false, error: "Network error" };
    }
  };

  const register = async ({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }) => {
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const json = await res.json();
      if (res.ok && json?.accessToken) {
        setAccessToken(json.accessToken);
        return { success: true };
      } else {
        return { success: false, error: json?.error || "Registration failed" };
      }
    } catch (e) {
      return { success: false, error: "Network error" };
    }
  };

  return { authed, login, register };
}