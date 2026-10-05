import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export type Database = NodePgDatabase<typeof schema>;

// Reuse one pool across dev hot reloads instead of opening a new one per module evaluation.
const globalForDb = globalThis as unknown as { creatoraiPool?: Pool };

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set. Copy .env.example to .env.");
  return new Pool({ connectionString, max: 10 });
}

const pool = (globalForDb.creatoraiPool ??= createPool());

export const db: Database = drizzle(pool, { schema });

export function closeDb(): Promise<void> {
  globalForDb.creatoraiPool = undefined;
  return pool.end();
}
