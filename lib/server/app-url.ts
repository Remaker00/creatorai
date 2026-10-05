/**
 * Base URL for links we email. Never derived from request headers in production: a spoofed
 * Host header would otherwise put a valid reset token in a link to an attacker's domain.
 */
export function appUrl(request: Request): string {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/+$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.NODE_ENV === "production") throw new Error("APP_URL is not set");
  return new URL(request.url).origin;
}
