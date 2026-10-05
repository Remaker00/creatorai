import type { Metadata } from "next";
import { PlanCard } from "@/components/marketing/plan-card";
import { StartPlanButton } from "@/components/marketing/start-plan-button";
import { plans } from "@/lib/plans";

export const metadata: Metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Simple pricing</h1>
        <p className="mt-3 text-fg-muted">Start free. Paid plans for teams and higher volume are on the way.</p>
      </div>
      <div className="mx-auto mt-12 grid max-w-sm gap-6">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} action={<StartPlanButton plan={plan.id} />} />
        ))}
      </div>
    </section>
  );
}
