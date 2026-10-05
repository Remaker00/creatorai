import { appUrl } from "@/lib/server/app-url";
import { publicRoute } from "@/lib/server/auth/route";
import { parseEmail } from "@/lib/server/auth/validation";
import { readJsonObject } from "@/lib/server/http";
import { authServerService } from "@/lib/server/services/auth-service";

/** Same response whether or not the email has an account (no account enumeration). */
export const POST = publicRoute(async (request) => {
  const email = parseEmail(await readJsonObject(request));
  const { devResetUrl } = await authServerService.requestPasswordReset(email, appUrl(request));
  return Response.json({ ok: true, ...(devResetUrl ? { devResetUrl } : {}) });
});
