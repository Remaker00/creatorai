import { randomBytes } from "node:crypto";
import type { InstagramProfile } from "@/lib/server/integrations/instagram/provider";
import { HttpError } from "@/lib/server/http";
import { socialAccountRepository, type SocialAccountRow } from "@/lib/server/repositories/social-account-repository";
import type { ConnectedAccount } from "@/lib/types";

export type AccountPatch = Partial<Pick<ConnectedAccount, "syncDms" | "syncComments">>;

function toConnectedAccount(row: SocialAccountRow): ConnectedAccount {
  return {
    id: row.id,
    platform: row.platform,
    handle: row.handle,
    displayName: row.displayName,
    followers: row.followers,
    avatarHue: row.avatarHue,
    status: row.status,
    connectedAt: row.connectedAt.toISOString(),
    lastSyncedAt: row.lastSyncedAt.toISOString(),
    permissions: row.permissions,
    syncDms: row.syncDms,
    syncComments: row.syncComments,
    webhook: row.webhook,
  };
}

function hueFor(seed: string): number {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return h;
}

// workspaceId always comes from the authenticated session.
export const accountServerService = {
  async list(workspaceId: string): Promise<ConnectedAccount[]> {
    return (await socialAccountRepository.list(workspaceId)).map(toConnectedAccount);
  },

  async update(workspaceId: string, id: string, patch: AccountPatch): Promise<ConnectedAccount> {
    const row = await socialAccountRepository.update(workspaceId, id, patch);
    if (!row) throw new HttpError(404, "Account not found");
    return toConnectedAccount(row);
  },

  /** Placeholder: no Instagram API yet, so a sync just records the time. */
  async sync(workspaceId: string, id: string): Promise<ConnectedAccount> {
    const row = await socialAccountRepository.update(workspaceId, id, { status: "connected", lastSyncedAt: new Date() });
    if (!row) throw new HttpError(404, "Account not found");
    return toConnectedAccount(row);
  },

  async disconnect(workspaceId: string, id: string): Promise<void> {
    if (!(await socialAccountRepository.delete(workspaceId, id))) throw new HttpError(404, "Account not found");
  },

  async connectInstagram(workspaceId: string, profile: InstagramProfile): Promise<ConnectedAccount> {
    const now = new Date();
    const row = await socialAccountRepository.upsert({
      id: `acc_${randomBytes(12).toString("base64url")}`,
      workspaceId,
      platform: "instagram",
      externalId: profile.externalId,
      handle: profile.handle,
      displayName: profile.displayName,
      followers: profile.followers,
      avatarHue: hueFor(profile.handle),
      status: "connected",
      permissions: profile.permissions,
      // Webhooks don't exist yet; report them as not delivering rather than inventing numbers.
      webhook: { healthy: false, delivered24h: 0, failed24h: 0, medianLatencyMs: 0 },
      connectedAt: now,
      lastSyncedAt: now,
    });
    return toConnectedAccount(row);
  },
};
