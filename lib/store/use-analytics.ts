"use client";

import { useEffect, useMemo, useState } from "react";
import { analyticsService } from "@/lib/services";
import type { Analytics, SessionStats } from "@/lib/types";

/** Loads the analytics baseline and layers this session's actions onto today's numbers. */
export function useAnalytics(session: SessionStats) {
  const [baseline, setBaseline] = useState<Analytics | null>(null);

  useEffect(() => {
    let active = true;
    analyticsService.getAnalytics().then((data) => {
      if (active) setBaseline(data);
    });
    return () => {
      active = false;
    };
  }, []);

  const data = useMemo<Analytics | null>(() => {
    if (!baseline) return null;
    const daily = baseline.daily.map((day, index) =>
      index === baseline.daily.length - 1
        ? {
            ...day,
            aiReplies: day.aiReplies + session.aiReplies,
            manualReplies: day.manualReplies + session.manualReplies,
          }
        : day,
    );
    return { ...baseline, daily };
  }, [baseline, session.aiReplies, session.manualReplies]);

  return { data, loaded: baseline !== null };
}

export type AnalyticsSlice = ReturnType<typeof useAnalytics>;
