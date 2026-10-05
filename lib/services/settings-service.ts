import rawSettings from "@/lib/mock/ai-settings.json";
import type { AiSettings } from "@/lib/types";
import { clone, persisted, simulateLatency } from "./mock-runtime";

const store = persisted<AiSettings>("ai-settings.v1", () => clone(rawSettings as AiSettings));

export const settingsService = {
  async getAiSettings(): Promise<AiSettings> {
    await simulateLatency();
    return clone(store.read());
  },

  async updateAiSettings(settings: AiSettings): Promise<AiSettings> {
    await simulateLatency(350, 600);
    return clone(store.write(clone(settings)));
  },

  async resetAiSettings(): Promise<AiSettings> {
    await simulateLatency(200, 400);
    return clone(store.write(clone(rawSettings as AiSettings)));
  },
};
