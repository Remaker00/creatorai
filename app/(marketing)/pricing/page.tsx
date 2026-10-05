import type { Metadata } from "next";
import {
  ArrowRight,
  BarChart3,
  Bot,
  ChevronDown,
  Inbox,
  Lock,
  MessageCircle,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { PlanCard } from "@/components/marketing/plan-card";
import { CtaBand, PageHero, Section, SectionHeading } from "@/components/marketing/sections";
import { StartPlanButton } from "@/components/marketing/start-plan-button";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { plans } from "@/lib/plans";
import { getAuth } from "@/lib/server/auth/session";

export const metadata: Metadata = { title: "Pricing", description: "Start free with CreatorAI." };

const included = [
  {
    icon: Inbox,
    title: "Smart Inbox",
    body: "Every Instagram DM sorted by intent, with filters for unread, AI-handled and needs-review.",
  },
  {
    icon: Sparkles,
    title: "AI replies",
    body: "Drafts in your tone from your own knowledge base. Edit, regenerate or send.",
  },
  {
    icon: MessageCircle,
    title: "Comment replies",
    body: "Bulk drafts for every comment on a post or Reel, approved in one click.",
  },
  { icon: Bot, title: "Automations", body: "Per-intent automations with confidence thresholds and review routing." },
  { icon: BarChart3, title: "Analytics", body: "Volume, reply mix, top intents and busiest hours." },
  { icon: SlidersHorizontal, title: "AI settings", body: "Tone, style, topics to avoid and plain-language rules." },
];

const faqs = [
  {
    q: "Is the Free plan really free?",
    a: "Yes. There's no credit card and no trial clock. Paid plans for higher volume and teams are on the way; you'll be able to stay on Free.",
  },
  {
    q: "Will the AI send messages without asking me?",
    a: "Only if you turn on an automation, and only above the confidence threshold you set. Everything else waits in your review queue.",
  },
  {
    q: "Which Instagram accounts work?",
    a: "Business and Creator accounts. You connect yours during setup and can disconnect at any time from Connected Accounts.",
  },
  {
    q: "Is my data used to train AI models?",
    a: "No. Your messages and settings are only used to draft replies for your workspace, which is isolated from every other account.",
  },
  {
    q: "Can I switch plans later?",
    a: "Yes. When more plans launch you'll be able to change from your Account page whenever you like.",
  },
];

export default async function PricingPage() {
  const auth = await getAuth();
  const currentPlan = auth?.state.workspace.plan ?? null;

  return (
    <>
      <PageHero
        badge="Pricing"
        title="Simple pricing. Start free."
        body="One plan with everything you need today. Paid plans for teams and higher volume are coming soon."
      />

      <div className="mx-auto max-w-sm px-4 pb-8">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            current={currentPlan === plan.id}
            action={
              currentPlan === plan.id ? (
                <ButtonLink href="/dashboard" variant="ai" className="w-full">
                  Go to dashboard <ArrowRight />
                </ButtonLink>
              ) : (
                <StartPlanButton plan={plan.id} />
              )
            }
          />
        ))}
        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-fg-subtle">
          <Lock className="size-3" /> No credit card. Cancel anytime.
        </p>
      </div>

      <Section>
        <SectionHeading
          center
          eyebrow="Included"
          title="What you get on day one"
          body="The Free plan isn't a teaser — it's the full product for one Instagram account."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {included.map(({ icon: Icon, title, body }) => (
            <Card key={title} className="p-5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-accent-soft text-accent-strong">
                <Icon className="size-4" />
              </span>
              <h3 className="mt-3 text-sm font-medium">{title}</h3>
              <p className="mt-1 text-sm text-fg-muted">{body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="border-t border-line bg-surface/40">
        <SectionHeading center eyebrow="FAQ" title="Questions, answered" />
        <div className="mx-auto mt-10 max-w-2xl space-y-3">
          {faqs.map(({ q, a }) => (
            <details key={q} className="group rounded-card border border-line bg-surface open:ai-glow">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
                {q}
                <ChevronDown className="size-4 shrink-0 text-fg-subtle transition-transform group-open:rotate-180" />
              </summary>
              <p className="px-5 pb-4 text-sm text-fg-muted">{a}</p>
            </details>
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
