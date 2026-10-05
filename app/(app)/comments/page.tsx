import type { Metadata } from "next";
import { CommentsView } from "@/components/comments/comments-view";
import { requireAppAuth } from "@/lib/server/auth/session";

export const metadata: Metadata = { title: "Comments" };

export default async function CommentsPage() {
  await requireAppAuth();
  return <CommentsView />;
}
