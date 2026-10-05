import type { AuthWorkspace } from "./types";

/** Where a signed-in user belongs next: pick a plan → connect Instagram → dashboard. */
export function nextStepPath(workspace: Pick<AuthWorkspace, "plan" | "instagramConnected">): string {
  if (!workspace.plan) return "/pricing";
  if (!workspace.instagramConnected) return "/onboarding";
  return "/dashboard";
}
