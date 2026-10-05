import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/server/db/client";
import type { Executor } from "@/lib/server/db/executor";
import { socialAccounts } from "@/lib/server/db/schema";
import type { Platform } from "@/lib/types";

export type SocialAccountRow = typeof socialAccounts.$inferSelect;
export type SocialAccountInsert = typeof socialAccounts.$inferInsert;

// Every query is scoped by workspace: an account ID from another tenant behaves as missing.
const scoped = (workspaceId: string, id: string) =>
  and(eq(socialAccounts.workspaceId, workspaceId), eq(socialAccounts.id, id));

export const socialAccountRepository = {
  list(workspaceId: string): Promise<SocialAccountRow[]> {
    return db.select().from(socialAccounts).where(eq(socialAccounts.workspaceId, workspaceId)).orderBy(socialAccounts.connectedAt);
  },

  async hasPlatform(workspaceId: string, platform: Platform, ex: Executor = db): Promise<boolean> {
    const [row] = await ex
      .select({ id: socialAccounts.id })
      .from(socialAccounts)
      .where(and(eq(socialAccounts.workspaceId, workspaceId), eq(socialAccounts.platform, platform)))
      .limit(1);
    return Boolean(row);
  },

  async update(
    workspaceId: string,
    id: string,
    patch: Partial<Pick<SocialAccountRow, "syncDms" | "syncComments" | "status" | "lastSyncedAt">>,
  ): Promise<SocialAccountRow | null> {
    const [row] = await db.update(socialAccounts).set(patch).where(scoped(workspaceId, id)).returning();
    return row ?? null;
  },

  /** Reconnecting the same external account refreshes it instead of duplicating it. */
  async upsert(values: SocialAccountInsert): Promise<SocialAccountRow> {
    const [row] = await db
      .insert(socialAccounts)
      .values(values)
      .onConflictDoUpdate({
        target: [socialAccounts.workspaceId, socialAccounts.platform, socialAccounts.externalId],
        set: {
          handle: sql`excluded.handle`,
          displayName: sql`excluded.display_name`,
          followers: sql`excluded.followers`,
          status: sql`excluded.status`,
          permissions: sql`excluded.permissions`,
          lastSyncedAt: sql`excluded.last_synced_at`,
        },
      })
      .returning();
    return row;
  },

  async delete(workspaceId: string, id: string): Promise<boolean> {
    const rows = await db.delete(socialAccounts).where(scoped(workspaceId, id)).returning({ id: socialAccounts.id });
    return rows.length > 0;
  },
};
