"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Link2, RefreshCw, Unplug, Webhook } from "lucide-react";
import { PlatformIcon, platformLabels } from "@/components/platform-icon";
import { PageContainer, PageHeader } from "@/components/shell/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonClasses } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/toast";
import { useWorkspace } from "@/lib/store/workspace";
import type { AccountPermission, ConnectedAccount } from "@/lib/types";
import { formatNumber, formatTimeAgo } from "@/lib/utils";

const permissionLabels: Record<AccountPermission, { label: string; description: string }> = {
  messages: { label: "Read & send messages", description: "Required to draft and send DM replies" },
  comments: { label: "Read & reply to comments", description: "Required for comment automations" },
  insights: { label: "View insights", description: "Used for analytics and best-time insights" },
  profile: { label: "Basic profile", description: "Your name, handle and profile photo" },
};

function AccountCard({ account }: { account: ConnectedAccount }) {
  const { accounts } = useWorkspace();
  const notify = useToast();
  const router = useRouter();
  const syncing = account.status === "syncing";
  const [disconnecting, setDisconnecting] = useState(false);

  const disconnect = async () => {
    if (!window.confirm(`Disconnect @${account.handle}? The Inbox stays locked until you reconnect.`)) return;
    setDisconnecting(true);
    try {
      await accounts.disconnect(account.id);
      notify("Account disconnected", { tone: "info", description: `@${account.handle} was removed from this workspace.` });
      router.refresh(); // re-read the session so the Inbox locks
    } catch {
      notify("Couldn't disconnect", { tone: "info", description: "Only workspace owners and admins can disconnect." });
    } finally {
      setDisconnecting(false);
    }
  };

  const sync = async () => {
    await accounts.sync(account.id);
    notify("Sync complete", { description: `@${account.handle} is up to date.` });
  };

  const toggle = (key: "syncDms" | "syncComments", value: boolean) => {
    void accounts.update(account.id, { [key]: value });
    const what = key === "syncDms" ? "Direct messages" : "Comments";
    notify(`${what} sync ${value ? "enabled" : "paused"}`, { tone: value ? "success" : "info" });
  };

  return (
    <Card>
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        <div className="relative">
          <Avatar name={account.displayName} hue={account.avatarHue} size="lg" />
          <span className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white ring-2 ring-surface">
            <PlatformIcon platform={account.platform} className="size-3" />
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold">@{account.handle}</p>
            {syncing ? (
              <Badge tone="info">
                <RefreshCw className="animate-spin" /> Syncing
              </Badge>
            ) : (
              <Badge tone="success" dot>
                Connected
              </Badge>
            )}
          </div>
          <p className="mt-0.5 text-xs text-fg-subtle">
            {platformLabels[account.platform]} Business · {formatNumber(account.followers)} followers · connected{" "}
            {formatTimeAgo(account.connectedAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-fg-subtle">Last synced {formatTimeAgo(account.lastSyncedAt)}</span>
          <Button size="sm" onClick={sync} loading={syncing}>
            {!syncing && <RefreshCw />} Sync now
          </Button>
          <Button size="sm" variant="danger" onClick={disconnect} loading={disconnecting}>
            {!disconnecting && <Unplug />} Disconnect
          </Button>
        </div>
      </div>

      <div className="grid border-t border-line sm:grid-cols-2">
        <label className="flex items-center justify-between gap-4 px-5 py-4 sm:border-r sm:border-line">
          <span>
            <span className="block text-sm font-medium">Direct messages</span>
            <span className="block text-xs text-fg-subtle">Import DMs into your inbox in real time</span>
          </span>
          <Switch checked={account.syncDms} onCheckedChange={(v) => toggle("syncDms", v)} label="Sync direct messages" />
        </label>
        <label className="flex items-center justify-between gap-4 border-t border-line px-5 py-4 sm:border-t-0">
          <span>
            <span className="block text-sm font-medium">Comments</span>
            <span className="block text-xs text-fg-subtle">Import comments from posts and Reels</span>
          </span>
          <Switch checked={account.syncComments} onCheckedChange={(v) => toggle("syncComments", v)} label="Sync comments" />
        </label>
      </div>
    </Card>
  );
}

export function AccountsView() {
  const { accounts } = useWorkspace();
  const account = accounts.items[0];

  return (
    <PageContainer>
      <PageHeader title="Connected Accounts" description="The social accounts CreatorAI reads from and replies on." />

      {account ? (
        <AccountCard account={account} />
      ) : accounts.loaded ? (
        <Card>
          <EmptyState
            icon={<Link2 />}
            title="No Instagram account connected"
            description="Connect Instagram to unlock the Inbox and let CreatorAI draft replies."
            action={
              <a href="/api/integrations/instagram/connect" className={buttonClasses({ variant: "ai" })}>
                Connect Instagram
              </a>
            }
          />
        </Card>
      ) : (
        <Skeleton className="h-48 rounded-card" />
      )}

      {account && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader title="Permissions" description="Granted when you connected Instagram" />
            <ul className="space-y-3 px-5 pb-5">
              {(Object.keys(permissionLabels) as AccountPermission[]).map((permission) => {
                const granted = account.permissions.includes(permission);
                return (
                  <li key={permission} className="flex items-start gap-3">
                    <span
                      className={
                        granted
                          ? "mt-0.5 flex size-5 items-center justify-center rounded-full bg-success/15 text-success"
                          : "mt-0.5 flex size-5 items-center justify-center rounded-full bg-surface-3 text-fg-subtle"
                      }
                    >
                      <Check className="size-3" />
                    </span>
                    <span>
                      <span className="block text-sm">{permissionLabels[permission].label}</span>
                      <span className="block text-xs text-fg-subtle">{permissionLabels[permission].description}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card>
            <CardHeader title="Real-time delivery" description="How new messages reach CreatorAI" />
            <div className="space-y-4 px-5 pb-5">
              <div className="flex items-center gap-3 rounded-lg border border-line bg-surface-2/50 p-3">
                <Webhook className="size-4 text-fg-subtle" />
                <div className="flex-1">
                  <p className="text-sm">Instagram webhooks</p>
                  <p className="text-xs text-fg-subtle">Messages, comments and mentions</p>
                </div>
                <Badge tone={account.webhook.healthy ? "success" : "danger"} dot>
                  {account.webhook.healthy ? "Healthy" : "Degraded"}
                </Badge>
              </div>
              <dl className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { label: "Delivered · 24h", value: formatNumber(account.webhook.delivered24h) },
                  { label: "Failed · 24h", value: formatNumber(account.webhook.failed24h) },
                  { label: "Median latency", value: `${(account.webhook.medianLatencyMs / 1000).toFixed(1)}s` },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg bg-surface-2/50 p-2.5">
                    <dt className="text-fg-subtle">{item.label}</dt>
                    <dd className="mt-0.5 text-sm font-medium tabular-nums">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Card>
        </div>
      )}
    </PageContainer>
  );
}
