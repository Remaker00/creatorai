"use client";

import type { TooltipContentProps } from "recharts";

// CSS variables so charts follow the light/dark theme (see app/globals.css).
export const chartColors = {
  accent: "var(--color-accent)",
  received: "var(--chart-received)",
  manual: "var(--color-success)",
  grid: "var(--chart-grid)",
  axis: "var(--color-fg-subtle)",
  cursor: "var(--chart-cursor)",
};

export const axisProps = {
  stroke: chartColors.axis,
  tickLine: false,
  axisLine: false,
  fontSize: 11,
} as const;

type TooltipProps = TooltipContentProps & {
  formatLabel?: (label: string) => string;
};

export function ChartTooltip({ active, payload, label, formatLabel }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const heading = formatLabel ? formatLabel(String(label ?? "")) : String(label ?? "");
  return (
    <div className="min-w-36 rounded-lg border border-line-strong bg-surface-2/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
      <p className="mb-1.5 font-medium text-fg">{heading}</p>
      <div className="space-y-1">
        {payload.map((entry) => (
          <div key={String(entry.dataKey)} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-fg-muted">
              <span className="size-2 rounded-full" style={{ background: entry.color }} />
              {entry.name}
            </span>
            <span className="font-medium text-fg tabular-nums">{Number(entry.value).toLocaleString("en")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
