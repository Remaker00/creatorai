"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { axisProps, chartColors, ChartTooltip } from "@/components/charts/chart-theme";
import { intentLabels } from "@/lib/services";
import type { Analytics, DailyMetric } from "@/lib/types";
import { formatShortDate } from "@/lib/utils";

const cursor = { fill: chartColors.cursor };

export function ReplyMixChart({ data }: { data: DailyMetric[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid stroke={chartColors.grid} vertical={false} />
        <XAxis dataKey="date" tickFormatter={formatShortDate} minTickGap={20} {...axisProps} />
        <YAxis width={48} {...axisProps} />
        <Tooltip cursor={cursor} content={(props) => <ChartTooltip {...props} formatLabel={formatShortDate} />} />
        <Bar dataKey="aiReplies" name="AI replies" stackId="replies" fill={chartColors.accent} />
        <Bar dataKey="manualReplies" name="Manual replies" stackId="replies" fill={chartColors.received} radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function IntentChart({ data }: { data: Analytics["intents"] }) {
  const rows = data.map((d) => ({ label: intentLabels[d.intent], count: d.count }));
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 12, left: 8, bottom: 0 }}>
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="label" width={112} {...axisProps} />
        <Tooltip cursor={cursor} content={(props) => <ChartTooltip {...props} />} />
        <Bar dataKey="count" name="Messages" fill={chartColors.accent} fillOpacity={0.8} radius={[0, 4, 4, 0]} barSize={14} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function formatHour(hour: number | string): string {
  const h = Number(hour);
  if (h === 0) return "12am";
  if (h === 12) return "12pm";
  return h < 12 ? `${h}am` : `${h - 12}pm`;
}

export function HourlyChart({ data }: { data: Analytics["hourly"] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid stroke={chartColors.grid} vertical={false} />
        <XAxis dataKey="hour" tickFormatter={formatHour} interval={2} {...axisProps} />
        <YAxis width={48} {...axisProps} />
        <Tooltip cursor={cursor} content={(props) => <ChartTooltip {...props} formatLabel={formatHour} />} />
        <Bar dataKey="messages" name="Avg. messages" fill={chartColors.received} radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
