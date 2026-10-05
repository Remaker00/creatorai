import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/server/db/client";
import type { Executor } from "@/lib/server/db/executor";
import { users } from "@/lib/server/db/schema";

export type UserRow = typeof users.$inferSelect;

export const userRepository = {
  async findByEmail(email: string, ex: Executor = db): Promise<UserRow | null> {
    const [row] = await ex
      .select()
      .from(users)
      .where(eq(sql`lower(${users.email})`, email.toLowerCase()))
      .limit(1);
    return row ?? null;
  },

  async findById(id: string, ex: Executor = db): Promise<UserRow | null> {
    const [row] = await ex.select().from(users).where(eq(users.id, id)).limit(1);
    return row ?? null;
  },

  async updatePassword(id: string, passwordHash: string, ex: Executor = db): Promise<void> {
    await ex.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.id, id));
  },

  async insert(values: typeof users.$inferInsert, ex: Executor = db): Promise<UserRow> {
    const [row] = await ex.insert(users).values(values).returning();
    return row;
  },
};
