"use client";

import { useState } from "react";
import { Activity, Bot, CircleCheck } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/shell/page-header";
import { StatCard } from "@/components/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { useWorkspace } from "@/lib/store/workspace";
import type { Automation, AutomationChannel } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { AutomationCard } from "./automation-card";
import { AutomationConfigSheet } from "./automation-config-sheet";

const sections: { channel: AutomationChannel; title: string; description: string }[] = [
  { channel: "dm", title: "Direct messages", description: "Rules that draft or send replies to Instagram DMs." },
  { channel: "comment", title: "Comments", description: "Rules for replying to comments on your posts and Reels." },
];

export function AutomationsView() {
  const { automations } = useWorkspace();
  const notify = useToast();
  const [configuringId, setConfiguringId] = useState<string | null>(null);

  const configuring = automations.items.find((a) => a.id === configuringId);
  const active = automations.items.filter((a) => a.enabled);
  const runs = automations.items.reduce((sum, a) => sum + a.runsLast7d, 0);
  const withRuns = active.filter((a) => a.runsLast7d > 0);
  const success = withRuns.length
    ? Math.round(withRuns.reduce((sum, a) => sum + a.successRate * a.runsLast7d, 0) / withRuns.reduce((s, a) => s + a.runsLast7d, 0))
    : 0;

  const toggle = (automation: Automation, enabled: boolean) => {
    void automations.update(automation.id, { enabled });
    notify(enabled ? `${automation.name} enabled` : `${automation.name} paused`, { tone: enabled ? "success" : "info" });
  };

  return (
    <PageContainer>
      <PageHeader title="Automations" description="Decide what CreatorAI handles on its own and when it should ask you first." />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          label="Active automations"
          icon={<Bot />}
          loading={!automations.loaded}
          value={`${active.length} / ${automations.items.length}`}
        />
        <StatCard label="Runs · last 7 days" icon={<Activity />} loading={!automations.loaded} value={formatNumber(runs)} />
        <StatCard
          label="Sent without edits"
          icon={<CircleCheck />}
          loading={!automations.loaded}
          value={`${success}%`}
          hint="weighted by volume"
        />
      </div>

      {sections.map((section) => (
        <section key={section.channel} className="space-y-3">
          <div>
            <h2 className="text-sm font-medium">{section.title}</h2>
            <p className="text-xs text-fg-subtle">{section.description}</p>
          </div>
          <div className="grid gap-3 xl:grid-cols-2">
            {!automations.loaded &&
              Array.from({ length: 2 }, (_, i) => <Skeleton key={i} className="h-44 rounded-card" />)}
            {automations.items
              .filter((a) => a.channel === section.channel)
              .map((automation) => (
                <AutomationCard
                  key={automation.id}
                  automation={automation}
                  onToggle={(enabled) => toggle(automation, enabled)}
                  onConfigure={() => setConfiguringId(automation.id)}
                />
              ))}
          </div>
        </section>
      ))}

      {configuring && (
        <AutomationConfigSheet
          key={configuring.id}
          automation={configuring}
          onClose={() => setConfiguringId(null)}
          onSave={async (config) => {
            await automations.update(configuring.id, { config });
            notify("Automation updated", { description: `${configuring.name} will use the new settings.` });
          }}
        />
      )}
    </PageContainer>
  );
}
