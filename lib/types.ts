export type Platform = "instagram" | "youtube" | "tiktok" | "x";

export type Tone = "friendly" | "professional" | "playful" | "concise";
export type EmojiUsage = "none" | "light" | "frequent";
export type ReplyLength = "short" | "medium" | "detailed";
export type Sentiment = "positive" | "neutral" | "negative";

export type Intent =
  | "collaboration"
  | "pricing"
  | "product_question"
  | "shipping"
  | "fan_message"
  | "complaint"
  | "spam"
  | "general";

export type ReplyAuthor = "ai" | "creator";

/* ---------- Inbox ---------- */

export interface Contact {
  id: string;
  name: string;
  handle: string;
  followers: number;
  verified: boolean;
  avatarHue: number;
  location?: string;
  firstSeenAt: string;
}

export type MessageAuthor = "contact" | ReplyAuthor;
export type DeliveryStatus = "sending" | "sent" | "failed";

export interface Message {
  id: string;
  conversationId: string;
  author: MessageAuthor;
  body: string;
  createdAt: string;
  delivery: DeliveryStatus;
}

export type ConversationStatus = "new" | "needs_review" | "replied" | "resolved";

export interface Conversation {
  id: string;
  platform: Platform;
  contact: Contact;
  messages: Message[];
  status: ConversationStatus;
  handledBy: ReplyAuthor | null;
  unread: boolean;
  intent: Intent;
  sentiment: Sentiment;
  lastMessageAt: string;
}

export type InboxFilter = "all" | "unread" | "ai_handled" | "needs_review";

/* ---------- AI ---------- */

export interface AiReplyRequest {
  channel: AutomationChannel;
  /** Recent inbound text the reply should answer, oldest first. */
  inbound: string[];
  recipientName: string;
  intentHint?: Intent;
  settings: AiSettings;
  automations: Automation[];
  /** Bumped on each regenerate so a different draft comes back. */
  variant: number;
}

export interface AiSuggestion {
  id: string;
  body: string;
  intent: Intent;
  confidence: number;
  tone: Tone;
  automationId: string | null;
  matchedRule: string;
  reasoning: string;
  appliedRules: string[];
  needsReview: boolean;
  /** The assistant recommends not replying at all (e.g. spam). */
  noReply: boolean;
  generatedAt: string;
}

/* ---------- Comments ---------- */

export type PostType = "reel" | "post" | "carousel";

export interface Post {
  id: string;
  platform: Platform;
  type: PostType;
  caption: string;
  postedAt: string;
  likes: number;
  views: number;
  coverHue: number;
}

export type CommentStatus = "pending" | "suggested" | "replied" | "handled";

export interface CommentReply {
  body: string;
  author: ReplyAuthor;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  platform: Platform;
  authorHandle: string;
  authorHue: number;
  body: string;
  likes: number;
  createdAt: string;
  status: CommentStatus;
  intent: Intent;
  suggestion?: AiSuggestion;
  reply?: CommentReply;
}

/* ---------- Automations ---------- */

export type AutomationChannel = "dm" | "comment";
export type LowConfidenceBehavior = "flag_for_review" | "send_holding_reply" | "skip";

export interface AutomationConfig {
  tone: Tone;
  confidenceThreshold: number;
  lowConfidenceBehavior: LowConfidenceBehavior;
  replyDelaySeconds: number;
}

export interface Automation {
  id: string;
  name: string;
  description: string;
  channel: AutomationChannel;
  platform: Platform;
  intents: Intent[];
  triggerKeywords: string[];
  enabled: boolean;
  config: AutomationConfig;
  runsLast7d: number;
  successRate: number;
  updatedAt: string;
}

/* ---------- AI settings ---------- */

export interface CreatorProfile {
  displayName: string;
  handle: string;
  niche: string;
  bio: string;
  businessEmail: string;
  website: string;
}

export interface WritingStyle {
  tone: Tone;
  emojiUsage: EmojiUsage;
  replyLength: ReplyLength;
  signoff: string;
  styleNotes: string;
}

export interface AiRule {
  id: string;
  text: string;
}

export interface AiSettings {
  profile: CreatorProfile;
  style: WritingStyle;
  knowledgeTopics: string[];
  avoidTopics: string[];
  rules: AiRule[];
}

/* ---------- Accounts ---------- */

export type AccountPermission = "messages" | "comments" | "insights" | "profile";

export interface ConnectedAccount {
  id: string;
  platform: Platform;
  handle: string;
  displayName: string;
  followers: number;
  avatarHue: number;
  status: "connected" | "syncing" | "error";
  connectedAt: string;
  lastSyncedAt: string;
  permissions: AccountPermission[];
  syncDms: boolean;
  syncComments: boolean;
  webhook: {
    healthy: boolean;
    delivered24h: number;
    failed24h: number;
    medianLatencyMs: number;
  };
}

/* ---------- Analytics ---------- */

export interface DailyMetric {
  date: string;
  messagesReceived: number;
  aiReplies: number;
  manualReplies: number;
  avgResponseMinutes: number;
}

export interface IntentMetric {
  intent: Intent;
  count: number;
}

export interface Analytics {
  daily: DailyMetric[];
  intents: IntentMetric[];
  hourly: { hour: number; messages: number }[];
  aiAcceptanceRate: number;
  csatScore: number;
  timeSavedHours: number;
}

/** Actions taken during this browser session, layered on top of the analytics baseline. */
export interface SessionStats {
  aiReplies: number;
  manualReplies: number;
  resolved: number;
  aiSuggestionsGenerated: number;
  aiSuggestionsEdited: number;
}

/* ---------- Auth ---------- */

export type WorkspaceRole = "owner" | "admin" | "member";

/** Only the Free plan exists; no billing yet. */
export type PlanId = "free";

/** Public user shape — never includes credentials. */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthWorkspace {
  id: string;
  name: string;
  role: WorkspaceRole;
  /** Null until the user picks a plan on /pricing. */
  plan: PlanId | null;
  /** Unlocks the Inbox. */
  instagramConnected: boolean;
}

/** Response of `/api/auth/me`, signup and login. */
export interface AuthState {
  user: AuthUser;
  workspace: AuthWorkspace;
}
