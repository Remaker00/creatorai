import type { Metadata } from "next";
import { AutomationsView } from "@/components/automations/automations-view";
import { requireAppAuth } from "@/lib/server/auth/session";

export const metadata: Metadata = { title: "Automations" };

export default async function AutomationsPage() {
  await requireAppAuth();
  return <AutomationsView />;
}
