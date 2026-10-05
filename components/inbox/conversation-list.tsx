"use client";

import { Bot, Flag, Search, SearchX } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/field";
import { Segmented } from "@/components/ui/segmented";
import { Skeleton } from "@/components/ui/skeleton";
import type { Conversation, InboxFilter } from "@/lib/types";
import { cn, formatRelativeTime } from "@/lib/utils";

interface ConversationListProps {
  conversations: Conversation[];
  counts: Record<InboxFilter, number>;
  loaded: boolean;
  selectedId: string | null;
  filter: InboxFilter;
  search: string;
  onFilterChange: (filter: InboxFilter) => void;
  onSearchChange: (search: string) => void;
  onSelect: (id: string) => void;
}

function ConversationItem({
  conversation,
  selected,
  onSelect,
}: {
  conversation: Conversation;
  selected: boolean;
  onSelect: () => void;
}) {
  const last = conversation.messages[conversation.messages.length - 1];
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={selected ? "true" : undefined}
      className={cn(
        "relative flex w-full gap-3 rounded-lg px-3 py-3 text-left transition-colors",
        selected ? "bg-surface-3" : "hover:bg-surface-2",
      )}
    >
      {selected && <span className="absolute inset-y-3 left-0 w-0.5 rounded-full bg-accent" />}
      <Avatar name={conversation.contact.name} hue={conversation.contact.avatarHue} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className={cn("flex-1 truncate text-sm", conversation.unread ? "font-semibold text-fg" : "font-medium text-fg-muted")}>
            {conversation.contact.name}
          </p>
          <span className="shrink-0 text-[11px] text-fg-subtle tabular-nums">{formatRelativeTime(conversation.lastMessageAt)}</span>
        </div>
        <p className={cn("mt-0.5 line-clamp-2 text-xs leading-relaxed", conversation.unread ? "text-fg-muted" : "text-fg-subtle")}>
          {last && last.author !== "contact" && (
            <span className="text-fg-subtle">{last.author === "ai" ? "AI: " : "You: "}</span>
          )}
          {last?.body}
        </p>
        <div className="mt-1.5 flex items-center gap-1.5">
          {conversation.status === "needs_review" && (
            <span className="inline-flex items-center gap-1 text-[11px] text-warning">
              <Flag className="size-3" /> Needs review
            </span>
          )}
          {conversation.status === "replied" && conversation.handledBy === "ai" && (
            <span className="inline-flex items-center gap-1 text-[11px] text-accent-strong">
              <Bot className="size-3" /> AI replied
            </span>
          )}
          {conversation.status === "resolved" && <span className="text-[11px] text-success">Resolved</span>}
          {conversation.unread && <span className="ml-auto size-2 rounded-full bg-accent" aria-label="Unread" />}
        </div>
      </div>
    </button>
  );
}

export function ConversationList({
  conversations,
  counts,
  loaded,
  selectedId,
  filter,
  search,
  onFilterChange,
  onSearchChange,
  onSelect,
}: ConversationListProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="space-y-3 border-b border-line p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fg-subtle" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search conversations"
            aria-label="Search conversations"
            className="pl-9"
          />
        </div>
        <Segmented
          label="Filter conversations"
          value={filter}
          onChange={onFilterChange}
          className="flex w-full overflow-x-auto [&>button]:flex-1"
          options={[
            { value: "all", label: "All" },
            { value: "unread", label: "Unread", count: counts.unread },
            { value: "ai_handled", label: "AI", count: counts.ai_handled },
            { value: "needs_review", label: "Review", count: counts.needs_review },
          ]}
        />
      </div>

      <div className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {!loaded &&
          Array.from({ length: 7 }, (_, i) => (
            <div key={i} className="flex gap-3 px-3 py-3">
              <Skeleton className="size-9 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        {loaded &&
          conversations.map((c) => (
            <ConversationItem key={c.id} conversation={c} selected={c.id === selectedId} onSelect={() => onSelect(c.id)} />
          ))}
        {loaded && conversations.length === 0 && (
          <EmptyState
            icon={<SearchX />}
            title="No conversations"
            description={search ? `Nothing matches “${search}”.` : "Nothing in this view right now."}
          />
        )}
      </div>
    </div>
  );
}
