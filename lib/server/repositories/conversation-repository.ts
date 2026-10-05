import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/server/db/client";
import { contacts, conversations, messages } from "@/lib/server/db/schema";

export type ConversationRow = typeof conversations.$inferSelect;
export type ContactRow = typeof contacts.$inferSelect;
export type MessageRow = typeof messages.$inferSelect;

export interface ConversationRecord {
  conversation: ConversationRow;
  contact: ContactRow;
  messages: MessageRow[];
}

async function withMessages(rows: { conversation: ConversationRow; contact: ContactRow }[]): Promise<ConversationRecord[]> {
  if (rows.length === 0) return [];
  const messageRows = await db
    .select()
    .from(messages)
    .where(
      inArray(
        messages.conversationId,
        rows.map((r) => r.conversation.id),
      ),
    )
    .orderBy(asc(messages.createdAt), asc(messages.id));

  const byConversation = Map.groupBy(messageRows, (m) => m.conversationId);
  return rows.map((r) => ({ ...r, messages: byConversation.get(r.conversation.id) ?? [] }));
}

export const conversationRepository = {
  async list(workspaceId: string): Promise<ConversationRecord[]> {
    const rows = await db
      .select({ conversation: conversations, contact: contacts })
      .from(conversations)
      .innerJoin(contacts, eq(contacts.id, conversations.contactId))
      .where(eq(conversations.workspaceId, workspaceId))
      .orderBy(desc(conversations.lastMessageAt));
    return withMessages(rows);
  },

  async findById(workspaceId: string, id: string): Promise<ConversationRecord | null> {
    const rows = await db
      .select({ conversation: conversations, contact: contacts })
      .from(conversations)
      .innerJoin(contacts, eq(contacts.id, conversations.contactId))
      .where(and(eq(conversations.workspaceId, workspaceId), eq(conversations.id, id)))
      .limit(1);
    const [record] = await withMessages(rows);
    return record ?? null;
  },
};
