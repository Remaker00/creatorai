"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { aiService, conversationService } from "@/lib/services";
import type {
  AiSettings,
  AiSuggestion,
  Automation,
  Conversation,
  ConversationStatus,
  Message,
  ReplyAuthor,
} from "@/lib/types";
import { omitKey } from "@/lib/utils";
import type { SessionStatsSlice } from "./use-session-stats";

export interface AiDraft {
  status: "generating" | "ready";
  suggestion: AiSuggestion | null;
  body: string;
  edited: boolean;
  variant: number;
}

interface Deps {
  settings: AiSettings | null;
  automations: Automation[];
  stats: SessionStatsSlice;
}

/** Inbound messages since the creator (or AI) last replied. */
function pendingInbound(conversation: Conversation): Message[] {
  const lastReply = conversation.messages.findLastIndex((m) => m.author !== "contact");
  const pending = conversation.messages.slice(lastReply + 1);
  return pending.length > 0 ? pending : conversation.messages.filter((m) => m.author === "contact").slice(-1);
}

export function useConversations({ settings, automations, stats }: Deps) {
  const [items, setItems] = useState<Conversation[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, AiDraft>>({});

  // Generation reads the latest settings without re-creating callbacks on every edit.
  const deps = useRef({ settings, automations });
  useEffect(() => {
    deps.current = { settings, automations };
  }, [settings, automations]);

  useEffect(() => {
    let active = true;
    conversationService
      .getConversations()
      .then((data) => {
        if (active) setItems(data);
      })
      .catch((error: unknown) => console.error("Failed to load conversations", error))
      .finally(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const patchLocal = useCallback((id: string, patch: Partial<Conversation>) => {
    setItems((list) => list.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }, []);

  const setUnread = useCallback(
    (id: string, unread: boolean) => {
      patchLocal(id, { unread });
      void conversationService.updateConversation(id, { unread });
    },
    [patchLocal],
  );

  const setStatus = useCallback(
    (id: string, status: ConversationStatus) => {
      patchLocal(id, { status });
      if (status === "resolved") stats.recordResolved();
      void conversationService.updateConversation(id, { status });
    },
    [patchLocal, stats],
  );

  const sendMessage = useCallback(
    async (id: string, body: string, author: ReplyAuthor, edited = false) => {
      const optimistic: Message = {
        id: `pending_${Date.now()}`,
        conversationId: id,
        author,
        body,
        createdAt: new Date().toISOString(),
        delivery: "sending",
      };
      setItems((list) =>
        list.map((c) =>
          c.id === id
            ? {
                ...c,
                messages: [...c.messages, optimistic],
                lastMessageAt: optimistic.createdAt,
                status: "replied",
                handledBy: author,
                unread: false,
              }
            : c,
        ),
      );
      setDrafts((d) => omitKey(d, id));
      stats.recordReply(author, edited);

      const saved = await conversationService.sendMessage({ conversationId: id, body, author });
      setItems((list) =>
        list.map((c) =>
          c.id === id ? { ...c, messages: c.messages.map((m) => (m.id === optimistic.id ? saved : m)) } : c,
        ),
      );
    },
    [stats],
  );

  const generateReply = useCallback(
    async (id: string) => {
      const conversation = items.find((c) => c.id === id);
      const { settings: currentSettings, automations: currentAutomations } = deps.current;
      if (!conversation || !currentSettings) return;

      const variant = (drafts[id]?.variant ?? -1) + 1;
      setDrafts((d) => ({
        ...d,
        [id]: { status: "generating", suggestion: d[id]?.suggestion ?? null, body: d[id]?.body ?? "", edited: false, variant },
      }));

      const suggestion = await aiService.generateReply({
        channel: "dm",
        inbound: pendingInbound(conversation).map((m) => m.body),
        recipientName: conversation.contact.name,
        intentHint: conversation.intent,
        settings: currentSettings,
        automations: currentAutomations,
        variant,
      });
      stats.recordSuggestion();
      setDrafts((d) => ({ ...d, [id]: { status: "ready", suggestion, body: suggestion.body, edited: false, variant } }));
    },
    [items, drafts, stats],
  );

  const editDraft = useCallback((id: string, body: string) => {
    setDrafts((d) => {
      const draft = d[id];
      if (!draft) return d;
      return { ...d, [id]: { ...draft, body, edited: body !== draft.suggestion?.body } };
    });
  }, []);

  const discardDraft = useCallback((id: string) => {
    setDrafts((d) => omitKey(d, id));
  }, []);

  return { items, loaded, drafts, setUnread, setStatus, sendMessage, generateReply, editDraft, discardDraft };
}

export type ConversationsSlice = ReturnType<typeof useConversations>;
