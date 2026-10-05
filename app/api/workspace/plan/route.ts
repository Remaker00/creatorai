import { planIds } from "@/lib/plans";
import { authedRoute, requireManager } from "@/lib/server/auth/route";
import { HttpError, readJsonObject } from "@/lib/server/http";
import { authServerService } from "@/lib/server/services/auth-service";
import type { PlanId } from "@/lib/types";

/** Records the chosen plan on the session's workspace. No billing. */
export const POST = authedRoute(async (request, auth) => {
  requireManager(auth);
  const { plan } = await readJsonObject(request);
  if (typeof plan !== "string" || !planIds.includes(plan as PlanId)) throw new HttpError(400, "Unknown plan", "plan");
  return Response.json(await authServerService.selectPlan(auth, plan as PlanId));
});
