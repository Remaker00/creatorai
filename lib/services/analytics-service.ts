import rawAnalytics from "@/lib/mock/analytics.json";
import type { Analytics, DailyMetric, IntentMetric } from "@/lib/types";
import { clone, simulateLatency } from "./mock-runtime";

interface RawAnalytics extends Omit<Analytics, "daily" | "intents"> {
  daily: (Omit<DailyMetric, "date"> & { daysAgo: number })[];
  intents: { intent: string; count: number }[];
}

function toDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

export const analyticsService = {
  async getAnalytics(): Promise<Analytics> {
    await simulateLatency(300, 600);
    const raw = rawAnalytics as RawAnalytics;
    return clone({
      ...raw,
      daily: raw.daily.map(({ daysAgo, ...metric }) => ({ ...metric, date: toDate(daysAgo) })),
      intents: raw.intents as IntentMetric[],
    });
  },
};
