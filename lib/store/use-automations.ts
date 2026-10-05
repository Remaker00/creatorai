"use client";

import { useCallback, useEffect, useState } from "react";
import { automationService } from "@/lib/services";
import type { AutomationPatch } from "@/lib/services/automation-service";
import type { Automation } from "@/lib/types";

export function useAutomations() {
  const [items, setItems] = useState<Automation[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    automationService.getAutomations().then((data) => {
      if (!active) return;
      setItems(data);
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const update = useCallback(async (id: string, patch: AutomationPatch) => {
    // Optimistic: reflect the change immediately, then reconcile with the service response.
    setItems((list) => list.map((a) => (a.id === id ? { ...a, ...patch } : a)));
    const saved = await automationService.updateAutomation(id, patch);
    setItems((list) => list.map((a) => (a.id === id ? saved : a)));
    return saved;
  }, []);

  return { items, loaded, update };
}

export type AutomationsSlice = ReturnType<typeof useAutomations>;
