import rawData from "@/lib/mock/posts.json";
import type {
  AiSuggestion,
  Comment,
  CommentReply,
  CommentStatus,
  Intent,
  Platform,
  Post,
  PostType,
  ReplyAuthor,
} from "@/lib/types";
import { clone, minutesAgo, simulateLatency } from "./mock-runtime";

interface RawPost {
  id: string;
  platform: string;
  type: string;
  caption: string;
  postedHoursAgo: number;
  likes: number;
  views: number;
  coverHue: number;
}

interface RawComment {
  id: string;
  postId: string;
  authorHandle: string;
  authorHue: number;
  body: string;
  likes: number;
  minutesAgo: number;
  status: string;
  intent: string;
  reply?: { body: string; author: string; minutesAgo: number };
}

const data = rawData as { posts: RawPost[]; comments: RawComment[] };

let posts: Post[] | null = null;
let comments: Comment[] | null = null;

function postsDb(): Post[] {
  posts ??= data.posts.map((p) => ({
    id: p.id,
    platform: p.platform as Platform,
    type: p.type as PostType,
    caption: p.caption,
    postedAt: minutesAgo(p.postedHoursAgo * 60),
    likes: p.likes,
    views: p.views,
    coverHue: p.coverHue,
  }));
  return posts;
}

function commentsDb(): Comment[] {
  comments ??= data.comments.map((c) => {
    const post = postsDb().find((p) => p.id === c.postId);
    return {
      id: c.id,
      postId: c.postId,
      platform: post?.platform ?? "instagram",
      authorHandle: c.authorHandle,
      authorHue: c.authorHue,
      body: c.body,
      likes: c.likes,
      createdAt: minutesAgo(c.minutesAgo),
      status: c.status as CommentStatus,
      intent: c.intent as Intent,
      reply: c.reply && {
        body: c.reply.body,
        author: c.reply.author as ReplyAuthor,
        createdAt: minutesAgo(c.reply.minutesAgo),
      },
    };
  });
  return comments;
}

function findOrThrow(id: string): Comment {
  const comment = commentsDb().find((c) => c.id === id);
  if (!comment) throw new Error(`Comment ${id} not found`);
  return comment;
}

export const commentService = {
  async getPosts(): Promise<Post[]> {
    await simulateLatency();
    return clone(postsDb());
  },

  async getComments(postId?: string): Promise<Comment[]> {
    await simulateLatency();
    const all = commentsDb().filter((c) => !postId || c.postId === postId);
    return clone(all).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async saveSuggestion(commentId: string, suggestion: AiSuggestion): Promise<Comment> {
    await simulateLatency(80, 160);
    const comment = findOrThrow(commentId);
    comment.suggestion = suggestion;
    comment.status = "suggested";
    return clone(comment);
  },

  async reply(commentId: string, body: string, author: ReplyAuthor): Promise<Comment> {
    await simulateLatency(300, 600);
    const comment = findOrThrow(commentId);
    const reply: CommentReply = { body, author, createdAt: new Date().toISOString() };
    comment.reply = reply;
    comment.status = "replied";
    comment.suggestion = undefined;
    return clone(comment);
  },

  async markHandled(commentId: string): Promise<Comment> {
    await simulateLatency(120, 240);
    const comment = findOrThrow(commentId);
    comment.status = "handled";
    comment.suggestion = undefined;
    return clone(comment);
  },
};
