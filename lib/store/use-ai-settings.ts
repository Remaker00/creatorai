"use client";

import { useCallback, useEffect, useState } from "react";
import { settingsService } from "@/lib/services";
import type { AiSettings } from "@/lib/types";

export function useAiSettings() {
  const [settings, setSettings] = useState<AiSettings | null>(null);

  useEffect(() => {
    let active = true;
    settingsService.getAiSettings().then((data) => {
      if (active) setSettings(data);
    });
    return () => {
      active = false;
    };
  }, []);

  const save = useCallback(async (next: AiSettings) => {
    const saved = await settingsService.updateAiSettings(next);
    setSettings(saved);
    return saved;
  }, []);

  const reset = useCallback(async () => {
    const saved = await settingsService.resetAiSettings();
    setSettings(saved);
    return saved;
  }, []);

  return { settings, loaded: settings !== null, save, reset };
}

export type AiSettingsSlice = ReturnType<typeof useAiSettings>;
