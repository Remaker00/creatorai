-- Existing rows predate OAuth: backfill external_id with the row id before enforcing NOT NULL.
ALTER TABLE "social_accounts" ADD COLUMN "external_id" text;--> statement-breakpoint
UPDATE "social_accounts" SET "external_id" = "id" WHERE "external_id" IS NULL;--> statement-breakpoint
ALTER TABLE "social_accounts" ALTER COLUMN "external_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "plan" text;--> statement-breakpoint
-- Workspaces that already finished the old onboarding keep their progress on the Free plan.
UPDATE "workspaces" SET "plan" = 'free' WHERE "onboarding_completed_at" IS NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "social_accounts_workspace_platform_external_idx" ON "social_accounts" USING btree ("workspace_id","platform","external_id");--> statement-breakpoint
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_plan_check" CHECK ("workspaces"."plan" in ('free'));
