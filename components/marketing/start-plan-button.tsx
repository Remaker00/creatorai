"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApiError, authService } from "@/lib/services";
import type { PlanId } from "@/lib/types";

/** Records the plan for the signed-in workspace; anonymous visitors are sent to sign up first. */
export function StartPlanButton({ plan }: { plan: PlanId }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setPending(true);
    setError(null);
    try {
      await authService.selectPlan(plan);
      router.push("/onboarding");
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        router.push("/signup");
        return;
      }
      setError(e instanceof ApiError ? e.message : "Network error — try again.");
      setPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button variant="ai" className="w-full" onClick={start} loading={pending}>
        Start Now {!pending && <ArrowRight />}
      </Button>
      {error && (
        <p role="alert" className="text-center text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
