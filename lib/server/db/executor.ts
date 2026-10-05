import type { Database } from "./client";

export type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0];
/** Repositories accept either the pool or an open transaction. */
export type Executor = Database | Transaction;
