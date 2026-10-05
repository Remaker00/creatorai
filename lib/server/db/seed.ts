/**
 * Loads lib/mock/*.json into PostgreSQL. Relative times (`minutesAgo`…) are resolved
 * against the moment the seed runs. Re-running wipes and reseeds only the demo workspace
 * (other users' workspaces are untouched) and (re)creates its owner login:
 *   demo@creatorai.dev / $SEED_DEMO_PASSWORD (a random one is generated and printed if unset)
 *
 *   npm run db:seed
 */
import rawAccounts from "@/lib/mock/accounts.json";
import rawSettings from "@/lib/mock/ai-settings.json";
import rawAutomations from "@/lib/mock/automations.json";
import rawConversations from "@/lib/mock/conversations.json";
import rawPosts from "@/lib/mock/posts.json";
import type { AiSettings, Automation, ConnectedAccount, Conversation, Comment, Post } from "@/lib/types";
import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/lib/server/auth/password";
import { closeDb, db } from "./client";
import { DEFAULT_WORKSPACE_ID as workspaceId } from "./constants";
import * as t from "./schema";

const now = Date.now();
const minutesAgo = (minutes: number) => new Date(now - minutes * 60_000);

type Raw<T, Omitted extends keyof T, Extra> = Omit<T, Omitted> & Extra;

const accounts = rawAccounts as Raw<
  ConnectedAccount,
  "connectedAt" | "lastSyncedAt",
  { connectedDaysAgo: number; lastSyncedMinutesAgo: number }
>[];
const automations = rawAutomations as Raw<Automation, "updatedAt", { updatedDaysAgo: number }>[];
const settings = rawSettings as AiSettings;
const conversations = rawConversations as (Raw<
  Conversation,
  "contact" | "messages" | "lastMessageAt",
  {
    contact: Omit<Conversation["contact"], "firstSeenAt"> & { firstSeenDaysAgo: number };
    messages: { author: Conversation["messages"][number]["author"]; body: string; minutesAgo: number }[];
  }
>)[];
const { posts, comments } = rawPosts as {
  posts: Raw<Post, "postedAt", { postedHoursAgo: number }>[];
  comments: Raw<
    Comment,
    "platform" | "createdAt" | "reply",
    { minutesAgo: number; reply?: { body: string; author: "ai" | "creator"; minutesAgo: number } }
  >[];
};

const DEMO_EMAIL = "demo@creatorai.dev";
const DEMO_USER_ID = "usr_demo";

async function seed() {
  const demoPassword = process.env.SEED_DEMO_PASSWORD || randomBytes(9).toString("base64url");
  const passwordHash = await hashPassword(demoPassword);

  await db.transaction(async (tx) => {
    // Cascades to the demo workspace's data, memberships and sessions only.
    await tx.delete(t.workspaces).where(eq(t.workspaces.id, workspaceId));
    await tx
      .insert(t.workspaces)
      .values({ id: workspaceId, name: settings.profile.displayName, plan: "free" });

    await tx
      .insert(t.users)
      .values({ id: DEMO_USER_ID, email: DEMO_EMAIL, name: settings.profile.displayName, passwordHash })
      .onConflictDoUpdate({ target: t.users.id, set: { passwordHash, updatedAt: new Date() } });
    await tx.delete(t.sessions).where(eq(t.sessions.userId, DEMO_USER_ID));
    await tx.insert(t.workspaceMembers).values({ workspaceId, userId: DEMO_USER_ID, role: "owner" });

    await tx.insert(t.socialAccounts).values(
      accounts.map(({ connectedDaysAgo, lastSyncedMinutesAgo, ...a }) => ({
        ...a,
        workspaceId,
        externalId: a.id,
        connectedAt: minutesAgo(connectedDaysAgo * 1440),
        lastSyncedAt: minutesAgo(lastSyncedMinutesAgo),
      })),
    );

    await tx.insert(t.contacts).values(
      conversations.map(({ platform, contact: { firstSeenDaysAgo, location, ...contact } }) => ({
        ...contact,
        workspaceId,
        platform,
        location: location ?? null,
        firstSeenAt: minutesAgo(firstSeenDaysAgo * 1440),
      })),
    );

    await tx.insert(t.conversations).values(
      conversations.map((c) => ({
        id: c.id,
        workspaceId,
        contactId: c.contact.id,
        platform: c.platform,
        status: c.status,
        handledBy: c.handledBy,
        unread: c.unread,
        intent: c.intent,
        sentiment: c.sentiment,
        lastMessageAt: minutesAgo(Math.min(...c.messages.map((m) => m.minutesAgo))),
      })),
    );

    await tx.insert(t.messages).values(
      conversations.flatMap((c) =>
        c.messages.map((m, index) => ({
          id: `${c.id}_m${index}`,
          conversationId: c.id,
          author: m.author,
          body: m.body,
          delivery: "sent" as const,
          createdAt: minutesAgo(m.minutesAgo),
        })),
      ),
    );

    await tx.insert(t.posts).values(
      posts.map(({ postedHoursAgo, ...p }) => ({ ...p, workspaceId, postedAt: minutesAgo(postedHoursAgo * 60) })),
    );

    const platformByPost = new Map(posts.map((p) => [p.id, p.platform]));
    await tx.insert(t.comments).values(
      comments.map(({ minutesAgo: age, reply, ...c }) => ({
        ...c,
        platform: platformByPost.get(c.postId) ?? "instagram",
        createdAt: minutesAgo(age),
        reply: reply
          ? { body: reply.body, author: reply.author, createdAt: minutesAgo(reply.minutesAgo).toISOString() }
          : null,
      })),
    );

    await tx.insert(t.automations).values(
      automations.map(({ updatedDaysAgo, ...a }) => ({ ...a, workspaceId, updatedAt: minutesAgo(updatedDaysAgo * 1440) })),
    );

    await tx.insert(t.aiSettings).values({ workspaceId, ...settings });
  });

  console.log(
    `Seeded ${workspaceId}: ${conversations.length} conversations, ${posts.length} posts, ` +
      `${comments.length} comments, ${automations.length} automations, ${accounts.length} accounts.`,
  );
  console.log(`Demo login: ${DEMO_EMAIL} / ${process.env.SEED_DEMO_PASSWORD ? "$SEED_DEMO_PASSWORD" : demoPassword}`);
}

seed()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(closeDb);
