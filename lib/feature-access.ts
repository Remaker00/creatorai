import type { AuthWorkspace } from "./types";

export type Feature = "overview" | "inbox" | "comments" | "automations" | "analytics" | "aiSettings" | "accounts";
export type LockReason = "plan" | "instagram";

// Instagram content (DMs, comments) also needs a connected account.
const needsInstagram: ReadonlySet<Feature> = new Set(["inbox", "comments"]);

/** Why a feature is locked for this workspace, or null when it's available. Pages and the sidebar share this. */
export function lockReason(
  workspace: Pick<AuthWorkspace, "plan" | "instagramConnected">,
  feature: Feature,
): LockReason | null {
  if (!workspace.plan) return "plan";
  if (needsInstagram.has(feature) && !workspace.instagramConnected) return "instagram";
  return null;
}
