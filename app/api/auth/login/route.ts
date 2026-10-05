import { publicRoute } from "@/lib/server/auth/route";
import { readSessionToken, setSessionCookie } from "@/lib/server/auth/session";
import { parseEmail, parseLoginPassword } from "@/lib/server/auth/validation";
import { HttpError, readJsonObject } from "@/lib/server/http";
import { authServerService } from "@/lib/server/services/auth-service";

export const POST = publicRoute(async (request) => {
  const body = await readJsonObject(request);
  let email: string;
  try {
    email = parseEmail(body);
  } catch {
    throw new HttpError(401, "Invalid email or password");
  }
  const { state, token, expiresAt } = await authServerService.login({ email, password: parseLoginPassword(body) });

  // Rotate: never keep a pre-login session alive alongside the new one.
  const previous = await readSessionToken();
  if (previous) await authServerService.logout(previous);

  await setSessionCookie(token, expiresAt);
  return Response.json(state);
});
