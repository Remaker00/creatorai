import { authedRoute, requireManager } from "@/lib/server/auth/route";
import { HttpError, readJsonObject } from "@/lib/server/http";
import { accountServerService, type AccountPatch } from "@/lib/server/services/account-service";

type Ctx = RouteContext<"/api/accounts/[id]">;

export const PATCH = authedRoute<Ctx>(async (request, auth, ctx) => {
  const { id } = await ctx.params;
  const body = await readJsonObject(request);
  const patch: AccountPatch = {};
  for (const key of ["syncDms", "syncComments"] as const) {
    if (key in body) {
      if (typeof body[key] !== "boolean") throw new HttpError(400, `${key} must be a boolean`, key);
      patch[key] = body[key];
    }
  }
  return Response.json(await accountServerService.update(auth.state.workspace.id, id, patch));
});

/** Disconnect. Removing the last Instagram account locks the Inbox again. */
export const DELETE = authedRoute<Ctx>(async (_request, auth, ctx) => {
  requireManager(auth);
  const { id } = await ctx.params;
  await accountServerService.disconnect(auth.state.workspace.id, id);
  return new Response(null, { status: 204 });
});
