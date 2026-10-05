import Link from "next/link";
import { ConversationStatusBadge } from "@/components/status-badges";
import { Avatar } from "@/components/ui/avatar";
import type { Conversation } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";

export function ConversationRow({ conversation }: { conversation: Conversation }) {
  const last = conversation.messages[conversation.messages.length - 1];
  return (
    <Link
      href={`/inbox?c=${conversation.id}`}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-surface-2"
    >
      <div className="relative">
        <Avatar name={conversation.contact.name} hue={conversation.contact.avatarHue} />
        {conversation.unread && <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full border-2 border-surface bg-accent" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium">{conversation.contact.name}</p>
          <span className="truncate text-xs text-fg-subtle">@{conversation.contact.handle}</span>
        </div>
        <p className="truncate text-xs text-fg-muted">
          {last?.author !== "contact" && <span className="text-fg-subtle">{last?.author === "ai" ? "AI: " : "You: "}</span>}
          {last?.body}
        </p>
      </div>
      <div className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
        <span className="text-[11px] text-fg-subtle tabular-nums">{formatRelativeTime(conversation.lastMessageAt)}</span>
        <ConversationStatusBadge conversation={conversation} />
      </div>
    </Link>
  );
}
