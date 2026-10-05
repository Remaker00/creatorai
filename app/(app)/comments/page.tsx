import type { Metadata } from "next";
import { CommentsView } from "@/components/comments/comments-view";
import { LockedFeature } from "@/components/shell/locked-feature";
import { lockReason } from "@/lib/feature-access";
import { requireAppAuth } from "@/lib/server/auth/session";

export const metadata: Metadata = { title: "Comments" };

export default async function CommentsPage() {
  const { state } = await requireAppAuth();
  const locked = lockReason(state.workspace, "comments");
  if (locked) return <LockedFeature feature="comments" reason={locked} />;
  return <CommentsView />;
}
