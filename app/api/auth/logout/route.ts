import { publicRoute } from "@/lib/server/auth/route";
import { clearSessionCookie, readSessionToken } from "@/lib/server/auth/session";
import { authServerService } from "@/lib/server/services/auth-service";

// Public so a stale/expired cookie can always be cleared.
export const POST = publicRoute(async () => {
  const token = await readSessionToken();
  if (token) await authServerService.logout(token);
  await clearSessionCookie();
  return new Response(null, { status: 204 });
});
