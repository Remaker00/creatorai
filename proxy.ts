import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/server/auth/config";

// Marketing + auth pages. Everything else (dashboard, onboarding, inbox…) needs a session.
const PUBLIC_PATHS = new Set(["/", "/pricing", "/login", "/signup", "/debounce-demo"]);

/**
 * Optimistic check only (cookie present?) — no DB here. Pages re-validate the session via
 * `requireAppAuth()` and API routes via `authedRoute()`, which are the real security boundary.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (PUBLIC_PATHS.has(pathname) || request.cookies.has(SESSION_COOKIE)) return NextResponse.next();
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  // Everything except API routes (they answer 401 themselves), Next internals and static files.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.[\\w]+$).*)"],
};
