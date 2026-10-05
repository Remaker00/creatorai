import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = ["Account", "Plan", "Instagram", "Inbox"] as const;

export function SetupSteps({ current }: { current: number }) {
  return (
    <ol className="mb-4 flex flex-wrap items-center gap-2 text-xs" aria-label="Setup progress">
      {steps.map((label, i) => (
        <li key={label} className="flex items-center gap-2" aria-current={i === current ? "step" : undefined}>
          <span
            className={cn(
              "flex size-5 items-center justify-center rounded-full text-[11px] font-medium ring-1",
              i < current && "bg-accent text-white ring-accent",
              i === current && "bg-accent-soft text-accent-strong ring-accent/40",
              i > current && "bg-surface-2 text-fg-subtle ring-line-strong",
            )}
          >
            {i < current ? <Check className="size-3" /> : i + 1}
          </span>
          <span className={i === current ? "text-fg" : "text-fg-subtle"}>{label}</span>
          {i < steps.length - 1 && <span className="h-px w-4 bg-line-strong" />}
        </li>
      ))}
    </ol>
  );
}
