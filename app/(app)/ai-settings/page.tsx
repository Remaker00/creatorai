import type { Metadata } from "next";
import { AiSettingsView } from "@/components/ai-settings/ai-settings-view";
import { LockedFeature } from "@/components/shell/locked-feature";
import { lockReason } from "@/lib/feature-access";
import { requireAppAuth } from "@/lib/server/auth/session";

export const metadata: Metadata = { title: "AI Settings" };

export default async function AiSettingsPage() {
  const { state } = await requireAppAuth();
  const locked = lockReason(state.workspace, "aiSettings");
  if (locked) return <LockedFeature feature="aiSettings" reason={locked} />;
  return <AiSettingsView />;
}
