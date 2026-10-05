import { asc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/server/db/client";
import type { Executor } from "@/lib/server/db/executor";
import { workspaceMembers, workspaces } from "@/lib/server/db/schema";
import type { PlanId, WorkspaceRole } from "@/lib/types";

export type WorkspaceRow = typeof workspaces.$inferSelect;

export interface Membership {
  workspace: WorkspaceRow;
  role: WorkspaceRole;
}

export const workspaceRepository = {
  async insert(values: typeof workspaces.$inferInsert, ex: Executor = db): Promise<WorkspaceRow> {
    const [row] = await ex.insert(workspaces).values(values).returning();
    return row;
  },

  async addMember(workspaceId: string, userId: string, role: WorkspaceRole, ex: Executor = db): Promise<void> {
    await ex.insert(workspaceMembers).values({ workspaceId, userId, role });
  },

  /** The workspace a fresh login lands in: owned ones first, then oldest membership. */
  async findDefaultMembership(userId: string, ex: Executor = db): Promise<Membership | null> {
    const [row] = await ex
      .select({ workspace: workspaces, role: workspaceMembers.role })
      .from(workspaceMembers)
      .innerJoin(workspaces, eq(workspaces.id, workspaceMembers.workspaceId))
      .where(eq(workspaceMembers.userId, userId))
      .orderBy(sql`${workspaceMembers.role} = 'owner' desc`, asc(workspaceMembers.createdAt))
      .limit(1);
    return row ?? null;
  },

  async setPlan(workspaceId: string, plan: PlanId): Promise<WorkspaceRow | null> {
    const [row] = await db.update(workspaces).set({ plan }).where(eq(workspaces.id, workspaceId)).returning();
    return row ?? null;
  },
};
