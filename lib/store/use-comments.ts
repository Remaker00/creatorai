"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { aiService, commentService } from "@/lib/services";
import type { AiSettings, Automation, Comment, Post, ReplyAuthor } from "@/lib/types";
import type { SessionStatsSlice } from "./use-session-stats";

interface Deps {
  settings: AiSettings | null;
  automations: Automation[];
  stats: SessionStatsSlice;
}

export function useComments({ settings, automations, stats }: Deps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [items, setItems] = useState<Comment[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [generating, setGenerating] = useState<ReadonlySet<string>>(new Set());
  const [sending, setSending] = useState<ReadonlySet<string>>(new Set());

  const deps = useRef({ settings, automations });
  useEffect(() => {
    deps.current = { settings, automations };
  }, [settings, automations]);

  useEffect(() => {
    let active = true;
    Promise.all([commentService.getPosts(), commentService.getComments()]).then(([p, c]) => {
      if (!active) return;
      setPosts(p);
      setItems(c);
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const replace = useCallback((updated: Comment) => {
    setItems((list) => list.map((c) => (c.id === updated.id ? updated : c)));
  }, []);

  const toggle = (setter: typeof setGenerating, id: string, on: boolean) =>
    setter((current) => {
      const next = new Set(current);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });

  const generate = useCallback(
    async (comment: Comment, variant = 0) => {
      const { settings: currentSettings, automations: currentAutomations } = deps.current;
      if (!currentSettings) return;
      toggle(setGenerating, comment.id, true);
      try {
        const suggestion = await aiService.generateReply({
          channel: "comment",
          inbound: [comment.body],
          recipientName: comment.authorHandle,
          intentHint: comment.intent,
          settings: currentSettings,
          automations: currentAutomations,
          variant,
        });
        stats.recordSuggestion();
        replace(await commentService.saveSuggestion(comment.id, suggestion));
      } finally {
        toggle(setGenerating, comment.id, false);
      }
    },
    [replace, stats],
  );

  const sendReply = useCallback(
    async (commentId: string, body: string, author: ReplyAuthor, edited = false) => {
      toggle(setSending, commentId, true);
      try {
        replace(await commentService.reply(commentId, body, author));
        stats.recordReply(author, edited);
      } finally {
        toggle(setSending, commentId, false);
      }
    },
    [replace, stats],
  );

  const markHandled = useCallback(
    async (commentId: string) => {
      setItems((list) => list.map((c) => (c.id === commentId ? { ...c, status: "handled", suggestion: undefined } : c)));
      replace(await commentService.markHandled(commentId));
    },
    [replace],
  );

  return { posts, items, loaded, generating, sending, generate, sendReply, markHandled };
}

export type CommentsSlice = ReturnType<typeof useComments>;
