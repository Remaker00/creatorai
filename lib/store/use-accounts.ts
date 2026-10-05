"use client";

import { useCallback, useEffect, useState } from "react";
import { accountService } from "@/lib/services";
import type { AccountPatch } from "@/lib/services/account-service";
import type { ConnectedAccount } from "@/lib/types";

export function useAccounts() {
  const [items, setItems] = useState<ConnectedAccount[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    accountService
      .getAccounts()
      .then((data) => {
        if (active) setItems(data);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const replace = useCallback((account: ConnectedAccount) => {
    setItems((list) => list.map((a) => (a.id === account.id ? account : a)));
  }, []);

  const update = useCallback(
    async (id: string, patch: AccountPatch) => {
      setItems((list) => list.map((a) => (a.id === id ? { ...a, ...patch } : a)));
      replace(await accountService.updateAccount(id, patch));
    },
    [replace],
  );

  const sync = useCallback(
    async (id: string) => {
      setItems((list) => list.map((a) => (a.id === id ? { ...a, status: "syncing" } : a)));
      replace(await accountService.syncAccount(id));
    },
    [replace],
  );

  const disconnect = useCallback(async (id: string) => {
    await accountService.disconnectAccount(id);
    setItems((list) => list.filter((a) => a.id !== id));
  }, []);

  return { items, loaded, update, sync, disconnect };
}

export type AccountsSlice = ReturnType<typeof useAccounts>;
