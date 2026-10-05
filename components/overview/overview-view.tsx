"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Bot, Clock, Flag, Inbox, MessagesSquare, Sparkles } from "lucide-react";
import { ActivityChart } from "@/components/charts/activity-chart";
import { PageContainer, PageHeader } from "@/components/shell/page-header";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Segmented } from "@/components/ui/segmented";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspace } from "@/lib/store/workspace";
import { formatNumber } from "@/lib/utils";
import { ConversationRow } from "./conversation-row";

type Range = "7d" | "30d";

function ListSkeleton({ rows }: { rows: number }) {
  return (
    <div className="space-y-1 px-2 pb-2">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2.5">
          <Skeleton className="size-9 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function OverviewView() {
  const { conversations, analytics, automations, session, aiSettings } = useWorkspace();
  const [range, setRange] = useState<Range>("7d");

  const daily = analytics.data?.daily ?? [];
  const today = daily[daily.length - 1];
  const previous = daily.slice(0, -1);
  const avgResponse = previous.reduce((sum, d) => sum + d.avgResponseMinutes, 0) / Math.max(previous.length, 1);
  const responseDelta = today ? Math.round(((today.avgResponseMinutes - avgResponse) / avgResponse) * 100) : 0;

  const needsReview = conversations.items.filter((c) => c.status === "needs_review");
  const attention = conversations.items
    .filter((c) => c.status === "needs_review" || (c.status === "new" && c.unread))
    .slice(0, 5);
  const recent = conversations.items.slice(0, 6);
  const runningAutomations = automations.items.filter((a) => a.enabled);
  const firstName = aiSettings.settings?.profile.displayName.split(" ")[0];

  return (
    <PageContainer>
      <PageHeader
        title={firstName ? `Welcome back, ${firstName}` : "Welcome back"}
        description="Here's what your AI assistant handled today."
        actions={
          <ButtonLink href="/inbox" variant="primary">
            <Inbox /> Open inbox
          </ButtonLink>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Messages today"
          icon={<MessagesSquare />}
          loading={!today}
          value={today && formatNumber(today.messagesReceived)}
          trend={{ value: "+18%", positive: true }}
          hint="vs. same time yesterday"
        />
        <StatCard
          label="AI replies today"
          icon={<Sparkles />}
          highlight
          loading={!today}
          value={today && formatNumber(today.aiReplies)}
          hint={session.stats.aiReplies > 0 ? `+${session.stats.aiReplies} sent by you just now` : "auto-sent + approved"}
        />
        <StatCard
          label="Avg. response time"
          icon={<Clock />}
          loading={!today}
          value={today && `${today.avgResponseMinutes}m`}
          trend={{ value: `${responseDelta}%`, positive: responseDelta < 0 }}
          hint="vs. 30-day avg"
        />
        <StatCard
          label="Needs review"
          icon={<Flag />}
          loading={!conversations.loaded}
          value={needsReview.length}
          hint={<Link href="/inbox?filter=needs_review" className="hover:text-fg">Review now →</Link>}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3 [&>*]:min-w-0">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Activity"
            description="Incoming messages vs. replies sent by CreatorAI"
            action={
              <Segmented
                label="Date range"
                value={range}
                onChange={setRange}
                options={[
                  { value: "7d", label: "7 days" },
                  { value: "30d", label: "30 days" },
                ]}
              />
            }
          />
          <div className="px-3 pb-4">
            {analytics.data ? (
              <ActivityChart data={range === "7d" ? daily.slice(-7) : daily} />
            ) : (
              <Skeleton className="mx-2 h-[260px]" />
            )}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Needs your attention"
            description="Flagged by AI or still unanswered"
            action={attention.length > 0 && <Badge tone="warning">{attention.length}</Badge>}
          />
          {conversations.loaded ? (
            <div className="space-y-0.5 px-2 pb-2">
              {attention.map((c) => (
                <ConversationRow key={c.id} conversation={c} />
              ))}
              {attention.length === 0 && <p className="px-3 py-8 text-center text-sm text-fg-subtle">You&apos;re all caught up 🎉</p>}
            </div>
          ) : (
            <ListSkeleton rows={4} />
          )}
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3 [&>*]:min-w-0">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Recent conversations"
            action={
              <Link href="/inbox" className="flex items-center gap-1 text-xs text-fg-muted hover:text-fg">
                View all <ArrowRight className="size-3.5" />
              </Link>
            }
          />
          {conversations.loaded ? (
            <div className="space-y-0.5 px-2 pb-2">
              {recent.map((c) => (
                <ConversationRow key={c.id} conversation={c} />
              ))}
            </div>
          ) : (
            <ListSkeleton rows={5} />
          )}
        </Card>

        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="relative p-5">
              <div className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-accent/15 blur-3xl" />
              <p className="flex items-center gap-2 text-xs font-medium text-accent-strong">
                <Sparkles className="size-3.5" /> AI impact · last 30 days
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight">
                {analytics.data ? `${analytics.data.timeSavedHours}h` : "—"}
              </p>
              <p className="text-xs text-fg-subtle">estimated time saved</p>
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4">
                <div>
                  <p className="text-sm font-medium tabular-nums">{analytics.data ? `${analytics.data.aiAcceptanceRate}%` : "—"}</p>
                  <p className="text-[11px] text-fg-subtle">drafts sent as-is</p>
                </div>
                <div>
                  <p className="text-sm font-medium tabular-nums">{session.stats.aiSuggestionsGenerated}</p>
                  <p className="text-[11px] text-fg-subtle">drafts this session</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Automations"
              description={`${runningAutomations.length} of ${automations.items.length} running`}
              action={
                <Link href="/automations" className="text-xs text-fg-muted hover:text-fg">
                  Manage
                </Link>
              }
            />
            <ul className="space-y-2.5 px-5 pb-4">
              {automations.items.slice(0, 5).map((a) => (
                <li key={a.id} className="flex items-center gap-2.5 text-sm">
                  <span className={a.enabled ? "size-1.5 rounded-full bg-success" : "size-1.5 rounded-full bg-fg-subtle"} />
                  <span className="flex-1 truncate text-fg-muted">{a.name}</span>
                  <span className="flex items-center gap-1 text-xs text-fg-subtle tabular-nums">
                    <Bot className="size-3" />
                    {a.runsLast7d}
                  </span>
                </li>
              ))}
              {!automations.loaded &&
                Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-4 w-full" />)}
            </ul>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
