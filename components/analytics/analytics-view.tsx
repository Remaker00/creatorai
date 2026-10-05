"use client";

import { useState } from "react";
import { Bot, Clock, Gauge, MessagesSquare, Sparkles, Timer } from "lucide-react";
import { ActivityChart } from "@/components/charts/activity-chart";
import { PageContainer, PageHeader } from "@/components/shell/page-header";
import { StatCard } from "@/components/stat-card";
import { Card, CardHeader } from "@/components/ui/card";
import { Segmented } from "@/components/ui/segmented";
import { useWorkspace } from "@/lib/store/workspace";
import { formatNumber } from "@/lib/utils";
import { HourlyChart, IntentChart, ReplyMixChart } from "./charts";

type Range = "7" | "14" | "30";

function ChartSkeleton({ height }: { height: number }) {
  return <div aria-hidden className="shimmer mx-2 rounded-lg" style={{ height }} />;
}

export function AnalyticsView() {
  const { analytics, session } = useWorkspace();
  const [range, setRange] = useState<Range>("30");
  const data = analytics.data;
  const daily = data?.daily.slice(-Number(range)) ?? [];

  const received = daily.reduce((sum, d) => sum + d.messagesReceived, 0);
  const aiReplies = daily.reduce((sum, d) => sum + d.aiReplies, 0);
  const manualReplies = daily.reduce((sum, d) => sum + d.manualReplies, 0);
  const handledRate = aiReplies + manualReplies > 0 ? (aiReplies / (aiReplies + manualReplies)) * 100 : 0;
  const avgResponse = daily.length ? daily.reduce((sum, d) => sum + d.avgResponseMinutes, 0) / daily.length : 0;

  const sessionRows = [
    { label: "AI replies sent", value: session.stats.aiReplies },
    { label: "Manual replies sent", value: session.stats.manualReplies },
    { label: "AI drafts generated", value: session.stats.aiSuggestionsGenerated },
    { label: "Drafts edited before sending", value: session.stats.aiSuggestionsEdited },
    { label: "Conversations resolved", value: session.stats.resolved },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Analytics"
        description="How CreatorAI is handling your Instagram DMs and comments."
        actions={
          <Segmented
            label="Date range"
            value={range}
            onChange={setRange}
            options={[
              { value: "7", label: "7 days" },
              { value: "14", label: "14 days" },
              { value: "30", label: "30 days" },
            ]}
          />
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Messages received" icon={<MessagesSquare />} loading={!data} value={formatNumber(received)} />
        <StatCard label="AI replies" icon={<Sparkles />} highlight loading={!data} value={formatNumber(aiReplies)} />
        <StatCard label="Handled by AI" icon={<Bot />} loading={!data} value={`${handledRate.toFixed(1)}%`} hint="of all replies" />
        <StatCard label="Avg. response" icon={<Clock />} loading={!data} value={`${avgResponse.toFixed(1)}m`} />
        <StatCard label="Draft acceptance" icon={<Gauge />} loading={!data} value={data && `${data.aiAcceptanceRate}%`} hint="sent as-is" />
        <StatCard label="Time saved" icon={<Timer />} loading={!data} value={data && `${data.timeSavedHours}h`} hint="last 30 days" />
      </div>

      <Card>
        <CardHeader title="Message volume" description="Messages received, AI replies and manual replies per day" />
        <div className="px-3 pb-4">{data ? <ActivityChart data={daily} showManual height={300} /> : <ChartSkeleton height={300} />}</div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Reply mix" description="Replies sent by CreatorAI vs. by you" />
          <div className="px-3 pb-4">{data ? <ReplyMixChart data={daily} /> : <ChartSkeleton height={240} />}</div>
        </Card>
        <Card>
          <CardHeader title="What people message about" description="Detected intent, last 30 days" />
          <div className="px-3 pb-4">{data ? <IntentChart data={data.intents} /> : <ChartSkeleton height={240} />}</div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Busiest hours" description="Average incoming messages by hour of day" />
          <div className="px-3 pb-4">{data ? <HourlyChart data={data.hourly} /> : <ChartSkeleton height={200} />}</div>
        </Card>
        <Card>
          <CardHeader title="This session" description="Live, from actions you take in the app" />
          <ul className="divide-y divide-line px-5 pb-3">
            {sessionRows.map((row) => (
              <li key={row.label} className="flex items-center justify-between py-2.5 text-sm">
                <span className="text-fg-muted">{row.label}</span>
                <span className="font-medium tabular-nums">{row.value}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </PageContainer>
  );
}
