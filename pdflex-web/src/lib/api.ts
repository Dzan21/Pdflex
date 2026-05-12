// src/lib/api.ts

export const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") as string) ||
  "http://localhost:4000";

/** Alias — prefer API_BASE_URL in new code */
export const API_BASE = API_BASE_URL;

/* ============================================================= */
/* ====================== CORE HELPERS ========================= */
/* ============================================================= */

function buildUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

async function tryJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function withAuth(init?: RequestInit): RequestInit {
  const headers = new Headers(init?.headers || {});

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("pdflex_access_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  return { ...(init || {}), headers };
}

export async function api<T = any>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(buildUrl(path), {
    credentials: "include",
    ...withAuth(init),
  });

  if (!res.ok) {
    const j = await tryJson(res);
    throw new Error(
      j?.error || j?.message || `Request failed (${res.status})`
    );
  }

  return (await tryJson(res)) as T;
}

/** Alias for api() — prefer api() in new code */
export const apiJSON = api;

/* ============================================================= */
/* ======================== SAFE GET =========================== */
/* ============================================================= */

export async function safeGet<T = any>(
  path: string,
  query?: Record<string, any>
): Promise<T> {
  let url = buildUrl(path);

  if (query) {
    const qs = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => {
      if (v != null) qs.append(k, String(v));
    });

    if ([...qs.keys()].length) {
      url += "?" + qs.toString();
    }
  }

  return api<T>(url, { method: "GET" });
}

/* ============================================================= */
/* ======================== UPLOAD ============================= */
/* ============================================================= */

export type UploadedFileRecord = {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  createdAt?: string;
};

export async function uploadPdfAndGetId(
  file: File
): Promise<UploadedFileRecord> {
  if (!(file instanceof File)) {
    throw new Error("Vyber PDF súbor.");
  }

  const form = new FormData();
  form.append("file", file, file.name);

  const res = await fetch(
    buildUrl("/api/files/upload"),
    withAuth({
      method: "POST",
      body: form,
      credentials: "include",
    })
  );

  if (!res.ok) {
    const j = await tryJson(res);
    throw new Error(j?.error || `Upload failed (${res.status})`);
  }

  const data = await res.json();
  return data.file;
}

/* ============================================================= */
/* ======================== LANGUAGES ========================== */
/* ============================================================= */

export type TranslateLanguage = {
  code: string;
  name: string;
  supports_formality?: boolean;
};

export async function fetchTranslateLanguages(): Promise<{
  languages: TranslateLanguage[];
}> {
  return safeGet("/api/tools/translate/languages");
}

/* ============================================================= */
/* ======================== TRANSLATE QUEUE ==================== */
/* ============================================================= */

export type StartTranslateResponse = {
  jobId: string;
};

export type TranslateJobStatus = {
  id: string;
  status: "PENDING" | "PROCESSING" | "DONE" | "ERROR";
  resultFileId?: string | null;
  downloadUrl?: string | null;   // ✅ pridali sme toto
  errorMessage?: string | null;
};

export async function startTranslateJob(params: {
  fileId: string;
  targetLang: string;
  sourceLang?: string;
}): Promise<StartTranslateResponse> {
  return api("/api/tools/translate/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
}

export async function getTranslateJobStatus(
  jobId: string
): Promise<TranslateJobStatus> {
  return api(`/api/tools/translate/status/${jobId}`, {
    method: "GET",
  });
}

/* ============================================================= */
/* ======================== FILE DOWNLOAD ====================== */
/* ============================================================= */

export async function getFileDownloadUrl(fileId: string): Promise<{
  downloadUrl: string;
  file: {
    filename: string;
  };
}> {
  return api(`/api/files/${fileId}`, {
    method: "GET",
  });
}

/* ============================================================= */
/* ======================== DOWNLOAD =========================== */
/* ============================================================= */

export async function downloadUrlAsFile(
  url: string,
  filename: string
) {
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error("Download failed");

    const blob = await r.blob();
    const obj = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = obj;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(obj);
  } catch {
    window.open(url, "_blank");
  }
}