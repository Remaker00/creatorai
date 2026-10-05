import type { Metadata } from "next";
import { AutomationsView } from "@/components/automations/automations-view";
import { LockedFeature } from "@/components/shell/locked-feature";
import { lockReason } from "@/lib/feature-access";
import { requireAppAuth } from "@/lib/server/auth/session";

export const metadata: Metadata = { title: "Automations" };

export default async function AutomationsPage() {
  const { state } = await requireAppAuth();
  const locked = lockReason(state.workspace, "automations");
  if (locked) return <LockedFeature feature="automations" reason={locked} />;
  return <AutomationsView />;
}
