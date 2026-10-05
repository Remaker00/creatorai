import type { ConnectedAccount } from "@/lib/types";
import { apiRequest } from "./http";

export type AccountPatch = Partial<Pick<ConnectedAccount, "syncDms" | "syncComments">>;

const path = (id: string) => `/api/accounts/${encodeURIComponent(id)}`;

// Connected accounts live in PostgreSQL (social_accounts), scoped to the session's workspace.
// Connecting happens through the OAuth redirect at /api/integrations/instagram/connect.
export const accountService = {
  getAccounts(): Promise<ConnectedAccount[]> {
    return apiRequest("GET", "/api/accounts");
  },

  updateAccount(id: string, patch: AccountPatch): Promise<ConnectedAccount> {
    return apiRequest("PATCH", path(id), patch);
  },

  syncAccount(id: string): Promise<ConnectedAccount> {
    return apiRequest("POST", `${path(id)}/sync`);
  },

  disconnectAccount(id: string): Promise<void> {
    return apiRequest("DELETE", path(id));
  },
};
