import { eq } from "drizzle-orm";
import { db } from "@/lib/server/db/client";
import type { Executor } from "@/lib/server/db/executor";
import { passwordResetTokens } from "@/lib/server/db/schema";

export type PasswordResetRow = typeof passwordResetTokens.$inferSelect;

export const passwordResetRepository = {
  /** Only the newest link per user stays valid. */
  async replaceForUser(userId: string, id: string, expiresAt: Date): Promise<void> {
    await db.transaction(async (tx) => {
      await tx.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, userId));
      await tx.insert(passwordResetTokens).values({ id, userId, expiresAt });
    });
  },

  /** Deletes and returns the token in one statement, so a link can be used at most once. */
  async consume(id: string, ex: Executor = db): Promise<PasswordResetRow | null> {
    const [row] = await ex.delete(passwordResetTokens).where(eq(passwordResetTokens.id, id)).returning();
    return row ?? null;
  },
};
