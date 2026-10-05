"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft, BadgeCheck, CircleCheck, Flag, Mail, MailOpen, RotateCcw } from "lucide-react";
import { PlatformIcon } from "@/components/platform-icon";
import { ConversationStatusBadge } from "@/components/status-badges";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useWorkspace } from "@/lib/store/workspace";
import type { Conversation } from "@/lib/types";
import { AiReplyPanel } from "./ai-reply-panel";
import { Composer } from "./composer";
import { MessageBubble } from "./message-bubble";

interface ConversationThreadProps {
  conversation: Conversation;
  onBack: () => void;
}

export function ConversationThread({ conversation, onBack }: ConversationThreadProps) {
  const { conversations } = useWorkspace();
  const notify = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const draft = conversations.drafts[conversation.id];
  const { id, contact, status } = conversation;
  const firstName = contact.name.split(" ")[0];

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [conversation.messages.length, draft?.status, id]);

  const generate = () => {
    void conversations.generateReply(id);
  };

  const sendAi = () => {
    if (!draft) return;
    void conversations.sendMessage(id, draft.body, "ai", draft.edited);
    notify("AI reply sent", { tone: "ai", description: `Delivered to @${contact.handle} on Instagram` });
  };

  const sendManual = (body: string) => {
    void conversations.sendMessage(id, body, "creator");
    notify("Message sent", { description: `Delivered to @${contact.handle}` });
  };

  const toggleReview = () => {
    const next = status === "needs_review" ? (conversation.handledBy ? "replied" : "new") : "needs_review";
    conversations.setStatus(id, next);
    notify(next === "needs_review" ? "Flagged for review" : "Review flag removed", { tone: "info" });
  };

  const toggleResolved = () => {
    if (status === "resolved") {
      conversations.setStatus(id, conversation.handledBy ? "replied" : "new");
      notify("Conversation reopened", { tone: "info" });
    } else {
      conversations.setStatus(id, "resolved");
      conversations.discardDraft(id);
      notify("Conversation resolved");
    }
  };

  return (
    <div className="flex h-full min-w-0 flex-col">
      <header className="flex h-16 shrink-0 items-center gap-3 border-b border-line px-4">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onBack} aria-label="Back to conversations">
          <ArrowLeft />
        </Button>
        <Avatar name={contact.name} hue={contact.avatarHue} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-semibold">{contact.name}</p>
            {contact.verified && <BadgeCheck className="size-4 shrink-0 text-info" aria-label="Verified" />}
          </div>
          <p className="flex items-center gap-1 truncate text-xs text-fg-subtle">
            <PlatformIcon platform={conversation.platform} className="size-3" />@{contact.handle}
          </p>
        </div>
        <div className="hidden sm:block">
          <ConversationStatusBadge conversation={conversation} />
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => conversations.setUnread(id, !conversation.unread)}
            aria-label={conversation.unread ? "Mark as read" : "Mark as unread"}
            title={conversation.unread ? "Mark as read" : "Mark as unread"}
          >
            {conversation.unread ? <MailOpen /> : <Mail />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleReview}
            aria-pressed={status === "needs_review"}
            aria-label="Flag for review"
            title={status === "needs_review" ? "Remove review flag" : "Flag for review"}
            className={status === "needs_review" ? "text-warning hover:text-warning" : undefined}
          >
            <Flag />
          </Button>
          <Button variant={status === "resolved" ? "secondary" : "primary"} size="sm" onClick={toggleResolved} className="ml-1">
            {status === "resolved" ? <RotateCcw /> : <CircleCheck />}
            <span className="hidden sm:inline">{status === "resolved" ? "Reopen" : "Resolve"}</span>
          </Button>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-6 sm:px-6">
        <p className="text-center text-[11px] text-fg-subtle">
          Conversation started on Instagram · {conversation.messages.length} messages
        </p>
        {conversation.messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>

      <div className="shrink-0 space-y-3 border-t border-line bg-canvas/60 p-3 sm:p-4">
        {draft && (
          <AiReplyPanel
            key={`${id}-draft`}
            draft={draft}
            onEdit={(body) => conversations.editDraft(id, body)}
            onRegenerate={generate}
            onDiscard={() => conversations.discardDraft(id)}
            onSend={sendAi}
            onResolveWithoutReply={toggleResolved}
          />
        )}
        <Composer
          key={`${id}-composer`}
          recipientName={firstName}
          generating={draft?.status === "generating"}
          hasDraft={draft?.status === "ready"}
          onSend={sendManual}
          onGenerate={generate}
        />
      </div>
    </div>
  );
}
