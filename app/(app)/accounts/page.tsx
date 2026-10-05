import type { Metadata } from "next";
import { AccountsView } from "@/components/accounts/accounts-view";
import { requireAppAuth } from "@/lib/server/auth/session";

export const metadata: Metadata = { title: "Connected Accounts" };

export default async function AccountsPage() {
  await requireAppAuth();
  return <AccountsView />;
}
