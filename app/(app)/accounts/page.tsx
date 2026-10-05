import type { Metadata } from "next";
import { AccountsView } from "@/components/accounts/accounts-view";
import { LockedFeature } from "@/components/shell/locked-feature";
import { lockReason } from "@/lib/feature-access";
import { requireAppAuth } from "@/lib/server/auth/session";

export const metadata: Metadata = { title: "Connected Accounts" };

export default async function AccountsPage() {
  const { state } = await requireAppAuth();
  const locked = lockReason(state.workspace, "accounts");
  if (locked) return <LockedFeature feature="accounts" reason={locked} />;
  return <AccountsView />;
}
