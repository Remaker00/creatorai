import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-6 py-12 text-center", className)}>
      <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-surface-2 text-fg-subtle ring-1 ring-line [&_svg]:size-5">
        {icon}
      </div>
      <p className="text-sm font-medium text-fg">{title}</p>
      {description && <p className="mt-1 max-w-xs text-xs text-fg-subtle">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
