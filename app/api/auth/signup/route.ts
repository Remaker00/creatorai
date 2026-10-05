import { publicRoute } from "@/lib/server/auth/route";
import { setSessionCookie } from "@/lib/server/auth/session";
import { parseEmail, parseName, parseNewPassword } from "@/lib/server/auth/validation";
import { readJsonObject } from "@/lib/server/http";
import { authServerService } from "@/lib/server/services/auth-service";

export const POST = publicRoute(async (request) => {
  const body = await readJsonObject(request);
  const input = { name: parseName(body, "name", "Name"), email: parseEmail(body), password: parseNewPassword(body) };
  const { state, token, expiresAt } = await authServerService.signup(input);
  await setSessionCookie(token, expiresAt);
  return Response.json(state, { status: 201 });
});
