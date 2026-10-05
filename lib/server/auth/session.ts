import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authServerService, type AuthContext } from "@/lib/server/services/auth-service";
import { SESSION_COOKIE, sessionCookieOptions } from "./config";
import { isWellFormedToken } from "./tokens";

export async function readSessionToken(): Promise<string | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token && isWellFormedToken(token) ? token : null;
}

/** Current request's session, validated against PostgreSQL. Deduped per request. */
export const getAuth = cache(async (): Promise<AuthContext | null> => {
  const token = await readSessionToken();
  return token ? authServerService.resolve(token) : null;
});

// Cookie writes are only allowed in Route Handlers / Server Functions.
export async function setSessionCookie(token: string, expiresAt: Date): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, token, { ...sessionCookieOptions, expires: expiresAt });
}

export async function clearSessionCookie(): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, "", { ...sessionCookieOptions, maxAge: 0 });
}

/** For dashboard pages: signed in with a plan chosen, else redirect. */
export async function requireAppAuth(): Promise<AuthContext> {
  const auth = await getAuth();
  if (!auth) redirect("/login");
  if (!auth.state.workspace.plan) redirect("/pricing");
  return auth;
}

/** For the Inbox: additionally requires a connected Instagram account. */
export async function requireInboxAuth(): Promise<AuthContext> {
  const auth = await requireAppAuth();
  if (!auth.state.workspace.instagramConnected) redirect("/onboarding");
  return auth;
}
