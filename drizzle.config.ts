import { setDefaultAutoSelectFamilyAttemptTimeout } from "node:net";
import { defineConfig } from "drizzle-kit";

// Node gives each resolved address 250ms before trying the next; to a far-away hosted DB
// (e.g. Neon us-east from Asia) every attempt times out with an empty AggregateError.
setDefaultAutoSelectFamilyAttemptTimeout(2000);

try {
  process.loadEnvFile();
} catch {
  // No .env file — rely on the environment.
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/server/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
});
