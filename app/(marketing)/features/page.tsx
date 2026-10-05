import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BarChart3, Bot, Check, Inbox, MessageCircle, Sparkles } from "lucide-react";
import { CtaBand, PageHero, Section, StartNowButton } from "@/components/marketing/sections";
import { Avatar } from "@/components/ui/avatar";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Smart inbox, AI replies in your voice, comment management, automations and analytics for Instagram creators.",
};

/* ---------- Small product visuals (static, built from the app's own primitives) ---------- */

function InboxVisual() {
  const rows: { name: string; hue: number; text: string; tone: BadgeTone; intent: string; unread?: boolean }[] = [
    {
      name: "Jordan Lee",
      hue: 24,
      text: "Are you open to collabs?",
      tone: "accent",
      intent: "Collaboration",
      unread: true,
    },
    { name: "Priya S.", hue: 160, text: "Does it ship to Canada?", tone: "info", intent: "Shipping" },
    { name: "Marco R.", hue: 300, text: "Your last Reel was 🔥", tone: "success", intent: "Fan message" },
    { name: "Ella K.", hue: 210, text: "What's your rate card?", tone: "warning", intent: "Pricing", unread: true },
  ];
  return (
    <Card className="divide-y divide-line">
      {rows.map((r) => (
        <div key={r.name} className="flex items-center gap-3 px-4 py-3">
          <Avatar name={r.name} hue={r.hue} size="sm" />
          <div className="min-w-0 flex-1">
            <p className={cn("text-sm", r.unread ? "font-semibold" : "font-medium")}>{r.name}</p>
            <p className="truncate text-xs text-fg-subtle">{r.text}</p>
          </div>
          <Badge tone={r.tone}>{r.intent}</Badge>
        </div>
      ))}
    </Card>
  );
}

function VoiceVisual() {
  return (
    <Card className="space-y-4 p-5">
      <div className="flex flex-wrap gap-2">
        {["Friendly", "Light emoji", "Short replies", "Signs off with ✌️"].map((t) => (
          <Badge key={t} tone="accent">
            {t}
          </Badge>
        ))}
      </div>
      <p className="max-w-[85%] rounded-2xl rounded-bl-md bg-surface-3 px-3 py-2 text-sm">
        Which lens did you use for the sunset shots?
      </p>
      <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md border border-accent/30 bg-accent-soft px-3 py-2 text-sm">
        <p className="mb-1 flex items-center gap-1 text-[11px] font-medium text-accent-strong">
          <Sparkles className="size-3" /> AI draft · from your knowledge base
        </p>
        The 35mm f/1.4 — it&apos;s on my gear list in bio! ✌️
      </div>
    </Card>
  );
}

function CommentsVisual() {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-3 border-b border-line p-4">
        <div className="size-10 rounded-lg bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af]" />
        <div className="flex-1">
          <p className="text-sm font-medium">Lofoten sunrise · Reel</p>
          <p className="text-xs text-fg-subtle">14 comments · 9 drafts ready</p>
        </div>
        <span className="rounded-md bg-accent px-2.5 py-1 text-xs font-medium text-white">Approve all</span>
      </div>
      {["@sam.travels  Insane colours 😍", "@nora.k  Is this the Fujifilm?", "@leo_p  Bucket list!!"].map((c) => (
        <div
          key={c}
          className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5 text-sm last:border-0"
        >
          <span className="truncate">{c}</span>
          <Badge tone="accent">
            <Sparkles /> Draft
          </Badge>
        </div>
      ))}
    </Card>
  );
}

function AutomationsVisual() {
  return (
    <div className="space-y-3">
      {[
        { name: "Thank fans", on: true, detail: "Auto-send above 85% confidence" },
        { name: "Shipping questions", on: true, detail: "Answer from FAQ, review if unsure" },
        { name: "Brand deals", on: false, detail: "Always route to review" },
      ].map((a) => (
        <Card key={a.name} className="flex items-center justify-between gap-4 p-4">
          <div>
            <p className="text-sm font-medium">{a.name}</p>
            <p className="text-xs text-fg-subtle">{a.detail}</p>
          </div>
          <span
            className={cn(
              "relative inline-flex h-5 w-9 items-center rounded-full",
              a.on ? "bg-accent" : "bg-surface-3 ring-1 ring-line-strong",
            )}
          >
            <span
              className={cn("size-4 rounded-full bg-white shadow-sm", a.on ? "translate-x-[18px]" : "translate-x-0.5")}
            />
          </span>
        </Card>
      ))}
    </div>
  );
}

function AnalyticsVisual() {
  const bars = [35, 52, 44, 68, 58, 80, 72];
  return (
    <Card className="p-5">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "AI replies", value: "68%" },
          { label: "Median response", value: "4m" },
          { label: "Needs review", value: "6" },
        ].map((k) => (
          <div key={k.label} className="rounded-lg bg-surface-2 p-3">
            <p className="text-[11px] text-fg-subtle">{k.label}</p>
            <p className="mt-1 text-lg font-semibold tabular-nums">{k.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 flex h-36 items-end gap-2">
        {bars.map((h, i) => (
          <div key={i} className="flex flex-1 flex-col justify-end gap-0.5" style={{ height: `${h}%` }}>
            <div className="flex-[2] rounded-t-sm bg-accent" />
            <div className="flex-1 rounded-b-sm bg-[var(--chart-received)]" />
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-fg-subtle">Illustrative example</p>
    </Card>
  );
}

const sections: {
  icon: typeof Inbox;
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  visual: ReactNode;
}[] = [
  {
    icon: Inbox,
    eyebrow: "Smart Inbox",
    title: "Every DM sorted before you open the app",
    body: "Messages are grouped by what people actually want — collabs, questions, fan love, complaints — so the important ones never get buried.",
    points: [
      "Intent and sentiment on every conversation",
      "Unread, AI-handled and needs-review filters",
      "Contact context: followers, history, location",
    ],
    visual: <InboxVisual />,
  },
  {
    icon: Sparkles,
    eyebrow: "AI replies",
    title: "Drafts that sound like you, not a bot",
    body: "Teach CreatorAI your tone, emoji habits and the facts you get asked about. Every draft explains why it was written that way.",
    points: [
      "Tone, length and emoji controls",
      "Answers from your own knowledge base",
      "Regenerate, edit or send in one click",
    ],
    visual: <VoiceVisual />,
  },
  {
    icon: MessageCircle,
    eyebrow: "Comments",
    title: "Reply to a whole post's comments at once",
    body: "Open a post, let CreatorAI draft replies to every comment, skim and approve. Engagement up, evenings back.",
    points: ["Per-post comment view", "Bulk AI drafts and approvals", "Mark handled or reply manually anytime"],
    visual: <CommentsVisual />,
  },
  {
    icon: Bot,
    eyebrow: "Automations",
    title: "Hands-free for the routine, hands-on for the rest",
    body: "Turn on automations per message type. Confidence thresholds decide what's sent on its own and what waits for you.",
    points: [
      "Per-intent automations",
      "Confidence thresholds and review routing",
      "Holding replies when the AI isn't sure",
    ],
    visual: <AutomationsVisual />,
  },
  {
    icon: BarChart3,
    eyebrow: "Analytics",
    title: "Know what your audience is asking",
    body: "See message volume, how much the AI handles, your busiest hours and the topics people bring up most.",
    points: ["Volume and reply-mix trends", "Top intents and busiest hours", "AI acceptance and time saved"],
    visual: <AnalyticsVisual />,
  },
];

export default function FeaturesPage() {
  return (
    <>
      <PageHero
        badge="Features"
        title="Everything you need to run your inbox on autopilot"
        body="Five tools that work together: a smart inbox, AI replies in your voice, comment management, automations and analytics."
      >
        <StartNowButton />
        <ButtonLink href="/pricing">View pricing</ButtonLink>
      </PageHero>

      <nav aria-label="Feature sections" className="sticky top-14 z-20 border-y border-line bg-canvas/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 sm:px-6">
          {sections.map(({ icon: Icon, eyebrow }) => (
            <a
              key={eyebrow}
              href={`#${eyebrow.toLowerCase().replace(/\s+/g, "-")}`}
              className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
            >
              <Icon className="size-4" /> {eyebrow}
            </a>
          ))}
        </div>
      </nav>

      {sections.map(({ icon: Icon, eyebrow, title, body, points, visual }, i) => (
        <Section
          key={eyebrow}
          id={eyebrow.toLowerCase().replace(/\s+/g, "-")}
          className={cn(i % 2 === 1 && "bg-surface/40")}
        >
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className={cn(i % 2 === 1 && "lg:order-2")}>
              <span className="flex items-center gap-2 text-xs font-medium tracking-wide text-accent-strong uppercase">
                <Icon className="size-4" /> {eyebrow}
              </span>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">{title}</h2>
              <p className="mt-3 text-fg-muted">{body}</p>
              <ul className="mt-6 space-y-2.5">
                {points.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-sm">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-strong">
                      <Check className="size-3" />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className={cn(i % 2 === 1 && "lg:order-1")}>{visual}</div>
          </div>
        </Section>
      ))}

      <CtaBand
        title="See it on your own inbox"
        body="Connect Instagram on the Free plan and get your first AI drafts in minutes."
      />
    </>
  );
}
