import { conversationRepository, type ConversationRecord } from "@/lib/server/repositories/conversation-repository";
import type { Conversation } from "@/lib/types";

function toConversation({ conversation: c, contact, messages }: ConversationRecord): Conversation {
  return {
    id: c.id,
    platform: c.platform,
    contact: {
      id: contact.id,
      name: contact.name,
      handle: contact.handle,
      followers: contact.followers,
      verified: contact.verified,
      avatarHue: contact.avatarHue,
      ...(contact.location ? { location: contact.location } : {}),
      firstSeenAt: contact.firstSeenAt.toISOString(),
    },
    messages: messages.map((m) => ({
      id: m.id,
      conversationId: m.conversationId,
      author: m.author,
      body: m.body,
      createdAt: m.createdAt.toISOString(),
      delivery: m.delivery,
    })),
    status: c.status,
    handledBy: c.handledBy,
    unread: c.unread,
    intent: c.intent,
    sentiment: c.sentiment,
    lastMessageAt: c.lastMessageAt.toISOString(),
  };
}

// workspaceId always comes from the authenticated session (see lib/server/auth/route.ts).
export const conversationServerService = {
  async list(workspaceId: string): Promise<Conversation[]> {
    const records = await conversationRepository.list(workspaceId);
    return records.map(toConversation);
  },

  async get(workspaceId: string, id: string): Promise<Conversation | null> {
    const record = await conversationRepository.findById(workspaceId, id);
    return record && toConversation(record);
  },
};
