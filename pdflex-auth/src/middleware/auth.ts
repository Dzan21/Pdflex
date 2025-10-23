import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/** Payload, ktorý vkladáme do access tokenu */
type JwtPayload = {
  userId: string;
  email?: string;
  iat?: number;
  exp?: number;
};

/** Typ requestu obohatený o `user` + (NOVÉ) multer súbory */
export interface AuthRequest extends Request {
  user?: { id: string; email?: string; isEmailVerified?: boolean };

  // ====== NOVÉ: polia pridávané multerom, aby TS nenadával ======
  file?: Express.Multer.File;
  files?:
    | Express.Multer.File[]
    | { [fieldname: string]: Express.Multer.File[] };
  // ==============================================================
}

/** Načítaj secret z .env (v dev má fallback) */
const ACCESS_SECRET =
  process.env.JWT_ACCESS_TOKEN_SECRET || "dev_access_secret_change_me";

/**
 * Základný middleware: vyžaduje platný Bearer access token.
 * Ak je token v poriadku, nastaví `req.user = { id, email }`.
 */
export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const auth = req.headers.authorization || "";
    if (!auth.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Missing or invalid Authorization header" });
    }
    const token = auth.slice("Bearer ".length).trim();
    if (!token) return res.status(401).json({ error: "Missing token" });

    const payload = jwt.verify(token, ACCESS_SECRET) as JwtPayload;
    if (!payload?.userId) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    req.user = { id: payload.userId, email: payload.email };
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

/**
 * Voliteľný middleware: navyše kontroluje, že má používateľ verifikovaný e-mail.
 */
export function requireVerified(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!req.user.isEmailVerified) {
    return res.status(403).json({ error: "Email not verified" });
  }
  return next();
}