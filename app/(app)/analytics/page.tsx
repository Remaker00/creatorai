import type { Metadata } from "next";
import { AnalyticsView } from "@/components/analytics/analytics-view";
import { requireAppAuth } from "@/lib/server/auth/session";

export const metadata: Metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
  await requireAppAuth();
  return <AnalyticsView />;
}
