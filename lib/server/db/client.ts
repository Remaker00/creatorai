import { setDefaultAutoSelectFamilyAttemptTimeout } from "node:net";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export type Database = NodePgDatabase<typeof schema>;

// See drizzle.config.ts: Node's 250ms per-address connect budget is too short for distant hosted DBs.
setDefaultAutoSelectFamilyAttemptTimeout(2000);

// Reuse one pool across dev hot reloads instead of opening a new one per module evaluation.
const globalForDb = globalThis as unknown as { creatoraiPool?: Pool; creatoraiDb?: Database };

function getDb(): Database {
  if (globalForDb.creatoraiDb) return globalForDb.creatoraiDb;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set. Copy .env.example to .env.");
  globalForDb.creatoraiPool ??= new Pool({ connectionString, max: 10 });
  return (globalForDb.creatoraiDb = drizzle(globalForDb.creatoraiPool, { schema }));
}

/**
 * Connects lazily on first use. `next build` imports every route module to collect its
 * config, so creating the pool at import time would make builds require a database.
 */
export const db: Database = new Proxy({} as Database, {
  get(_target, prop) {
    const real = getDb();
    const value: unknown = Reflect.get(real, prop, real);
    return typeof value === "function" ? value.bind(real) : value;
  },
});

export async function closeDb(): Promise<void> {
  const pool = globalForDb.creatoraiPool;
  globalForDb.creatoraiPool = undefined;
  globalForDb.creatoraiDb = undefined;
  await pool?.end();
}
