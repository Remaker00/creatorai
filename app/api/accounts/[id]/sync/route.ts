import { authedRoute } from "@/lib/server/auth/route";
import { accountServerService } from "@/lib/server/services/account-service";

export const POST = authedRoute<RouteContext<"/api/accounts/[id]/sync">>(async (_request, auth, ctx) => {
  const { id } = await ctx.params;
  return Response.json(await accountServerService.sync(auth.state.workspace.id, id));
});
