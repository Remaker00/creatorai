import { Sparkles } from "lucide-react";
import type { Message } from "@/lib/types";
import { cn, formatClockTime } from "@/lib/utils";

export function MessageBubble({ message }: { message: Message }) {
  const outbound = message.author !== "contact";
  const isAi = message.author === "ai";

  return (
    <div className={cn("flex animate-fade-in flex-col gap-1", outbound ? "items-end" : "items-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line sm:max-w-[70%]",
          outbound
            ? isAi
              ? "rounded-br-md bg-accent/15 text-fg ring-1 ring-accent/25"
              : "rounded-br-md bg-surface-3 text-fg ring-1 ring-line-strong"
            : "rounded-bl-md bg-surface-2 text-fg ring-1 ring-line",
          message.delivery === "sending" && "opacity-70",
        )}
      >
        {message.body}
      </div>
      <p className="flex items-center gap-1 px-1 text-[11px] text-fg-subtle">
        {isAi && (
          <span className="inline-flex items-center gap-1 text-accent-strong">
            <Sparkles className="size-3" /> Sent by AI ·
          </span>
        )}
        {message.author === "creator" && <span>You ·</span>}
        {message.delivery === "sending" ? "Sending…" : formatClockTime(message.createdAt)}
      </p>
    </div>
  );
}
