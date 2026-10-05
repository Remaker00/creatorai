import {
  ArrowRight,
  Bot,
  Gauge,
  HandCoins,
  Heart,
  Inbox,
  MessageCircle,
  Package,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react";
import { AnimatedInboxPreview } from "@/components/marketing/animated-inbox-preview";
import { CtaBand, Section, SectionHeading, StartNowButton } from "@/components/marketing/sections";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const highlights = [
  {
    icon: Inbox,
    title: "One inbox for every DM",
    body: "Collabs, questions and fan mail are sorted by intent so you know what needs you.",
  },
  {
    icon: Sparkles,
    title: "Replies in your voice",
    body: "AI drafts answers using your tone, knowledge and rules. Send, edit or regenerate.",
  },
  {
    icon: MessageCircle,
    title: "Comments handled",
    body: "Bulk-draft replies to comments on posts and Reels, then approve in one click.",
  },
];

const messageTypes = [
  {
    icon: HandCoins,
    intent: "Brand deals",
    example: "“What are your rates for a Reel?”",
    action: "Drafts a professional reply and flags it for your review.",
  },
  {
    icon: Package,
    intent: "Product questions",
    example: "“Does the preset pack work on mobile?”",
    action: "Answers from your knowledge base, in your tone.",
  },
  {
    icon: Heart,
    intent: "Fan love",
    example: "“Your last video made my week!”",
    action: "Sends a warm thank-you automatically, if you allow it.",
  },
  {
    icon: Trash2,
    intent: "Spam",
    example: "“Promote your page for $5!!”",
    action: "Recognised and left unanswered — no wasted time.",
  },
];

const controls = [
  {
    icon: Gauge,
    title: "Confidence thresholds",
    body: "Only replies above your threshold are sent automatically. Everything else waits for you.",
  },
  {
    icon: ShieldCheck,
    title: "Topics to avoid",
    body: "Pricing, personal info or anything else you list is always deflected or flagged.",
  },
  {
    icon: Bot,
    title: "Rules you write",
    body: "“Always review brand deals.” Plain-language rules the AI follows every time.",
  },
];

const steps = [
  { title: "Create your account", body: "Sign up free in under a minute." },
  { title: "Connect Instagram", body: "Link your Business or Creator account." },
  { title: "Let AI help", body: "Review drafts in your Inbox and turn on automations." },
];

function ThresholdCard() {
  return (
    <Card className="ai-glow p-5" aria-hidden>
      <p className="text-sm font-medium">Fan messages automation</p>
      <p className="mt-0.5 text-xs text-fg-subtle">Send automatically when the AI is confident</p>
      <div className="mt-5">
        <div className="flex justify-between text-xs text-fg-muted">
          <span>Confidence threshold</span>
          <span className="font-medium text-fg tabular-nums">85%</span>
        </div>
        <div className="relative mt-2 h-2 rounded-full bg-surface-3">
          <div className="h-full w-[85%] rounded-full bg-accent" />
          <span className="absolute top-1/2 left-[85%] size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent bg-surface shadow" />
        </div>
      </div>
      <div className="mt-5 space-y-2 text-xs">
        {[
          { label: "“Love this!!” · 97%", tone: "success" as const, status: "Sent" },
          { label: "“Collab rates?” · 71%", tone: "warning" as const, status: "Needs review" },
          { label: "“Where do you live?” · avoided", tone: "danger" as const, status: "Held" },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between rounded-lg bg-surface-2 px-3 py-2">
            <span className="text-fg-muted">{row.label}</span>
            <Badge tone={row.tone}>{row.status}</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function LandingPage() {
  return (
    <>
      <section className="bg-[radial-gradient(ellipse_at_top_left,var(--color-accent-soft),transparent_55%)]">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2">
          <div>
            <Badge tone="accent">
              <Sparkles /> AI inbox for Instagram creators
            </Badge>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Your DMs and comments, answered in your voice.
            </h1>
            <p className="mt-4 max-w-lg text-lg text-fg-muted">
              CreatorAI drafts replies to every message and comment, so you spend minutes on your inbox instead of
              hours.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <StartNowButton />
              <ButtonLink href="/features">See how it works</ButtonLink>
            </div>
            <p className="mt-3 text-xs text-fg-subtle">Free plan. No credit card required.</p>
          </div>
          <AnimatedInboxPreview />
        </div>
      </section>

      <Section className="border-t border-line bg-surface/40">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Features" title="Everything your inbox needs" />
          <ButtonLink href="/features" variant="ghost">
            Explore all features <ArrowRight />
          </ButtonLink>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {highlights.map(({ icon: Icon, title, body }) => (
            <Card key={title} className="p-5 transition-transform duration-200 hover:-translate-y-0.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-accent-soft text-accent-strong">
                <Icon className="size-4" />
              </span>
              <h3 className="mt-3 text-sm font-medium">{title}</h3>
              <p className="mt-1 text-sm text-fg-muted">{body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Smart triage"
          title="Every kind of message, handled the right way"
          body="CreatorAI reads the intent behind each DM and comment, then responds the way you would — or steps aside."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {messageTypes.map(({ icon: Icon, intent, example, action }) => (
            <Card key={intent} className="flex flex-col p-5">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Icon className="size-4 text-accent-strong" /> {intent}
              </span>
              <p className="mt-3 rounded-xl rounded-bl-sm bg-surface-3 px-3 py-2 text-sm">{example}</p>
              <p className="mt-3 text-sm text-fg-muted">{action}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="border-y border-line bg-surface/40">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="You stay in control"
              title="Automation that knows when to ask you"
              body="Nothing goes out that you wouldn't send yourself. Set the rules once; CreatorAI follows them on every message."
            />
            <ul className="mt-8 space-y-5">
              {controls.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent-strong">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{title}</p>
                    <p className="text-sm text-fg-muted">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <ThresholdCard />
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Get started" title="Up and running in three steps" />
        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title} className="rounded-card border border-line p-5">
              <span className="flex size-7 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent-strong">
                {i + 1}
              </span>
              <p className="mt-3 text-sm font-medium">{step.title}</p>
              <p className="mt-1 text-sm text-fg-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <CtaBand />
    </>
  );
}
