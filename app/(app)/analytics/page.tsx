import type { Metadata } from "next";
import { AnalyticsView } from "@/components/analytics/analytics-view";
import { LockedFeature } from "@/components/shell/locked-feature";
import { lockReason } from "@/lib/feature-access";
import { requireAppAuth } from "@/lib/server/auth/session";

export const metadata: Metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
  const { state } = await requireAppAuth();
  const locked = lockReason(state.workspace, "analytics");
  if (locked) return <LockedFeature feature="analytics" reason={locked} />;
  return <AnalyticsView />;
}
