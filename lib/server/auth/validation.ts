import { HttpError } from "@/lib/server/http";

// Pragmatic check; deliverability is proven by email verification, not regex.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(body: Record<string, unknown>, field: string): string {
  const value = body[field];
  if (typeof value !== "string") throw new HttpError(400, `${field} is required`, field);
  return value;
}

export function parseEmail(body: Record<string, unknown>): string {
  const email = str(body, "email").trim().toLowerCase();
  if (email.length > 254 || !EMAIL_RE.test(email)) throw new HttpError(400, "Enter a valid email address", "email");
  return email;
}

/** Signup: enforce strength. 128 cap keeps scrypt input bounded. */
export function parseNewPassword(body: Record<string, unknown>): string {
  const password = str(body, "password");
  if (password.length < 8) throw new HttpError(400, "Password must be at least 8 characters", "password");
  if (password.length > 128) throw new HttpError(400, "Password must be at most 128 characters", "password");
  return password;
}

/** Login: only shape checks, so the error never hints at the password policy. */
export function parseLoginPassword(body: Record<string, unknown>): string {
  const password = str(body, "password");
  if (password.length === 0 || password.length > 128) throw new HttpError(401, "Invalid email or password");
  return password;
}

export function parseName(body: Record<string, unknown>, field: string, label: string): string {
  const name = str(body, field).trim().replace(/\s+/g, " ");
  if (name.length === 0) throw new HttpError(400, `${label} is required`, field);
  if (name.length > 80) throw new HttpError(400, `${label} must be at most 80 characters`, field);
  return name;
}
