"use client";

import { useState } from "react";
import { Ban, Check, CircleAlert, CornerDownRight, Heart, MessageSquareReply, RefreshCw, Send, Sparkles } from "lucide-react";
import { ConfidencePill } from "@/components/inbox/ai-reply-panel";
import { CommentStatusBadge, IntentBadge } from "@/components/status-badges";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { useWorkspace } from "@/lib/store/workspace";
import type { Comment } from "@/lib/types";
import { cn, formatRelativeTime } from "@/lib/utils";

function SuggestionEditor({ comment }: { comment: Comment & { suggestion: NonNullable<Comment["suggestion"]> } }) {
  const { comments } = useWorkspace();
  const notify = useToast();
  const { suggestion } = comment;
  const [body, setBody] = useState(suggestion.body);
  const [variant, setVariant] = useState(0);
  const sending = comments.sending.has(comment.id);

  const approve = async () => {
    await comments.sendReply(comment.id, body.trim(), "ai", body !== suggestion.body);
    notify("Reply posted", { tone: "ai", description: `Replied to @${comment.authorHandle}` });
  };

  const regenerate = () => {
    const next = variant + 1;
    setVariant(next);
    void comments.generate(comment, next);
  };

  if (suggestion.noReply) {
    return (
      <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-line bg-surface-2/60 px-3 py-2.5 text-xs text-fg-muted">
        <Ban className="size-3.5" />
        <span className="flex-1">Looks like spam — CreatorAI recommends not replying.</span>
        <Button size="sm" onClick={() => comments.markHandled(comment.id)}>
          <Check /> Mark handled
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-2.5 rounded-lg border border-accent/25 bg-accent/[0.05] p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 text-xs font-medium text-accent-strong">
          <Sparkles className="size-3.5" /> AI draft
        </span>
        <ConfidencePill confidence={suggestion.confidence} />
        {suggestion.needsReview && (
          <span className="flex items-center gap-1 text-[11px] text-warning">
            <CircleAlert className="size-3" /> Review before posting
          </span>
        )}
      </div>
      <Textarea rows={2} value={body} onChange={(e) => setBody(e.target.value)} aria-label="AI draft reply" className="bg-surface" />
      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={regenerate}>
          <RefreshCw /> Regenerate
        </Button>
        <Button variant="ai" size="sm" onClick={approve} loading={sending} disabled={!body.trim()}>
          {!sending && <Send />} Approve & send
        </Button>
      </div>
    </div>
  );
}

function ManualReply({ comment, onDone }: { comment: Comment; onDone: () => void }) {
  const { comments } = useWorkspace();
  const notify = useToast();
  const [body, setBody] = useState("");
  const sending = comments.sending.has(comment.id);

  const send = async () => {
    await comments.sendReply(comment.id, body.trim(), "creator");
    notify("Reply posted", { description: `Replied to @${comment.authorHandle}` });
    onDone();
  };

  return (
    <form
      className="mt-3 flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (body.trim()) void send();
      }}
    >
      <Input autoFocus value={body} onChange={(e) => setBody(e.target.value)} placeholder={`Reply to @${comment.authorHandle}…`} />
      <Button type="submit" variant="primary" loading={sending} disabled={!body.trim()}>
        Reply
      </Button>
    </form>
  );
}

export function CommentCard({ comment }: { comment: Comment }) {
  const { comments } = useWorkspace();
  const [replying, setReplying] = useState(false);
  const generating = comments.generating.has(comment.id);
  const open = comment.status === "pending" || comment.status === "suggested";

  return (
    <article className={cn("animate-fade-in rounded-xl border border-line bg-surface p-4", !open && "bg-surface/60")}>
      <div className="flex gap-3">
        <Avatar name={comment.authorHandle} hue={comment.authorHue} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-sm font-medium">@{comment.authorHandle}</p>
            <span className="text-[11px] text-fg-subtle">{formatRelativeTime(comment.createdAt)}</span>
            <span className="flex items-center gap-1 text-[11px] text-fg-subtle">
              <Heart className="size-3" /> {comment.likes}
            </span>
            <div className="ml-auto flex items-center gap-1.5">
              <IntentBadge intent={comment.intent} />
              <CommentStatusBadge status={comment.status} author={comment.reply?.author} />
            </div>
          </div>
          <p className={cn("mt-1 text-sm leading-relaxed", open ? "text-fg" : "text-fg-muted")}>{comment.body}</p>

          {comment.reply && (
            <div className="mt-3 flex gap-2 rounded-lg bg-surface-2/70 px-3 py-2">
              <CornerDownRight className="mt-0.5 size-3.5 shrink-0 text-fg-subtle" />
              <div className="min-w-0">
                <p className="text-[11px] text-fg-subtle">
                  {comment.reply.author === "ai" ? (
                    <span className="text-accent-strong">CreatorAI</span>
                  ) : (
                    "You"
                  )}{" "}
                  · {formatRelativeTime(comment.reply.createdAt)}
                </p>
                <p className="text-sm text-fg-muted">{comment.reply.body}</p>
              </div>
            </div>
          )}

          {generating && (
            <div className="mt-3 space-y-2 rounded-lg border border-accent/25 bg-accent/[0.05] p-3" role="status">
              <p className="flex items-center gap-1.5 text-xs text-accent-strong">
                <Sparkles className="size-3.5 animate-pulse" /> Drafting reply…
              </p>
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          )}

          {!generating && comment.status === "suggested" && comment.suggestion && (
            <SuggestionEditor key={comment.suggestion.id} comment={{ ...comment, suggestion: comment.suggestion }} />
          )}

          {replying && <ManualReply comment={comment} onDone={() => setReplying(false)} />}

          {open && !generating && !replying && (
            <div className="mt-3 flex flex-wrap gap-2">
              {comment.status === "pending" && (
                <Button variant="ai" size="sm" onClick={() => comments.generate(comment)}>
                  <Sparkles /> Generate AI reply
                </Button>
              )}
              <Button size="sm" onClick={() => setReplying(true)}>
                <MessageSquareReply /> Reply manually
              </Button>
              <Button variant="ghost" size="sm" onClick={() => comments.markHandled(comment.id)}>
                <Check /> Mark handled
              </Button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
