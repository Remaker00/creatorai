import type { Metadata } from "next";
import { OverviewView } from "@/components/overview/overview-view";
import { requireAppAuth } from "@/lib/server/auth/session";

export const metadata: Metadata = { title: "Overview" };

export default async function OverviewPage() {
  await requireAppAuth();
  return <OverviewView />;
}
