import { randomBytes, timingSafeEqual } from "node:crypto";

export const OAUTH_STATE_COOKIE = "creatorai_ig_oauth_state";
export const CALLBACK_PATH = "/api/integrations/instagram/callback";

export const oauthStateCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/api/integrations/instagram",
  maxAge: 10 * 60,
} as const;

export function generateOAuthState(): string {
  return randomBytes(24).toString("base64url");
}

export function statesMatch(expected: string | undefined, received: string | null): boolean {
  if (!expected || !received) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(received);
  return a.length === b.length && timingSafeEqual(a, b);
}
