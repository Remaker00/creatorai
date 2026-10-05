import { boolean, check, index, integer, jsonb, pgTable, primaryKey, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import type {
  AccountPermission,
  AiRule,
  AiSuggestion,
  AutomationChannel,
  AutomationConfig,
  CommentReply,
  CommentStatus,
  ConnectedAccount,
  ConversationStatus,
  CreatorProfile,
  DeliveryStatus,
  Intent,
  MessageAuthor,
  Platform,
  PostType,
  ReplyAuthor,
  Sentiment,
  PlanId,
  WorkspaceRole,
  WritingStyle,
} from "@/lib/types";

// IDs are text so seeded mock IDs (`c_jordan`, `p_lofoten`…) stay stable across layers.
const id = () => text("id").primaryKey();
const createdAt = () => timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow();
const workspaceId = () =>
  text("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" });

export const workspaces = pgTable(
  "workspaces",
  {
    id: id(),
    name: text("name").notNull(),
    /** Null until a plan is chosen on /pricing. */
    plan: text("plan").$type<PlanId>(),
    createdAt: createdAt(),
  },
  (t) => [check("workspaces_plan_check", sql`${t.plan} in ('free')`)],
);

export const users = pgTable(
  "users",
  {
    id: id(),
    /** Stored trimmed + lowercased; uniqueness is enforced on lower(email) as a backstop. */
    email: text("email").notNull(),
    name: text("name").notNull(),
    passwordHash: text("password_hash").notNull(),
    createdAt: createdAt(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("users_email_lower_idx").on(sql`lower(${t.email})`)],
);

export const workspaceMembers = pgTable(
  "workspace_members",
  {
    workspaceId: workspaceId(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: text("role").$type<WorkspaceRole>().notNull(),
    createdAt: createdAt(),
  },
  (t) => [
    primaryKey({ columns: [t.workspaceId, t.userId] }),
    index("workspace_members_user_idx").on(t.userId),
    check("workspace_members_role_check", sql`${t.role} in ('owner', 'admin', 'member')`),
  ],
);

/** Server-side sessions. `id` is the SHA-256 of the cookie token, so a DB leak can't be replayed as a cookie. */
export const sessions = pgTable(
  "sessions",
  {
    id: id(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    /** Active workspace, chosen server-side. Membership is re-checked on every lookup. */
    workspaceId: workspaceId(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("sessions_user_idx").on(t.userId), index("sessions_expires_idx").on(t.expiresAt)],
);

/** Password reset links. `id` is the SHA-256 of the emailed token; rows are single-use and short-lived. */
export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: id(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("password_reset_tokens_user_idx").on(t.userId)],
);

export const socialAccounts = pgTable(
  "social_accounts",
  {
    id: id(),
    workspaceId: workspaceId(),
    platform: text("platform").$type<Platform>().notNull(),
    /** The platform's own account ID (from OAuth). One row per account per workspace. */
    externalId: text("external_id").notNull(),
    handle: text("handle").notNull(),
    displayName: text("display_name").notNull(),
    followers: integer("followers").notNull().default(0),
    avatarHue: integer("avatar_hue").notNull(),
    status: text("status").$type<ConnectedAccount["status"]>().notNull(),
    permissions: text("permissions").array().$type<AccountPermission[]>().notNull(),
    syncDms: boolean("sync_dms").notNull().default(true),
    syncComments: boolean("sync_comments").notNull().default(true),
    webhook: jsonb("webhook").$type<ConnectedAccount["webhook"]>().notNull(),
    connectedAt: timestamp("connected_at", { withTimezone: true }).notNull(),
    lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }).notNull(),
  },
  (t) => [
    uniqueIndex("social_accounts_workspace_platform_external_idx").on(t.workspaceId, t.platform, t.externalId),
  ],
);

export const contacts = pgTable("contacts", {
  id: id(),
  workspaceId: workspaceId(),
  platform: text("platform").$type<Platform>().notNull(),
  name: text("name").notNull(),
  handle: text("handle").notNull(),
  followers: integer("followers").notNull().default(0),
  verified: boolean("verified").notNull().default(false),
  avatarHue: integer("avatar_hue").notNull(),
  location: text("location"),
  firstSeenAt: timestamp("first_seen_at", { withTimezone: true }).notNull(),
});

export const conversations = pgTable(
  "conversations",
  {
    id: id(),
    workspaceId: workspaceId(),
    contactId: text("contact_id")
      .notNull()
      .references(() => contacts.id, { onDelete: "cascade" }),
    platform: text("platform").$type<Platform>().notNull(),
    status: text("status").$type<ConversationStatus>().notNull(),
    handledBy: text("handled_by").$type<ReplyAuthor>(),
    unread: boolean("unread").notNull().default(true),
    intent: text("intent").$type<Intent>().notNull(),
    sentiment: text("sentiment").$type<Sentiment>().notNull(),
    lastMessageAt: timestamp("last_message_at", { withTimezone: true }).notNull(),
  },
  (t) => [index("conversations_workspace_last_message_idx").on(t.workspaceId, t.lastMessageAt)],
);

export const messages = pgTable(
  "messages",
  {
    id: id(),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    author: text("author").$type<MessageAuthor>().notNull(),
    body: text("body").notNull(),
    delivery: text("delivery").$type<DeliveryStatus>().notNull().default("sent"),
    createdAt: createdAt(),
  },
  (t) => [index("messages_conversation_created_idx").on(t.conversationId, t.createdAt)],
);

export const posts = pgTable("posts", {
  id: id(),
  workspaceId: workspaceId(),
  platform: text("platform").$type<Platform>().notNull(),
  type: text("type").$type<PostType>().notNull(),
  caption: text("caption").notNull(),
  likes: integer("likes").notNull().default(0),
  views: integer("views").notNull().default(0),
  coverHue: integer("cover_hue").notNull(),
  postedAt: timestamp("posted_at", { withTimezone: true }).notNull(),
});

export const comments = pgTable(
  "comments",
  {
    id: id(),
    postId: text("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    platform: text("platform").$type<Platform>().notNull(),
    authorHandle: text("author_handle").notNull(),
    authorHue: integer("author_hue").notNull(),
    body: text("body").notNull(),
    likes: integer("likes").notNull().default(0),
    status: text("status").$type<CommentStatus>().notNull(),
    intent: text("intent").$type<Intent>().notNull(),
    suggestion: jsonb("suggestion").$type<AiSuggestion>(),
    reply: jsonb("reply").$type<CommentReply>(),
    createdAt: createdAt(),
  },
  (t) => [index("comments_post_idx").on(t.postId)],
);

export const automations = pgTable("automations", {
  id: id(),
  workspaceId: workspaceId(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  channel: text("channel").$type<AutomationChannel>().notNull(),
  platform: text("platform").$type<Platform>().notNull(),
  intents: text("intents").array().$type<Intent[]>().notNull(),
  triggerKeywords: text("trigger_keywords").array().notNull(),
  enabled: boolean("enabled").notNull().default(false),
  config: jsonb("config").$type<AutomationConfig>().notNull(),
  runsLast7d: integer("runs_last_7d").notNull().default(0),
  successRate: integer("success_rate").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** One row per workspace. */
export const aiSettings = pgTable("ai_settings", {
  workspaceId: text("workspace_id")
    .primaryKey()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  profile: jsonb("profile").$type<CreatorProfile>().notNull(),
  style: jsonb("style").$type<WritingStyle>().notNull(),
  knowledgeTopics: text("knowledge_topics").array().notNull(),
  avoidTopics: text("avoid_topics").array().notNull(),
  rules: jsonb("rules").$type<AiRule[]>().notNull(),
});
