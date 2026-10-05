import { AppShell } from "@/components/shell/app-shell";
import { requireAppAuth } from "@/lib/server/auth/session";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { state } = await requireAppAuth();
  return <AppShell auth={state}>{children}</AppShell>;
}
