import { Bot, CircleCheck, Flag, Sparkles, User } from "lucide-react";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { intentLabels } from "@/lib/services";
import type { CommentStatus, Conversation, Intent, ReplyAuthor } from "@/lib/types";

export function ConversationStatusBadge({ conversation }: { conversation: Pick<Conversation, "status" | "handledBy"> }) {
  switch (conversation.status) {
    case "needs_review":
      return (
        <Badge tone="warning">
          <Flag /> Needs review
        </Badge>
      );
    case "resolved":
      return (
        <Badge tone="success">
          <CircleCheck /> Resolved
        </Badge>
      );
    case "replied":
      return conversation.handledBy === "ai" ? (
        <Badge tone="accent">
          <Bot /> AI replied
        </Badge>
      ) : (
        <Badge tone="neutral">
          <User /> You replied
        </Badge>
      );
    default:
      return (
        <Badge tone="info" dot>
          New
        </Badge>
      );
  }
}

const commentStatus: Record<CommentStatus, { label: string; tone: BadgeTone }> = {
  pending: { label: "Pending", tone: "neutral" },
  suggested: { label: "AI draft ready", tone: "accent" },
  replied: { label: "Replied", tone: "success" },
  handled: { label: "Handled", tone: "neutral" },
};

export function CommentStatusBadge({ status, author }: { status: CommentStatus; author?: ReplyAuthor }) {
  if (status === "replied" && author) {
    return author === "ai" ? (
      <Badge tone="accent">
        <Sparkles /> AI reply
      </Badge>
    ) : (
      <Badge tone="success">
        <User /> Manual reply
      </Badge>
    );
  }
  const { label, tone } = commentStatus[status];
  return <Badge tone={tone}>{label}</Badge>;
}

export function IntentBadge({ intent }: { intent: Intent }) {
  return <Badge tone={intent === "complaint" ? "danger" : "neutral"}>{intentLabels[intent]}</Badge>;
}
