import { publicRoute } from "@/lib/server/auth/route";
import { setSessionCookie } from "@/lib/server/auth/session";
import { isWellFormedToken } from "@/lib/server/auth/tokens";
import { parseNewPassword } from "@/lib/server/auth/validation";
import { HttpError, readJsonObject } from "@/lib/server/http";
import { authServerService } from "@/lib/server/services/auth-service";

export const POST = publicRoute(async (request) => {
  const body = await readJsonObject(request);
  const token = typeof body.token === "string" ? body.token : "";
  if (!isWellFormedToken(token)) throw new HttpError(400, "This reset link is invalid or has expired. Request a new one.");
  const { state, token: sessionToken, expiresAt } = await authServerService.resetPassword(token, parseNewPassword(body));
  await setSessionCookie(sessionToken, expiresAt);
  return Response.json(state);
});
