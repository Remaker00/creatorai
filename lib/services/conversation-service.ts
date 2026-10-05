import type { Conversation, Message, ReplyAuthor } from "@/lib/types";
import { createId, simulateLatency } from "./mock-runtime";

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`);
  return (await res.json()) as T;
}

export type ConversationPatch = Partial<Pick<Conversation, "status" | "unread" | "handledBy">>;

// Reads come from PostgreSQL via /api/conversations. Writes are still simulated and not
// persisted (the store applies them optimistically), until the mutation APIs exist.
export const conversationService = {
  getConversations(): Promise<Conversation[]> {
    return getJson<Conversation[]>("/api/conversations");
  },

  getConversation(id: string): Promise<Conversation> {
    return getJson<Conversation>(`/api/conversations/${encodeURIComponent(id)}`);
  },

  async sendMessage(input: {
    conversationId: string;
    body: string;
    author: ReplyAuthor;
  }): Promise<Message> {
    await simulateLatency(300, 650);
    return {
      id: createId("msg"),
      conversationId: input.conversationId,
      author: input.author,
      body: input.body,
      createdAt: new Date().toISOString(),
      delivery: "sent",
    };
  },

  async updateConversation(id: string, patch: ConversationPatch): Promise<Conversation> {
    const conversation = await getJson<Conversation>(`/api/conversations/${encodeURIComponent(id)}`);
    return { ...conversation, ...patch };
  },
};
