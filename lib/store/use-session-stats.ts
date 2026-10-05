"use client";

import { useCallback, useMemo, useState } from "react";
import type { ReplyAuthor, SessionStats } from "@/lib/types";

const EMPTY: SessionStats = {
  aiReplies: 0,
  manualReplies: 0,
  resolved: 0,
  aiSuggestionsGenerated: 0,
  aiSuggestionsEdited: 0,
};

export function useSessionStats() {
  const [stats, setStats] = useState<SessionStats>(EMPTY);

  const recordReply = useCallback((author: ReplyAuthor, edited = false) => {
    setStats((s) => ({
      ...s,
      aiReplies: s.aiReplies + (author === "ai" ? 1 : 0),
      manualReplies: s.manualReplies + (author === "creator" ? 1 : 0),
      aiSuggestionsEdited: s.aiSuggestionsEdited + (edited ? 1 : 0),
    }));
  }, []);

  const recordSuggestion = useCallback(() => {
    setStats((s) => ({ ...s, aiSuggestionsGenerated: s.aiSuggestionsGenerated + 1 }));
  }, []);

  const recordResolved = useCallback(() => {
    setStats((s) => ({ ...s, resolved: s.resolved + 1 }));
  }, []);

  return useMemo(
    () => ({ stats, recordReply, recordSuggestion, recordResolved }),
    [stats, recordReply, recordSuggestion, recordResolved],
  );
}

export type SessionStatsSlice = ReturnType<typeof useSessionStats>;
