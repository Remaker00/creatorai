import { createHash, randomBytes } from "node:crypto";

/** 256-bit opaque session token; only the browser cookie ever holds it. */
export function generateSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

/** What the DB stores as `sessions.id`. */
export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function isWellFormedToken(token: string): boolean {
  return /^[A-Za-z0-9_-]{43}$/.test(token);
}

export function generateId(prefix: "usr" | "ws"): string {
  return `${prefix}_${randomBytes(12).toString("base64url")}`;
}
