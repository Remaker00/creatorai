"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, Pencil, Send, Sparkles } from "lucide-react";
import { PlatformIcon } from "@/components/platform-icon";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const INCOMING = "Hi! We'd love to send you our new camera bag for a review. Are you open to collabs?";
const REPLY = "Thanks Jordan! I'm open to it. Could you share the brief and timeline? I'll get back to you this week.";

/**
 * Phases: 0 empty → 1 message arrives → 2 intent detected → 3 AI drafting → 4 typing reply
 * → 5 confidence + actions → 6 sent. Loops; reduced-motion users see the final frame.
 */
export function AnimatedInboxPreview() {
  const [phase, setPhase] = useState(0);
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    const timers: number[] = [];
    let typer: number | undefined;
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      at(0, () => {
        setPhase(6);
        setTyped(REPLY.length);
      });
    } else {
      const step = 28;
      const typeMs = Math.ceil(REPLY.length / 2) * step;
      const run = () => {
        setPhase(0);
        setTyped(0);
        at(500, () => setPhase(1));
        at(1500, () => setPhase(2));
        at(2300, () => setPhase(3));
        at(3500, () => {
          setPhase(4);
          let n = 0;
          typer = window.setInterval(() => {
            n += 2;
            setTyped(Math.min(n, REPLY.length));
            if (n >= REPLY.length) window.clearInterval(typer);
          }, step);
        });
        at(3500 + typeMs + 400, () => setPhase(5));
        at(3500 + typeMs + 1800, () => setPhase(6));
        at(3500 + typeMs + 4800, run);
      };
      run();
    }

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      if (typer) window.clearInterval(typer);
    };
  }, []);

  return (
    <div className="relative" aria-label="Animated example: CreatorAI drafting a reply to an Instagram DM" role="img">
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_30%_20%,var(--color-accent-soft),transparent_70%)]"
      />
      <Card className="ai-glow animate-float overflow-hidden text-left" aria-hidden>
        <div className="flex items-center gap-2.5 border-b border-line px-4 py-3">
          <Avatar name="Jordan Lee" hue={24} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium">Jordan Lee</p>
            <p className="flex items-center gap-1 text-[11px] text-fg-subtle">
              <PlatformIcon platform="instagram" className="size-3" /> Direct message
            </p>
          </div>
          {phase === 1 && (
            <span className="flex animate-fade-in items-center gap-1 text-[11px] text-fg-subtle">
              <Loader2 className="size-3 animate-spin" /> Detecting intent
            </span>
          )}
          {phase >= 2 && (
            <span className="animate-pop-in">
              <Badge tone="accent">Collaboration</Badge>
            </span>
          )}
        </div>

        <div className="flex min-h-[248px] flex-col gap-3 p-4 text-sm">
          {phase >= 1 && (
            <p className="max-w-[85%] animate-pop-in rounded-2xl rounded-bl-md bg-surface-3 px-3 py-2">{INCOMING}</p>
          )}

          {phase === 3 && (
            <div className="ml-auto flex animate-pop-in items-center gap-2 rounded-2xl rounded-br-md border border-accent/30 bg-accent-soft px-3 py-2 text-[11px] font-medium text-accent-strong">
              <Sparkles className="size-3" /> Drafting in your voice
              <span className="flex gap-0.5">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="size-1 animate-bounce rounded-full bg-accent-strong"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </span>
            </div>
          )}

          {phase >= 4 && (
            <div
              className={cn(
                "ml-auto max-w-[85%] animate-pop-in rounded-2xl rounded-br-md border px-3 py-2 transition-colors duration-500",
                phase >= 6 ? "border-accent bg-accent text-white" : "border-accent/30 bg-accent-soft",
              )}
            >
              <p
                className={cn(
                  "mb-1 flex items-center gap-1 text-[11px] font-medium",
                  phase >= 6 ? "text-white/85" : "text-accent-strong",
                )}
              >
                <Sparkles className="size-3" /> AI draft
                {phase >= 5 && <span className="animate-fade-in">· 94% confident</span>}
              </p>
              {REPLY.slice(0, typed)}
              {phase === 4 && <span className="ml-0.5 inline-block h-3.5 w-px animate-caret bg-current align-middle" />}
            </div>
          )}

          <div className="mt-auto flex h-8 items-center justify-end gap-2">
            {phase === 5 && (
              <>
                <span className="flex h-7 animate-fade-in items-center gap-1.5 rounded-md px-2.5 text-xs text-fg-muted">
                  <Pencil className="size-3" /> Edit
                </span>
                <span className="flex h-7 animate-pop-in items-center gap-1.5 rounded-md bg-accent px-2.5 text-xs font-medium text-white ring-4 ring-accent/20">
                  <Send className="size-3" /> Approve &amp; send
                </span>
              </>
            )}
            {phase >= 6 && (
              <span className="flex animate-pop-in items-center gap-1.5 text-xs font-medium text-success">
                <Check className="size-3.5" /> Sent · replied in seconds
              </span>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
