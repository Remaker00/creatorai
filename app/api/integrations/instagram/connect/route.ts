import { NextResponse, type NextRequest } from "next/server";
import { getAuth } from "@/lib/server/auth/session";
import { instagramProvider } from "@/lib/server/integrations/instagram/provider";
import {
  CALLBACK_PATH,
  generateOAuthState,
  OAUTH_STATE_COOKIE,
  oauthStateCookieOptions,
} from "@/lib/server/integrations/instagram/oauth-state";

/** Step 1 of the OAuth dance: bind a CSRF `state` to this browser, then send it to the consent screen. */
export async function GET(request: NextRequest) {
  const auth = await getAuth();
  if (!auth) return NextResponse.redirect(new URL("/login", request.url));
  if (auth.state.workspace.role === "member") return NextResponse.redirect(new URL("/onboarding?error=forbidden", request.url));

  const state = generateOAuthState();
  const redirectUri = new URL(CALLBACK_PATH, request.url).toString();
  const response = NextResponse.redirect(new URL(instagramProvider.authorizeUrl({ state, redirectUri }), request.url));
  response.cookies.set(OAUTH_STATE_COOKIE, state, oauthStateCookieOptions);
  return response;
}
