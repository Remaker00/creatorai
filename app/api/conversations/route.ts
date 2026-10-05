import { authedRoute, requireInstagram } from "@/lib/server/auth/route";
import { conversationServerService } from "@/lib/server/services/conversation-service";

export const GET = authedRoute(async (_request, auth) => {
  requireInstagram(auth);
  const conversations = await conversationServerService.list(auth.state.workspace.id);
  return Response.json(conversations);
});
