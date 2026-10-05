import type { Metadata } from "next";
import { InboxView } from "@/components/inbox/inbox-view";
import type { InboxFilter } from "@/lib/types";
import { requireInboxAuth } from "@/lib/server/auth/session";

export const metadata: Metadata = { title: "Inbox" };

const filters: InboxFilter[] = ["all", "unread", "ai_handled", "needs_review"];

function isFilter(value: unknown): value is InboxFilter {
  return typeof value === "string" && (filters as string[]).includes(value);
}

export default async function InboxPage({ searchParams }: PageProps<"/inbox">) {
  await requireInboxAuth();
  const { c, filter } = await searchParams;
  return (
    <InboxView
      initialConversationId={typeof c === "string" ? c : null}
      initialFilter={isFilter(filter) ? filter : "all"}
    />
  );
}
