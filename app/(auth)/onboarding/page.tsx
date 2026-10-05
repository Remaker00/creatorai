import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ArrowRight, CircleCheck, Inbox } from "lucide-react";
import { FormError } from "@/components/auth/auth-card";
import { SetupSteps } from "@/components/auth/setup-steps";
import { PlanCard } from "@/components/marketing/plan-card";
import { PlatformIcon } from "@/components/platform-icon";
import { Badge } from "@/components/ui/badge";
import { buttonClasses, ButtonLink } from "@/components/ui/button";
import { plans } from "@/lib/plans";
import { getAuth } from "@/lib/server/auth/session";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Connect Instagram" };

const errors: Record<string, string> = {
  state: "That connection attempt expired or didn't match. Please try again.",
  denied: "Instagram connection was cancelled.",
  connect: "We couldn't connect that account. Check the username and try again.",
  forbidden: "Only workspace owners and admins can connect accounts.",
};

export default async function OnboardingPage({ searchParams }: PageProps<"/onboarding">) {
  const auth = await getAuth();
  if (!auth) redirect("/login");
  const { workspace } = auth.state;
  const plan = plans.find((p) => p.id === workspace.plan);
  if (!plan) redirect("/pricing");

  const { error } = await searchParams;
  const errorMessage = typeof error === "string" ? (errors[error] ?? null) : null;

  const instagram = workspace.instagramConnected ? (
    <div className="space-y-3 rounded-lg border border-success/30 bg-success/10 p-4">
      <p className="flex items-center gap-2 text-sm font-medium text-success">
        <CircleCheck className="size-4" /> Instagram connected — Inbox unlocked
      </p>
      <ButtonLink href="/inbox" variant="ai" className="w-full">
        <Inbox /> Open Inbox
      </ButtonLink>
      <ButtonLink href="/dashboard" variant="ghost" className="w-full">
        Go to dashboard
      </ButtonLink>
    </div>
  ) : (
    <div className="space-y-3 rounded-lg border border-line-strong bg-surface-2/60 p-4">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white">
          <PlatformIcon platform="instagram" className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">Connect Instagram</p>
          <p className="text-xs text-fg-subtle">Required to unlock your Inbox</p>
        </div>
        <Badge tone="accent">Free</Badge>
      </div>
      <FormError message={errorMessage} />
      {/* Full navigation: starts the OAuth redirect flow. */}
      <a href="/api/integrations/instagram/connect" className={cn(buttonClasses({ variant: "ai" }), "w-full")}>
        Connect Instagram <ArrowRight />
      </a>
    </div>
  );

  return (
    <>
      <SetupSteps current={workspace.instagramConnected ? 3 : 2} />
      <PlanCard plan={plan} current action={instagram} />
    </>
  );
}
