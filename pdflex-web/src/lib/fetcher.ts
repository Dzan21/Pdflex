// pdflex-web/src/lib/fetcher.ts
const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type FetchOptions = RequestInit & { auth?: string | null };

export async function apiFetch<T>(
  path: string,
  opts: FetchOptions = {}
): Promise<T> {
  const headers = new Headers(opts.headers);
  headers.set("Content-Type", "application/json");
  if (opts.auth) headers.set("Authorization", `Bearer ${opts.auth}`);

  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers,
    credentials: "include", // kvôli refresh cookie
    cache: "no-store",
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const data = (await res.json()) as any;
      if (data?.error) msg = data.error;
    } catch {}
    throw new Error(msg);
  }
  return (await res.json()) as T;
}