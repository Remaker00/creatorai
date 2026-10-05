import { and, eq, lt, sql } from "drizzle-orm";
import { db } from "@/lib/server/db/client";
import type { Executor } from "@/lib/server/db/executor";
import { sessions, socialAccounts, users, workspaceMembers, workspaces } from "@/lib/server/db/schema";
import type { WorkspaceRole } from "@/lib/types";
import type { UserRow } from "./user-repository";
import type { WorkspaceRow } from "./workspace-repository";

export type SessionRow = typeof sessions.$inferSelect;

export interface SessionRecord {
  session: SessionRow;
  user: UserRow;
  workspace: WorkspaceRow;
  role: WorkspaceRole;
  instagramConnected: boolean;
}

export const sessionRepository = {
  async insert(values: typeof sessions.$inferInsert, ex: Executor = db): Promise<SessionRow> {
    const [row] = await ex.insert(sessions).values(values).returning();
    return row;
  },

  /**
   * Session + user + its workspace, joined through workspace_members so a removed
   * membership invalidates the session immediately.
   */
  async findWithContext(id: string): Promise<SessionRecord | null> {
    const [row] = await db
      .select({
        session: sessions,
        user: users,
        workspace: workspaces,
        role: workspaceMembers.role,
        instagramConnected: sql<boolean>`exists (select 1 from ${socialAccounts} where ${socialAccounts.workspaceId} = ${sessions.workspaceId} and ${socialAccounts.platform} = 'instagram')`,
      })
      .from(sessions)
      .innerJoin(users, eq(users.id, sessions.userId))
      .innerJoin(
        workspaceMembers,
        and(eq(workspaceMembers.userId, sessions.userId), eq(workspaceMembers.workspaceId, sessions.workspaceId)),
      )
      .innerJoin(workspaces, eq(workspaces.id, sessions.workspaceId))
      .where(eq(sessions.id, id))
      .limit(1);
    return row ?? null;
  },

  async extend(id: string, expiresAt: Date): Promise<void> {
    await db.update(sessions).set({ expiresAt }).where(eq(sessions.id, id));
  },

  async delete(id: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, id));
  },

  async deleteExpiredForUser(userId: string, now: Date): Promise<void> {
    await db.delete(sessions).where(and(eq(sessions.userId, userId), lt(sessions.expiresAt, now)));
  },
};
