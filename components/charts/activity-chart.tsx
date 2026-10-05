"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DailyMetric } from "@/lib/types";
import { formatShortDate } from "@/lib/utils";
import { axisProps, chartColors, ChartTooltip } from "./chart-theme";

interface ActivityChartProps {
  data: DailyMetric[];
  showManual?: boolean;
  height?: number;
}

export function ActivityChart({ data, showManual = false, height = 260 }: ActivityChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="fill-ai" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={chartColors.accent} stopOpacity={0.35} />
            <stop offset="100%" stopColor={chartColors.accent} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="fill-received" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={chartColors.received} stopOpacity={0.18} />
            <stop offset="100%" stopColor={chartColors.received} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={chartColors.grid} vertical={false} />
        <XAxis dataKey="date" tickFormatter={formatShortDate} minTickGap={24} {...axisProps} />
        <YAxis width={48} {...axisProps} />
        <Tooltip
          cursor={{ stroke: chartColors.axis, strokeDasharray: "3 3" }}
          content={(props) => <ChartTooltip {...props} formatLabel={formatShortDate} />}
        />
        <Area
          type="monotone"
          dataKey="messagesReceived"
          name="Messages received"
          stroke={chartColors.received}
          strokeWidth={1.5}
          fill="url(#fill-received)"
        />
        <Area
          type="monotone"
          dataKey="aiReplies"
          name="AI replies"
          stroke={chartColors.accent}
          strokeWidth={2}
          fill="url(#fill-ai)"
        />
        {showManual && (
          <Area type="monotone" dataKey="manualReplies" name="Manual replies" stroke={chartColors.manual} strokeWidth={1.5} fill="none" />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}
