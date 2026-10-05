import { Clapperboard, Eye, GalleryHorizontal, Heart, ImageIcon } from "lucide-react";
import type { Comment, Post, PostType } from "@/lib/types";
import { cn, formatCompact, formatRelativeTime } from "@/lib/utils";

const typeIcon: Record<PostType, typeof ImageIcon> = {
  reel: Clapperboard,
  post: ImageIcon,
  carousel: GalleryHorizontal,
};

export function PostCover({ post, className }: { post: Post; className?: string }) {
  const Icon = typeIcon[post.type];
  return (
    <div
      className={cn("relative shrink-0 overflow-hidden rounded-lg", className)}
      style={{
        background: `radial-gradient(circle at 30% 20%, hsl(${post.coverHue} 70% 60% / 0.9), transparent 60%), linear-gradient(160deg, hsl(${post.coverHue} 45% 30%), hsl(${(post.coverHue + 50) % 360} 40% 12%))`,
      }}
    >
      <Icon className="absolute top-1.5 right-1.5 size-3.5 text-white/80" />
    </div>
  );
}

interface PostListProps {
  posts: Post[];
  comments: Comment[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function PostList({ posts, comments, selectedId, onSelect }: PostListProps) {
  return (
    <div className="space-y-1.5">
      {posts.map((post) => {
        const open = comments.filter((c) => c.postId === post.id && (c.status === "pending" || c.status === "suggested")).length;
        const selected = post.id === selectedId;
        return (
          <button
            key={post.id}
            type="button"
            onClick={() => onSelect(post.id)}
            aria-current={selected ? "true" : undefined}
            className={cn(
              "flex w-full gap-3 rounded-xl border p-2.5 text-left transition-colors",
              selected ? "border-accent/40 bg-surface-2" : "border-transparent hover:bg-surface-2/60",
            )}
          >
            <PostCover post={post} className="size-14" />
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-xs leading-relaxed text-fg">{post.caption}</p>
              <div className="mt-1.5 flex items-center gap-3 text-[11px] text-fg-subtle tabular-nums">
                <span className="flex items-center gap-1">
                  <Heart className="size-3" />
                  {formatCompact(post.likes)}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="size-3" />
                  {formatCompact(post.views)}
                </span>
                <span>{formatRelativeTime(post.postedAt)}</span>
                {open > 0 && <span className="ml-auto rounded bg-accent-soft px-1.5 text-accent-strong">{open} open</span>}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
