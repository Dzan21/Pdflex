// src/components/auth-provider.tsx
"use client";

import * as React from "react";
import { API_BASE_URL } from "@/lib/api";

export type MeUser = {
  id: string;
  email: string;
  name?: string | null;
  isEmailVerified?: boolean;
  createdAt?: string;
  charityChoice?: string | null;
  totalContributed?: number;
  contributionMonths?: number;
};

type AuthContextShape = {
  user: MeUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
};

const AuthCtx = React.createContext<AuthContextShape | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<MeUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  const getToken = () =>
    typeof window !== "undefined"
      ? localStorage.getItem("pdflex_access_token")
      : null;

  const refreshMe = React.useCallback(async () => {
    try {
      const token = getToken();
      if (!token) {
        setUser(null);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });

      if (!res.ok) {
        // skúsiť refresh token
        const r2 = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });

        if (r2.ok) {
          const j = await r2.json();
          if (j?.accessToken) {
            localStorage.setItem("pdflex_access_token", j.accessToken);
            const resMe = await fetch(`${API_BASE_URL}/api/auth/me`, {
              headers: { Authorization: `Bearer ${j.accessToken}` },
              credentials: "include",
            });
            if (resMe.ok) {
              const data = await resMe.json();
              setUser(data.user || null);
              return;
            }
          }
        }

        // ak nič nevyšlo → logout
        localStorage.removeItem("pdflex_access_token");
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data.user || null);
    } catch {
      setUser(null);
    }
  }, []);

  const login = React.useCallback(
    async (email: string, password: string) => {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data?.accessToken) {
        throw new Error(data?.error || "Prihlásenie zlyhalo");
      }

      localStorage.setItem("pdflex_access_token", data.accessToken);
      await refreshMe();
    },
    [refreshMe]
  );

  const logout = React.useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // ignoruj chyby
    } finally {
      localStorage.removeItem("pdflex_access_token");
      setUser(null);

      window.location.href = "/";
    }
  }, []);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      await refreshMe();
      setLoading(false);
    })();
  }, [refreshMe]);

  const value: AuthContextShape = React.useMemo(
    () => ({ user, loading, login, logout, refreshMe }),
    [user, loading, login, logout, refreshMe]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
  return ctx;
}