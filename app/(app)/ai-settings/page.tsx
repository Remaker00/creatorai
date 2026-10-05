import type { Metadata } from "next";
import { AiSettingsView } from "@/components/ai-settings/ai-settings-view";
import { requireAppAuth } from "@/lib/server/auth/session";

export const metadata: Metadata = { title: "AI Settings" };

export default async function AiSettingsPage() {
  await requireAppAuth();
  return <AiSettingsView />;
}
