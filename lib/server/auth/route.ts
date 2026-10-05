import { authServerService, type AuthContext } from "@/lib/server/services/auth-service";
import { errorResponse, HttpError, logServerError } from "@/lib/server/http";
import { getAuth, setSessionCookie, readSessionToken } from "./session";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/**
 * CSRF defence on top of SameSite=Lax: browsers label every request with Sec-Fetch-Site / Origin,
 * so state-changing calls must come from this origin. Non-browser clients send neither.
 */
function assertSameOrigin(request: Request): void {
  if (SAFE_METHODS.has(request.method)) return;
  const site = request.headers.get("sec-fetch-site");
  if (site && site !== "same-origin" && site !== "none") throw new HttpError(403, "Cross-site request blocked");
  const origin = request.headers.get("origin");
  if (origin) {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    if (new URL(origin).host !== host) throw new HttpError(403, "Cross-site request blocked");
  }
}

function toErrorResponse(error: unknown): Response {
  if (error instanceof HttpError) return errorResponse(error.status, error.message, error.field);
  logServerError("api", error);
  return errorResponse(500, "Something went wrong");
}

/** Public route: origin check + uniform error handling. */
export function publicRoute<Ctx>(handler: (request: Request, ctx: Ctx) => Promise<Response>) {
  return async (request: Request, ctx: Ctx): Promise<Response> => {
    try {
      assertSameOrigin(request);
      return await handler(request, ctx);
    } catch (error) {
      return toErrorResponse(error);
    }
  };
}

/**
 * Authenticated route. The workspace comes from the server-side session only — handlers must
 * scope every query by `auth.state.workspace.id` and never accept a workspace ID from the client.
 */
export function authedRoute<Ctx>(handler: (request: Request, auth: AuthContext, ctx: Ctx) => Promise<Response>) {
  return publicRoute<Ctx>(async (request, ctx) => {
    const auth = await getAuth();
    if (!auth) throw new HttpError(401, "Not signed in");
    const renewed = await authServerService.renewIfNeeded(auth);
    const token = renewed && (await readSessionToken());
    if (renewed && token) await setSessionCookie(token, renewed);
    return handler(request, auth, ctx);
  });
}

/** Workspace-level changes (plan, connected accounts) are limited to owners and admins. */
export function requireManager(auth: AuthContext): void {
  if (auth.state.workspace.role === "member") throw new HttpError(403, "Only workspace owners and admins can do this");
}

/** The Inbox and its APIs are locked until the workspace has connected Instagram. */
export function requireInstagram(auth: AuthContext): void {
  if (!auth.state.workspace.instagramConnected) throw new HttpError(403, "Connect Instagram to use the Inbox");
}
