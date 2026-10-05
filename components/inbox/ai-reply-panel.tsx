"use client";

import { useState } from "react";
import { Ban, Check, ChevronDown, CircleAlert, Pencil, RefreshCw, Send, Sparkles, X } from "lucide-react";
import { toneLabels } from "@/components/automations/labels";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/field";
import type { AiDraft } from "@/lib/store/use-conversations";
import { cn } from "@/lib/utils";
import { AiGenerating } from "./ai-generating";

interface AiReplyPanelProps {
  draft: AiDraft;
  onEdit: (body: string) => void;
  onRegenerate: () => void;
  onDiscard: () => void;
  onSend: () => void;
  onResolveWithoutReply: () => void;
}

export function ConfidencePill({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100);
  const tone = pct >= 85 ? "success" : pct >= 70 ? "accent" : "warning";
  return <Badge tone={tone}>{pct}% confidence</Badge>;
}

export function AiReplyPanel({ draft, onEdit, onRegenerate, onDiscard, onSend, onResolveWithoutReply }: AiReplyPanelProps) {
  const [editing, setEditing] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);
  const { suggestion } = draft;
  const generating = draft.status === "generating";

  return (
    <div className="ai-glow animate-fade-in rounded-xl border border-accent/30 bg-gradient-to-b from-accent/[0.07] to-surface-2/40 p-4">
      {generating || !suggestion ? (
        <AiGenerating />
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-medium text-accent-strong">
              <Sparkles className="size-3.5" /> Suggested reply
            </span>
            <ConfidencePill confidence={suggestion.confidence} />
            <Badge>{toneLabels[suggestion.tone]} tone</Badge>
            {draft.edited && <Badge tone="info">Edited</Badge>}
            <div className="ml-auto flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={onRegenerate} aria-label="Regenerate reply">
                <RefreshCw /> <span className="hidden sm:inline">Regenerate</span>
              </Button>
              <Button variant="ghost" size="icon" className="size-7" onClick={onDiscard} aria-label="Discard draft">
                <X />
              </Button>
            </div>
          </div>

          {(suggestion.needsReview || suggestion.noReply) && (
            <div
              className={cn(
                "flex items-start gap-2 rounded-lg px-3 py-2 text-xs",
                suggestion.noReply ? "bg-surface-3 text-fg-muted" : "bg-warning/10 text-warning",
              )}
            >
              {suggestion.noReply ? <Ban className="mt-0.5 size-3.5 shrink-0" /> : <CircleAlert className="mt-0.5 size-3.5 shrink-0" />}
              <span>
                {suggestion.noReply
                  ? "This looks like spam. CreatorAI recommends resolving it without replying."
                  : "Review recommended before sending — see why below."}
              </span>
            </div>
          )}

          {editing ? (
            <Textarea
              autoFocus
              rows={5}
              value={draft.body}
              onChange={(e) => onEdit(e.target.value)}
              aria-label="Edit suggested reply"
              className="bg-surface"
            />
          ) : (
            <p
              className="cursor-text rounded-lg px-1 text-sm leading-relaxed whitespace-pre-line text-fg"
              onDoubleClick={() => setEditing(true)}
            >
              {draft.body}
            </p>
          )}

          <div>
            <button
              type="button"
              onClick={() => setShowReasoning((v) => !v)}
              className="flex items-center gap-1 text-xs text-fg-subtle hover:text-fg-muted"
              aria-expanded={showReasoning}
            >
              <ChevronDown className={cn("size-3.5 transition-transform", showReasoning && "rotate-180")} />
              Why this reply?
            </button>
            {showReasoning && (
              <div className="mt-2 animate-fade-in space-y-2 rounded-lg border border-line bg-surface/60 p-3 text-xs">
                <p className="text-fg-muted">{suggestion.reasoning}</p>
                <p className="text-fg-subtle">
                  Automation: <span className="text-fg-muted">{suggestion.matchedRule}</span>
                </p>
                {suggestion.appliedRules.length > 0 && (
                  <ul className="space-y-1">
                    {suggestion.appliedRules.map((rule) => (
                      <li key={rule} className="flex gap-1.5 text-fg-subtle">
                        <Check className="mt-0.5 size-3 shrink-0 text-accent-strong" />
                        {rule}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line pt-3">
            {suggestion.noReply && (
              <Button variant="secondary" size="sm" onClick={onResolveWithoutReply}>
                <Check /> Resolve without replying
              </Button>
            )}
            <Button variant="secondary" size="sm" onClick={() => setEditing((v) => !v)}>
              {editing ? <Check /> : <Pencil />}
              {editing ? "Done editing" : "Edit"}
            </Button>
            <Button variant="ai" size="sm" onClick={onSend} disabled={!draft.body.trim()}>
              <Send /> Send reply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
