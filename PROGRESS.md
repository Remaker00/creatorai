# Progress

## Done — V1 frontend milestone (2026-10-05)
- App shell: sidebar with live counts, mobile drawer, toasts.
- Overview (`/`): KPIs, 7/30d activity chart, needs-attention list, recent conversations, automations, AI impact.
- Inbox (`/inbox?c=&filter=`): search, filters (All/Unread/AI/Review), read/unread, flag, resolve/reopen, manual send, AI generate/regenerate/edit/send, "Why this reply?", spam "no reply" path, contact panel.
- Comments: per-post view, bulk/single AI drafts, approve & send, manual reply, mark handled, AI/manual status.
- Automations: toggle, config sheet (tone, threshold, low-confidence behavior, delay).
- AI Settings: profile, style, knowledge, avoid topics, rules, live reply preview, persisted.
- Analytics: KPIs, volume/reply-mix/intent/hourly charts, live session card.
- Connected Accounts: Instagram card, sync now, DM/comment sync toggles, permissions, webhook health.
- Debounce demo moved to `/debounce-demo`.
- Verified: build, tsc and lint pass; scripted browser flows; 390px layout.

## Done — Backend phase 1 (2026-10-05)
- PostgreSQL + Drizzle: schema for 9 tables (`lib/server/db/schema.ts`), migration `drizzle/0000_init.sql`, seed from `lib/mock/*.json` (`npm run db:migrate`, `npm run db:seed`).
- Layers: `lib/server/db → repositories → services → app/api`.
- `GET /api/conversations`, `GET /api/conversations/:id` (404 if missing). Client `conversationService` reads these; Inbox now reads from Postgres.
- Verified: tsc, lint, build; migrate + seed (re-runnable); both APIs via curl; a DB edit shows up in the API. Inbox not browser-tested (Chrome extension unavailable).
- Local DB moved (2026-10-05) from Homebrew to EDB PostgreSQL 17 (`/Library/PostgreSQL/17`, port 5432, pgAdmin). App connects as role `creatorai`, which owns DB `creatorai`.

## Done — Auth + workspace + onboarding (2026-10-05)
- Tables `users`, `sessions`, `workspace_members` (+ `workspaces.onboarding_completed_at`), migration `drizzle/0001_auth.sql`.
- APIs: `POST /api/auth/{signup,login,logout}`, `GET /api/auth/me`, `POST /api/onboarding`. Signup creates user, workspace, owner membership and session in one transaction.
- `/signup`, `/login`, `/onboarding` (workspace name, then an Instagram placeholder). Dashboard pages and `/api/conversations*` need auth and are scoped to the session's workspace. Sidebar shows the user and a logout button.
- Seed only resets `ws_default` and creates owner `demo@creatorai.dev` (password `$SEED_DEMO_PASSWORD`, or random and printed).
- Verified with curl and SQL: signup/login/logout, duplicate email (case-insensitive), wrong credentials, validation, refresh, expiry, sliding renewal, token replay after logout, membership revocation, cross-tenant 404, CSRF 403, no orphans after a failed signup. tsc, lint and build pass. Not browser-tested.

## Done — Public site, plans, Instagram connect (2026-10-05)
- Public `/` (landing) and `/pricing` (Free plan) with a "Start Now" navbar CTA. Dashboard Overview moved to `/dashboard`.
- Flow: Start Now → signup/login → `/pricing` → Free "Start Now" (`POST /api/workspace/plan`) → `/onboarding` (Free plan card with Connect Instagram) → placeholder OAuth (connect → `/onboarding/instagram` consent → callback) → Inbox unlocked. Signed-in users hitting `/signup` or `/login` skip to their next step.
- Migrations `0002` (adds `workspaces.plan`, `social_accounts.external_id` + unique index, backfill) and `0003` (drops `onboarding_completed_at`).
- Connected Accounts now on the DB: `GET /api/accounts`, `PATCH`/`DELETE /api/accounts/:id`, `POST /api/accounts/:id/sync`, all workspace-scoped. Disconnect button and an empty "Connect Instagram" state. Sidebar shows Inbox as locked until connected.
- Verified with curl and SQL: public pages logged out, protected redirects, the full flow, invalid plan, forged/replayed/invalid OAuth state, account persisted in its own workspace, Inbox page and API locked when disconnected, unlocked when connected, locked again after disconnect, refresh, logout, cross-tenant 404s, demo user straight in. tsc, lint and build pass. Not browser-tested.

## Done — Theme switch + account menu (2026-10-05)
- Light/dark theme: light values for the same tokens under `:root[data-theme="light"]`; charts use CSS vars. Toggle in the marketing header, auth pages and mobile dashboard header; switch in the account menu and on `/account`. The choice is saved per device and defaults to the OS setting.
- Profile dropdown (`components/account/user-menu.tsx`, on the `components/ui/menu.tsx` primitive): name/email/workspace/plan, Dashboard, Account & profile, AI settings, Connected accounts, Dark mode, Log out. Used in the marketing header when signed in (replaces Log in / Start Now), the dashboard sidebar and the mobile header.
- New `/account` page (profile, workspace/role/plan/Instagram, appearance, log out). Profile is read-only for now.
- `/` and `/pricing` are now dynamic (the header reads the session).
- Verified with curl: header states logged in and out, `/account`, theme script and light CSS emitted. tsc, lint and build pass. Not browser-tested, so light-mode visuals haven't been checked by eye.

## Done — Marketing site, in-dashboard locks, password reset (2026-10-05)
- Login/signup land on `/`. Header for visitors: Features/Pricing/About + Start Now (no Log in; mobile uses a menu). Signed in: Dashboard + profile menu. Footer has no links.
- New brand mark (`components/shell/logo.tsx`) and favicon `app/icon.svg` (replaced the default `favicon.ico`).
- Home: animated inbox preview (message → intent → drafting → typed reply → sent; loops, respects reduced motion) and two new sections ("Every kind of message", "You stay in control"). New `/features` (5 sections + sticky section nav), `/about`. `/pricing` adds "What you get on day one" and an FAQ, and shows the current plan.
- Auth cards hold the logo and the alternate link inside one card. "Forgot password?" on login.
- Dashboard is always reachable when signed in. Locked pages render a blurred copy of their layout plus an unlock card (`LockedFeature`, rules in `lib/feature-access.ts`): no plan → everything but `/account`; no Instagram → Inbox and Comments. Sidebar shows locks and a "continue setup" card.
- Password reset: `/forgot-password` → emailed single-use link (SHA-256 stored, 30 min, newest only) → `/reset-password` sets the password, revokes all sessions and signs in. Migration `0004`. Mailer: Resend via fetch if `RESEND_API_KEY`/`EMAIL_FROM` are set; dev shows the link on screen and logs it; production never logs it.
- Verified with curl and SQL: pages, header/footer states, favicon, lock matrix (no plan / no Instagram / demo fully unlocked), reset happy path, short password, reuse, expiry, superseded link, old sessions revoked, no-referrer on the reset page. tsc, lint and build pass. Not browser-tested, so visuals and animation weren't checked by eye.

## Known gaps
- Conversation writes (send, read/unread, status) are optimistic only, not persisted yet; they reset on reload.
- Comments and session stats reset on reload; other services still mock (by design, see DECISIONS).
- Seed times are relative to when the seed runs; reseed to refresh.
- Mock services (AI settings, automations, accounts, comments, analytics) are still localStorage and not workspace-scoped. A new workspace sees the demo mock data on those pages; its Inbox (DB) is empty because the placeholder connection imports no messages.
- No login/reset rate limiting yet (needs a shared store). No email verification. Production email needs `RESEND_API_KEY` + `EMAIL_FROM`; without them reset emails aren't sent.
- Nothing committed yet.

## Next (not started)
- Conversation mutation APIs, then the other services onto the DB.
- Real Instagram OAuth: implement `InstagramProvider` (and store the long-lived token encrypted), then message sync into the Inbox. Billing/teams are out of scope until asked.
