// src/lib/uploader.ts
export type UploadedFileRecord = {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  createdAt?: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") || "";

/** Základný multipart upload na backend /files/upload */
export async function uploadFile(file: File): Promise<UploadedFileRecord> {
  if (!(file instanceof File)) throw new Error("Prosím vyber PDF súbor.");
  const form = new FormData();
  form.append("file", file, file.name);

  const res = await fetch(`${API_BASE_URL}/files/upload`, {
    method: "POST",
    body: form,
    credentials: "include",
  });

  if (!res.ok) {
    const msg = await res
      .json()
      .then((j) => j?.error || j?.message)
      .catch(() => `Upload failed (${res.status})`);
    throw new Error(msg || `Upload failed (${res.status})`);
  }

  const data = await res.json();
  const rec = data?.file as UploadedFileRecord | undefined;
  if (!rec?.id) throw new Error("Upload OK, ale chýba file.id v odpovedi.");
  return rec;
}

/** Pomôcka: vráti len fileId (ak to niekde očakávaš) */
export async function uploadFileId(file: File): Promise<string> {
  const rec = await uploadFile(file);
  return rec.id;
}