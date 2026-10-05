import rawAutomations from "@/lib/mock/automations.json";
import type { Automation, AutomationChannel, AutomationConfig, Intent, Platform } from "@/lib/types";
import { clone, minutesAgo, persisted, simulateLatency } from "./mock-runtime";

interface RawAutomation extends Omit<Automation, "channel" | "platform" | "intents" | "config" | "updatedAt"> {
  channel: string;
  platform: string;
  intents: string[];
  config: { tone: string; confidenceThreshold: number; lowConfidenceBehavior: string; replyDelaySeconds: number };
  updatedDaysAgo: number;
}

function seed(): Automation[] {
  return (rawAutomations as RawAutomation[]).map(({ updatedDaysAgo, ...a }) => ({
    ...a,
    channel: a.channel as AutomationChannel,
    platform: a.platform as Platform,
    intents: a.intents as Intent[],
    config: a.config as AutomationConfig,
    updatedAt: minutesAgo(updatedDaysAgo * 1440),
  }));
}

const store = persisted<Automation[]>("automations.v1", seed);

export type AutomationPatch = Partial<Pick<Automation, "enabled" | "config">>;

export const automationService = {
  async getAutomations(): Promise<Automation[]> {
    await simulateLatency();
    return clone(store.read());
  },

  async updateAutomation(id: string, patch: AutomationPatch): Promise<Automation> {
    await simulateLatency(250, 450);
    const next = store.read().map((a) =>
      a.id === id ? { ...a, ...patch, updatedAt: new Date().toISOString() } : a,
    );
    store.write(next);
    const updated = next.find((a) => a.id === id);
    if (!updated) throw new Error(`Automation ${id} not found`);
    return clone(updated);
  },
};
