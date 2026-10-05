"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Inbox } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { useWorkspace } from "@/lib/store/workspace";
import type { Conversation, InboxFilter } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ContactPanel } from "./contact-panel";
import { ConversationList } from "./conversation-list";
import { ConversationThread } from "./conversation-thread";

const matchesFilter: Record<InboxFilter, (c: Conversation) => boolean> = {
  all: () => true,
  unread: (c) => c.unread,
  ai_handled: (c) => c.handledBy === "ai",
  needs_review: (c) => c.status === "needs_review",
};

function matchesSearch(conversation: Conversation, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    conversation.contact.name.toLowerCase().includes(q) ||
    conversation.contact.handle.toLowerCase().includes(q) ||
    conversation.messages.some((m) => m.body.toLowerCase().includes(q))
  );
}

interface InboxViewProps {
  initialConversationId: string | null;
  initialFilter: InboxFilter;
}

export function InboxView({ initialConversationId, initialFilter }: InboxViewProps) {
  const { conversations } = useWorkspace();
  const [selectedId, setSelectedId] = useState<string | null>(initialConversationId);
  const [filter, setFilter] = useState<InboxFilter>(initialFilter);
  const [search, setSearch] = useState("");
  // Conversations opened in this view stay listed even if opening them changes their filter match (e.g. unread).
  const [pinnedId, setPinnedId] = useState<string | null>(initialConversationId);

  const counts = useMemo(
    () =>
      Object.fromEntries(
        (Object.keys(matchesFilter) as InboxFilter[]).map((key) => [key, conversations.items.filter(matchesFilter[key]).length]),
      ) as Record<InboxFilter, number>,
    [conversations.items],
  );

  const visible = conversations.items.filter(
    (c) => (matchesFilter[filter](c) || c.id === pinnedId) && matchesSearch(c, search),
  );
  const selected = conversations.items.find((c) => c.id === selectedId) ?? null;

  const select = (id: string) => {
    setSelectedId(id);
    setPinnedId(id);
    const conversation = conversations.items.find((c) => c.id === id);
    if (conversation?.unread) conversations.setUnread(id, false);
    window.history.replaceState(null, "", `/inbox?c=${id}`);
  };

  const changeFilter = (next: InboxFilter) => {
    setFilter(next);
    setPinnedId(null);
  };

  // A conversation opened from a deep link is marked read once the data arrives.
  const { loaded, setUnread } = conversations;
  const deepLinkHandled = useRef(false);
  useEffect(() => {
    if (!loaded || deepLinkHandled.current || !initialConversationId) return;
    deepLinkHandled.current = true;
    if (conversations.items.some((c) => c.id === initialConversationId && c.unread)) setUnread(initialConversationId, false);
  }, [loaded, initialConversationId, setUnread, conversations.items]);

  return (
    <div className="flex h-full">
      <div
        className={cn(
          "w-full shrink-0 border-r border-line bg-surface/40 md:w-80 lg:w-[340px]",
          selected ? "hidden md:block" : "block",
        )}
      >
        <ConversationList
          conversations={visible}
          counts={counts}
          loaded={conversations.loaded}
          selectedId={selectedId}
          filter={filter}
          search={search}
          onFilterChange={changeFilter}
          onSearchChange={setSearch}
          onSelect={select}
        />
      </div>

      <div className={cn("min-w-0 flex-1", selected ? "block" : "hidden md:block")}>
        {selected ? (
          <ConversationThread conversation={selected} onBack={() => setSelectedId(null)} />
        ) : (
          <EmptyState
            className="h-full"
            icon={<Inbox />}
            title="Select a conversation"
            description="Pick a DM to read the thread and let CreatorAI draft a reply in your voice."
          />
        )}
      </div>

      {selected && (
        <aside className="hidden w-72 shrink-0 border-l border-line bg-surface/40 xl:block">
          <ContactPanel conversation={selected} />
        </aside>
      )}
    </div>
  );
}
