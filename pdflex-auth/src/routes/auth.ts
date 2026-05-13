import express from "express";
import bcrypt from "bcryptjs";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import pino from "pino";
import prisma from "../prisma";
import { generateRandomToken, hashToken } from "../utils";
import { sendEmail } from "../email";
import type { AuthRequest } from "../middleware/auth";
import { requireAuth } from "../middleware/auth";

const logger = pino({ name: "pdflex-auth", level: process.env.LOG_LEVEL || "info" });
const router = express.Router();

// ===== ENV konštanty =====
const ACCESS_SECRET: Secret =
  (process.env.JWT_ACCESS_TOKEN_SECRET as string) || "dev_access_secret_change_me";

/**
 * pretypujeme env hodnotu na správny union typ, ktorý jsonwebtoken@9 očakáva
 */
const ACCESS_EXPIRES = (process.env.ACCESS_TOKEN_EXPIRES ?? "15m") as SignOptions["expiresIn"];
const REFRESH_DAYS = Number(process.env.JWT_REFRESH_TOKEN_EXPIRES_DAYS ?? "30");
const COOKIE_SECURE = process.env.COOKIE_SECURE === "true";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// ===== Helper: jediný legitímny výskyt jwt.sign v súbore =====
function signAccessToken(p: { userId: string; email?: string }) {
  const options: SignOptions = { expiresIn: ACCESS_EXPIRES };
  return jwt.sign(p, ACCESS_SECRET, options);
}

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body as {
      email?: string;
      password?: string;
      name?: string;
    };
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { email, passwordHash, name: name || null } });

    const raw = generateRandomToken(32);
    const tokenHash = hashToken(raw);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.emailToken.create({ data: { tokenHash, type: "verify", userId: user.id, expiresAt } });

    const verifyUrl = `${FRONTEND_URL}/verify-email?token=${raw}`;
    await sendEmail(email, "PDFlex – Verify email", `<p>Verify: <a href="${verifyUrl}">${verifyUrl}</a></p>`);

    return res.json({ ok: true, message: "Registered. Check your email." });
  } catch (err) {
    logger.error({ err }, "Request error");
    return res.status(500).json({ error: "Server error" });
  }
});

// VERIFY
router.get("/verify", async (req, res) => {
  try {
    const raw = (req.query.token as string) || "";
    if (!raw) return res.status(400).send("Missing token");

    const tokenHash = hashToken(raw);
    const rec = await prisma.emailToken.findFirst({
      where: { tokenHash, type: "verify", used: false, expiresAt: { gte: new Date() } },
    });
    if (!rec) return res.status(400).send("Invalid or expired token");

    await prisma.user.update({ where: { id: rec.userId }, data: { isEmailVerified: true } });
    await prisma.emailToken.update({ where: { id: rec.id }, data: { used: true } });

    return res.send("Email verified — you can close this page.");
  } catch (err) {
    logger.error({ err }, "Request error");
    return res.status(500).send("Server error");
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });

    const accessToken = signAccessToken({ userId: user.id, email: user.email });

    const rawRefresh = generateRandomToken(48);
    const refreshHash = hashToken(rawRefresh);
    const expiresAt = new Date(Date.now() + REFRESH_DAYS * 24 * 60 * 60 * 1000);

    await prisma.refreshToken.create({ data: { tokenHash: refreshHash, userId: user.id, expiresAt } });

    res.cookie("refreshToken", rawRefresh, {
      httpOnly: true,
      sameSite: "lax",
      secure: COOKIE_SECURE,
      path: "/",
      maxAge: REFRESH_DAYS * 24 * 60 * 60 * 1000,
    });

    return res.json({
      accessToken,
      user: { id: user.id, email: user.email, name: user.name, isEmailVerified: user.isEmailVerified },
    });
  } catch (err) {
    logger.error({ err }, "Request error");
    return res.status(500).json({ error: "Server error" });
  }
});

// REFRESH
router.post("/refresh", async (req, res) => {
  try {
    const raw = req.cookies?.refreshToken as string | undefined;
    if (!raw) return res.status(401).json({ error: "Missing refresh token" });

    const tHash = hashToken(raw);
    const rec = await prisma.refreshToken.findFirst({ where: { tokenHash: tHash, revoked: false } });
    if (!rec) return res.status(401).json({ error: "Invalid refresh token" });
    if (rec.expiresAt < new Date()) return res.status(401).json({ error: "Refresh token expired" });

    await prisma.refreshToken.update({ where: { id: rec.id }, data: { revoked: true } });

    const newRaw = generateRandomToken(48);
    const newHash = hashToken(newRaw);
    const expiresAt = new Date(Date.now() + REFRESH_DAYS * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({ data: { tokenHash: newHash, userId: rec.userId, expiresAt } });

    const user = await prisma.user.findUnique({ where: { id: rec.userId } });
    if (!user) return res.status(401).json({ error: "User not found" });

    const accessToken = signAccessToken({ userId: user.id, email: user.email });

    res.cookie("refreshToken", newRaw, {
      httpOnly: true,
      sameSite: "lax",
      secure: COOKIE_SECURE,
      path: "/",
      maxAge: REFRESH_DAYS * 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken });
  } catch (err) {
    logger.error({ err }, "Request error");
    return res.status(500).json({ error: "Server error" });
  }
});

// LOGOUT
router.post("/logout", async (req, res) => {
  try {
    const raw = req.cookies?.refreshToken as string | undefined;
    if (raw) {
      const tHash = hashToken(raw);
      await prisma.refreshToken.updateMany({ where: { tokenHash: tHash }, data: { revoked: true } });
      res.clearCookie("refreshToken", { path: "/" });
    }
    return res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "Request error");
    return res.status(500).json({ error: "Server error" });
  }
});

// FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body as { email?: string };
    if (!email) return res.status(400).json({ error: "Email required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.json({ ok: true });

    const raw = generateRandomToken(32);
    const tokenHash = hashToken(raw);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.emailToken.create({ data: { tokenHash, userId: user.id, type: "reset", expiresAt } });

    const resetUrl = `${FRONTEND_URL}/reset-password?token=${raw}`;
    await sendEmail(email, "PDFlex – Reset password", `<p>Reset: <a href="${resetUrl}">${resetUrl}</a></p>`);

    return res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "Request error");
    return res.status(500).json({ error: "Server error" });
  }
});

// RESET PASSWORD
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body as { token?: string; password?: string };
    if (!token || !password) return res.status(400).json({ error: "Token and password required" });

    const tokenHash = hashToken(token);
    const rec = await prisma.emailToken.findFirst({ where: { tokenHash, type: "reset", used: false, expiresAt: { gte: new Date() } } });
    if (!rec) return res.status(400).json({ error: "Invalid or expired token" });

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.update({ where: { id: rec.userId }, data: { passwordHash } });
    await prisma.emailToken.update({ where: { id: rec.id }, data: { used: true } });

    return res.json({ ok: true, message: "Password reset" });
  } catch (err) {
    logger.error({ err }, "Request error");
    return res.status(500).json({ error: "Server error" });
  }
});

// ME
router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true, email: true, name: true, isEmailVerified: true, createdAt: true,
        charityChoice: true, totalContributed: true, contributionMonths: true,
      },
    });
    return res.json({ user });
  } catch (err) {
    logger.error({ err }, "Request error");
    return res.status(500).json({ error: "Server error" });
  }
});

// PATCH /me/charity — update charity choice
const VALID_CHARITIES = ["ocean-cleanup", "tree-nation", "water-org", "food-banks"] as const;

router.patch("/me/charity", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { charityChoice } = req.body as { charityChoice?: string };
    if (!charityChoice || !(VALID_CHARITIES as readonly string[]).includes(charityChoice)) {
      return res.status(400).json({ error: "Invalid charityChoice. Accepted: " + VALID_CHARITIES.join(", ") });
    }
    const updated = await prisma.user.update({
      where: { id: req.user!.id },
      data: { charityChoice },
      select: { id: true, charityChoice: true, totalContributed: true, contributionMonths: true },
    });
    return res.json({ user: updated });
  } catch (err) {
    logger.error({ err }, "Request error");
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;