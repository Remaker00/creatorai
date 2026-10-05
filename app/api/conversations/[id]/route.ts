import { authedRoute, requireInstagram } from "@/lib/server/auth/route";
import { errorResponse } from "@/lib/server/http";
import { conversationServerService } from "@/lib/server/services/conversation-service";

export const GET = authedRoute<RouteContext<"/api/conversations/[id]">>(async (_request, auth, ctx) => {
  requireInstagram(auth);
  const { id } = await ctx.params;
  // Scoped by workspace: another tenant's ID is indistinguishable from a missing one.
  const conversation = await conversationServerService.get(auth.state.workspace.id, id);
  if (!conversation) return errorResponse(404, `Conversation ${id} not found`);
  return Response.json(conversation);
});
