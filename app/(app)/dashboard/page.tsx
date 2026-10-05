import type { Metadata } from "next";
import { OverviewView } from "@/components/overview/overview-view";
import { LockedFeature } from "@/components/shell/locked-feature";
import { lockReason } from "@/lib/feature-access";
import { requireAppAuth } from "@/lib/server/auth/session";

export const metadata: Metadata = { title: "Overview" };

export default async function OverviewPage() {
  const { state } = await requireAppAuth();
  const locked = lockReason(state.workspace, "overview");
  if (locked) return <LockedFeature feature="overview" reason={locked} />;
  return <OverviewView />;
}
