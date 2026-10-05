import type { Metadata } from "next";
import { AccountView } from "@/components/account/account-view";
import { requireAppAuth } from "@/lib/server/auth/session";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  const { state } = await requireAppAuth();
  return <AccountView auth={state} />;
}
