import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  hint?: ReactNode;
  trend?: { value: string; positive: boolean };
  highlight?: boolean;
  loading?: boolean;
}

export function StatCard({ label, value, icon, hint, trend, highlight, loading }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-card border bg-surface p-4 transition-colors",
        highlight ? "border-accent/25 ai-glow" : "border-line",
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-fg-muted">{label}</p>
        <span className={cn("[&_svg]:size-4", highlight ? "text-accent-strong" : "text-fg-subtle")}>{icon}</span>
      </div>
      {loading ? (
        <Skeleton className="mt-3 h-7 w-20" />
      ) : (
        <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      )}
      <div className="mt-1 flex items-center gap-2 text-xs">
        {trend && <span className={trend.positive ? "text-success" : "text-danger"}>{trend.value}</span>}
        {hint && <span className="text-fg-subtle">{hint}</span>}
      </div>
    </div>
  );
}
