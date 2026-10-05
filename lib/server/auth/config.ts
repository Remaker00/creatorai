// No Next/Node-only imports here: shared by proxy.ts and the route handlers.

const isProduction = process.env.NODE_ENV === "production";

/** `__Host-` pins the cookie to this exact host, HTTPS and path `/`; it needs `Secure`, so dev uses a plain name. */
export const SESSION_COOKIE = isProduction ? "__Host-creatorai_session" : "creatorai_session";

export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
/** Sessions used within this window of expiry are extended by another full TTL. */
export const SESSION_RENEW_WITHIN_MS = 15 * 24 * 60 * 60 * 1000;

export const sessionCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
  path: "/",
} as const;
