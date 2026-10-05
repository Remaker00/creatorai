import replyRules from "@/lib/mock/ai-reply-rules.json";
import type {
  AiReplyRequest,
  AiSettings,
  AiSuggestion,
  Automation,
  AutomationChannel,
  Intent,
  Tone,
} from "@/lib/types";
import { createId, simulateLatency } from "./mock-runtime";

interface Template {
  keywords?: string[];
  confidence?: number;
  body: string;
  detail?: string;
}

interface IntentRule {
  intent: Intent;
  label: string;
  keywords: string[];
  baseConfidence: number;
  reviewRuleHints: string[];
  relevantRuleHints: string[];
  noReply?: boolean;
  dm: Template[];
  comment: Template[];
}

interface ReplyRules {
  greetings: Record<Tone, string[]>;
  closers: Record<Tone, string>;
  toneEmoji: Record<Tone, string>;
  defaultThreshold: number;
  avoidTopicSynonyms: Record<string, string[]>;
  avoidTopicReply: Record<AutomationChannel, string>;
  intents: IntentRule[];
}

const rules = replyRules as ReplyRules;
const EMOJI_PATTERN = /\s*\p{Extended_Pictographic}️?/gu;

export const intentLabels: Record<Intent, string> = Object.fromEntries(
  rules.intents.map((rule) => [rule.intent, rule.label]),
) as Record<Intent, string>;

function matchedKeywords(text: string, keywords: string[]): string[] {
  return keywords.filter((keyword) => text.includes(keyword.toLowerCase()));
}

function detectIntent(text: string, hint?: Intent): { rule: IntentRule; hits: string[] } {
  let best: { rule: IntentRule; hits: string[] } | null = null;
  for (const rule of rules.intents) {
    // "general" only wins when nothing more specific matches.
    if (rule.intent === "general") continue;
    const hits = matchedKeywords(text, rule.keywords);
    if (hits.length === 0) continue;
    // On a tie, trust the intent the conversation was already classified with.
    const better = !best || hits.length > best.hits.length || (hits.length === best.hits.length && rule.intent === hint);
    if (better) best = { rule, hits };
  }
  if (best) return best;

  const fallback =
    rules.intents.find((rule) => rule.intent === hint) ??
    rules.intents.find((rule) => rule.intent === "general");
  if (!fallback) throw new Error("Reply rules are missing a general intent");
  return { rule: fallback, hits: [] };
}

function detectAvoidedTopic(text: string, avoidTopics: string[]): string | null {
  for (const topic of avoidTopics) {
    const key = topic.toLowerCase();
    const terms = [key, ...(rules.avoidTopicSynonyms[key] ?? [])];
    if (terms.some((term) => text.includes(term))) return topic;
  }
  return null;
}

function pickTemplate(templates: Template[], text: string, variant: number): Template {
  const specific = templates.filter((t) => t.keywords && matchedKeywords(text, t.keywords).length > 0);
  const pool = specific.length > 0 ? specific : templates.filter((t) => !t.keywords);
  const candidates = pool.length > 0 ? pool : templates;
  return candidates[variant % candidates.length];
}

function fill(text: string, settings: AiSettings, firstName: string): string {
  return text
    .replaceAll("{firstName}", firstName)
    .replaceAll("{creatorName}", settings.profile.displayName)
    .replaceAll("{businessEmail}", settings.profile.businessEmail)
    .replaceAll("{website}", settings.profile.website);
}

function composeDm(template: Template, tone: Tone, settings: AiSettings, variant: number): string {
  const { replyLength, emojiUsage, signoff } = settings.style;
  const greetings = rules.greetings[tone];
  const greeting = greetings[variant % greetings.length];
  const parts = [template.body];

  if (replyLength !== "short" && template.detail) parts.push(template.detail);
  if (replyLength === "detailed" && rules.closers[tone]) parts.push(rules.closers[tone]);
  if (emojiUsage === "frequent" && rules.toneEmoji[tone]) parts.push(rules.toneEmoji[tone]);

  // Formal greetings ("Hi Jordan,") sit on their own line, like an email.
  const body = `${greeting}${greeting.endsWith(",") ? "\n\n" : " "}${parts.join(" ")}`;
  if (!signoff.trim()) return body;
  return `${body}\n\n${tone === "professional" ? "Best,\n" : "— "}${signoff.trim()}`;
}

function applyEmojiPolicy(text: string, settings: AiSettings): string {
  return settings.style.emojiUsage === "none" ? text.replace(EMOJI_PATTERN, "") : text;
}

function findAutomation(automations: Automation[], channel: AutomationChannel, intent: Intent) {
  return automations.find((a) => a.channel === channel && a.intents.includes(intent)) ?? null;
}

function rulesMatching(settings: AiSettings, hints: string[]): string[] {
  if (hints.length === 0) return [];
  return settings.rules
    .filter((rule) => hints.some((hint) => rule.text.toLowerCase().includes(hint)))
    .map((rule) => rule.text);
}

function buildSuggestion(request: AiReplyRequest): Omit<AiSuggestion, "id" | "generatedAt"> {
  const { settings, channel, variant } = request;
  const text = request.inbound.join(" ").toLowerCase();
  const firstName = request.recipientName.split(" ")[0];
  const { rule, hits } = detectIntent(text, request.intentHint);
  const automation = findAutomation(request.automations, channel, rule.intent);
  const tone = automation?.config.tone ?? settings.style.tone;
  const threshold = automation?.config.confidenceThreshold ?? rules.defaultThreshold;
  const appliedRules = rulesMatching(settings, channel === "comment" ? [...rule.relevantRuleHints, "comment"] : rule.relevantRuleHints);
  const reviewRules = rulesMatching(settings, rule.reviewRuleHints);
  const automationNote = automation
    ? `${automation.name} (${tone}, ${threshold}% threshold${automation.enabled ? "" : ", currently paused"})`
    : `default assistant (${tone} tone)`;

  const avoided = detectAvoidedTopic(text, settings.avoidTopics);
  if (avoided) {
    const deflection = rules.avoidTopicReply[channel].replace("{topic}", avoided.toLowerCase());
    const raw = channel === "dm" ? composeDm({ body: deflection }, tone, settings, variant) : deflection;
    return {
      body: applyEmojiPolicy(fill(raw, settings, firstName), settings).trim(),
      intent: rule.intent,
      confidence: 0.34,
      tone,
      automationId: automation?.id ?? null,
      matchedRule: `Avoided topic: ${avoided}`,
      reasoning: `Message touches on “${avoided}”, which is on your avoid list. Drafted a polite deflection — review before sending.`,
      appliedRules,
      needsReview: true,
      noReply: false,
    };
  }

  const template = pickTemplate(rule[channel], text, variant);
  const jitter = (variant % 3) * 0.012;
  const confidence = Math.min(0.99, (template.confidence ?? rule.baseConfidence) + Math.min(hits.length, 2) * 0.02 - jitter);
  const raw = channel === "dm" ? composeDm(template, tone, settings, variant) : template.body;
  const body = applyEmojiPolicy(fill(raw, settings, firstName), settings).trim();
  const belowThreshold = confidence * 100 < threshold;

  const reasons = [
    hits.length > 0
      ? `Detected ${rule.label.toLowerCase()} intent from ${hits.map((h) => `“${h}”`).join(", ")}.`
      : `Classified as ${rule.label.toLowerCase()}.`,
    `Using ${automationNote}.`,
  ];
  if (reviewRules.length > 0) reasons.push("Your rules require a human to review this type of message.");
  else if (belowThreshold) reasons.push(`Confidence is below the ${threshold}% threshold.`);
  if (rule.noReply) reasons.push("Recommended: archive without replying.");

  return {
    body,
    intent: rule.intent,
    confidence,
    tone,
    automationId: automation?.id ?? null,
    matchedRule: automation?.name ?? "Default assistant",
    reasoning: reasons.join(" "),
    appliedRules: [...new Set([...appliedRules, ...reviewRules])],
    needsReview: reviewRules.length > 0 || belowThreshold,
    noReply: rule.noReply ?? false,
  };
}

export const aiService = {
  /** Drafts a reply. Takes 700–1000ms to feel like a real model call. */
  async generateReply(request: AiReplyRequest): Promise<AiSuggestion> {
    await simulateLatency(700, 1000);
    return {
      id: createId("sug"),
      generatedAt: new Date().toISOString(),
      ...buildSuggestion(request),
    };
  },
};
