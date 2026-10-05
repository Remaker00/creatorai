import { authedRoute } from "@/lib/server/auth/route";
import { accountServerService } from "@/lib/server/services/account-service";

export const GET = authedRoute(async (_request, auth) =>
  Response.json(await accountServerService.list(auth.state.workspace.id)),
);
