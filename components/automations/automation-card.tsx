import { Gauge, MessageCircle, MessagesSquare, Settings2, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { Automation } from "@/lib/types";
import { cn, formatTimeAgo } from "@/lib/utils";
import { delayOptions, lowConfidenceLabels, toneLabels } from "./labels";

interface AutomationCardProps {
  automation: Automation;
  onToggle: (enabled: boolean) => void;
  onConfigure: () => void;
}

export function AutomationCard({ automation, onToggle, onConfigure }: AutomationCardProps) {
  const { config } = automation;
  const ChannelIcon = automation.channel === "dm" ? MessagesSquare : MessageCircle;
  const delay = delayOptions.find((d) => d.value === config.replyDelaySeconds)?.label ?? `${config.replyDelaySeconds}s`;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-card border bg-surface p-4 transition-colors sm:p-5",
        automation.enabled ? "border-line" : "border-line/60 opacity-75",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg ring-1",
            automation.enabled ? "bg-accent-soft text-accent-strong ring-accent/25" : "bg-surface-2 text-fg-subtle ring-line",
          )}
        >
          <ChannelIcon className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-medium">{automation.name}</h3>
            {automation.enabled ? (
              <Badge tone="success" dot>
                Active
              </Badge>
            ) : (
              <Badge>Paused</Badge>
            )}
          </div>
          <p className="mt-0.5 text-xs leading-relaxed text-fg-subtle">{automation.description}</p>
        </div>
        <Switch checked={automation.enabled} onCheckedChange={onToggle} label={`Toggle ${automation.name}`} />
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-fg-muted [&_svg]:size-3.5 [&_svg]:text-fg-subtle">
        <span>{toneLabels[config.tone]} tone</span>
        <span className="flex items-center gap-1.5">
          <Gauge /> {config.confidenceThreshold}% threshold
        </span>
        <span className="flex items-center gap-1.5">
          <Timer /> {delay}
        </span>
        <span>Low confidence: {lowConfidenceLabels[config.lowConfidenceBehavior].toLowerCase()}</span>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line pt-3">
        <div className="flex gap-4 text-xs text-fg-subtle tabular-nums">
          <span>
            <span className="font-medium text-fg">{automation.runsLast7d}</span> runs · 7d
          </span>
          {automation.runsLast7d > 0 && (
            <span>
              <span className="font-medium text-fg">{automation.successRate}%</span> sent without edits
            </span>
          )}
          <span className="hidden sm:inline">Updated {formatTimeAgo(automation.updatedAt)}</span>
        </div>
        <Button size="sm" onClick={onConfigure}>
          <Settings2 /> Configure
        </Button>
      </div>
    </div>
  );
}
