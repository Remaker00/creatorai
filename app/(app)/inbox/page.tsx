import type { Metadata } from "next";
import { InboxView } from "@/components/inbox/inbox-view";
import type { InboxFilter } from "@/lib/types";
import { LockedFeature } from "@/components/shell/locked-feature";
import { lockReason } from "@/lib/feature-access";
import { requireAppAuth } from "@/lib/server/auth/session";

export const metadata: Metadata = { title: "Inbox" };

const filters: InboxFilter[] = ["all", "unread", "ai_handled", "needs_review"];

function isFilter(value: unknown): value is InboxFilter {
  return typeof value === "string" && (filters as string[]).includes(value);
}

export default async function InboxPage({ searchParams }: PageProps<"/inbox">) {
  const { state } = await requireAppAuth();
  const locked = lockReason(state.workspace, "inbox");
  if (locked) return <LockedFeature feature="inbox" reason={locked} />;
  const { c, filter } = await searchParams;
  return (
    <InboxView
      initialConversationId={typeof c === "string" ? c : null}
      initialFilter={isFilter(filter) ? filter : "all"}
    />
  );
}
