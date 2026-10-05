"use client";

import { useState } from "react";
import { MessageCircle, Sparkles } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Segmented } from "@/components/ui/segmented";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { useWorkspace } from "@/lib/store/workspace";
import type { Comment } from "@/lib/types";
import { formatCompact } from "@/lib/utils";
import { CommentCard } from "./comment-card";
import { PostCover, PostList } from "./post-list";

type CommentFilter = "open" | "ai" | "manual" | "all";

const filterFns: Record<CommentFilter, (c: Comment) => boolean> = {
  open: (c) => c.status === "pending" || c.status === "suggested",
  ai: (c) => c.reply?.author === "ai",
  manual: (c) => c.reply?.author === "creator" || c.status === "handled",
  all: () => true,
};

export function CommentsView() {
  const { comments } = useWorkspace();
  const notify = useToast();
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [filter, setFilter] = useState<CommentFilter>("open");

  const postId = selectedPostId ?? comments.posts[0]?.id ?? null;
  const post = comments.posts.find((p) => p.id === postId);
  const postComments = comments.items.filter((c) => c.postId === postId);
  const visible = postComments.filter(filterFns[filter]);
  const pending = postComments.filter((c) => c.status === "pending" && !comments.generating.has(c.id));

  const generateAll = async () => {
    await Promise.all(pending.map((c) => comments.generate(c)));
    notify(`${pending.length} AI drafts ready`, { tone: "ai", description: "Review and approve them below." });
  };

  const count = (key: CommentFilter) => postComments.filter(filterFns[key]).length;

  return (
    <PageContainer>
      <PageHeader title="Comments" description="Reply to comments across your Instagram posts with AI drafts you approve." />

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <Card className="p-2 lg:self-start">
          <p className="px-2.5 pt-2 pb-2.5 text-xs font-medium text-fg-muted">Recent posts</p>
          {comments.loaded ? (
            <PostList posts={comments.posts} comments={comments.items} selectedId={postId} onSelect={setSelectedPostId} />
          ) : (
            <div className="space-y-2 p-2">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          )}
        </Card>

        <div className="min-w-0 space-y-4">
          {post && (
            <Card className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <PostCover post={post} className="size-16" />
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-relaxed">{post.caption}</p>
                <p className="mt-1 text-xs text-fg-subtle">
                  <span className="capitalize">{post.type}</span> · {formatCompact(post.views)} views · {formatCompact(post.likes)} likes · {postComments.length} comments
                </p>
              </div>
              <Button variant="ai" onClick={generateAll} disabled={pending.length === 0}>
                <Sparkles /> Draft replies{pending.length > 0 && ` (${pending.length})`}
              </Button>
            </Card>
          )}

          <Segmented
            label="Filter comments"
            value={filter}
            onChange={setFilter}
            options={[
              { value: "open", label: "Needs reply", count: count("open") },
              { value: "ai", label: "AI replied", count: count("ai") },
              { value: "manual", label: "Manual / handled", count: count("manual") },
              { value: "all", label: "All", count: count("all") },
            ]}
            className="max-w-full overflow-x-auto"
          />

          <div className="space-y-3">
            {!comments.loaded &&
              Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
            {visible.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
            {comments.loaded && visible.length === 0 && (
              <Card>
                <EmptyState
                  icon={<MessageCircle />}
                  title={filter === "open" ? "All caught up on this post" : "Nothing here yet"}
                  description={filter === "open" ? "Every comment has a reply or has been handled." : undefined}
                />
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
