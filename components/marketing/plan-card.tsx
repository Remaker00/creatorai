import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Plan } from "@/lib/plans";

export function PlanCard({ plan, action, current = false }: { plan: Plan; action?: ReactNode; current?: boolean }) {
  return (
    <Card className="ai-glow flex flex-col p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-fg">{plan.name}</h2>
        {current && <Badge tone="accent">Your plan</Badge>}
      </div>
      <p className="mt-3 flex items-baseline gap-1">
        <span className="text-3xl font-semibold tracking-tight">{plan.price}</span>
        <span className="text-sm text-fg-subtle">/ month</span>
      </p>
      <p className="mt-2 text-sm text-fg-muted">{plan.tagline}</p>
      <ul className="mt-5 space-y-2.5 text-sm">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <span className="mt-0.5 flex size-4 items-center justify-center rounded-full bg-accent-soft text-accent-strong">
              <Check className="size-3" />
            </span>
            {feature}
          </li>
        ))}
      </ul>
      {action && <div className="mt-6">{action}</div>}
    </Card>
  );
}
