import { NextResponse, type NextRequest } from "next/server";
import { getAuth } from "@/lib/server/auth/session";
import { instagramProvider } from "@/lib/server/integrations/instagram/provider";
import {
  CALLBACK_PATH,
  OAUTH_STATE_COOKIE,
  oauthStateCookieOptions,
  statesMatch,
} from "@/lib/server/integrations/instagram/oauth-state";
import { accountServerService } from "@/lib/server/services/account-service";

/**
 * Step 2: the provider redirects back with `code` + `state` (or `error`). The account is
 * always attached to the session's workspace — nothing in the query string can choose it.
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const back = (query: string) => {
    const response = NextResponse.redirect(new URL(`/onboarding?${query}`, request.url));
    response.cookies.set(OAUTH_STATE_COOKIE, "", { ...oauthStateCookieOptions, maxAge: 0 }); // single use
    return response;
  };

  const auth = await getAuth();
  if (!auth) return NextResponse.redirect(new URL("/login", request.url));
  if (auth.state.workspace.role === "member") return back("error=forbidden");
  if (!statesMatch(request.cookies.get(OAUTH_STATE_COOKIE)?.value, url.searchParams.get("state"))) return back("error=state");
  if (url.searchParams.get("error")) return back("error=denied");

  const code = url.searchParams.get("code");
  if (!code) return back("error=denied");
  try {
    const profile = await instagramProvider.exchangeCode({ code, redirectUri: new URL(CALLBACK_PATH, request.url).toString() });
    await accountServerService.connectInstagram(auth.state.workspace.id, profile);
  } catch (error) {
    if (!(error instanceof Error && error.message === "invalid_code")) console.error(error);
    return back("error=connect");
  }
  return back("connected=1");
}
