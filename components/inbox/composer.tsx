"use client";

import { useState, type KeyboardEvent } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/field";

interface ComposerProps {
  recipientName: string;
  generating: boolean;
  hasDraft: boolean;
  onSend: (body: string) => void;
  onGenerate: () => void;
}

export function Composer({ recipientName, generating, hasDraft, onSend, onGenerate }: ComposerProps) {
  const [body, setBody] = useState("");

  const send = () => {
    const text = body.trim();
    if (!text) return;
    onSend(text);
    setBody("");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  };

  return (
    <div className="rounded-xl border border-line-strong bg-surface-2 focus-within:border-accent/50 focus-within:ring-2 focus-within:ring-accent/15">
      <Textarea
        rows={2}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={`Reply to ${recipientName}…`}
        aria-label="Write a reply"
        className="border-0 bg-transparent focus:ring-0"
      />
      <div className="flex items-center justify-between gap-2 px-2 pb-2">
        <Button variant={hasDraft ? "secondary" : "ai"} size="sm" onClick={onGenerate} loading={generating}>
          {!generating && <Sparkles />}
          {generating ? "Generating…" : hasDraft ? "New AI draft" : "Generate AI reply"}
        </Button>
        <div className="flex items-center gap-2">
          <span className="hidden text-[11px] text-fg-subtle sm:inline">Enter to send · Shift+Enter for new line</span>
          <Button variant="primary" size="sm" onClick={send} disabled={!body.trim()}>
            <Send /> Send
          </Button>
        </div>
      </div>
    </div>
  );
}
