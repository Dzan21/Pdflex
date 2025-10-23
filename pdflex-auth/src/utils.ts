import crypto from "crypto";

export function generateRandomToken(len = 48): string {
  return crypto.randomBytes(len).toString("hex");
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}