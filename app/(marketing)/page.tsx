import { ArrowRight, BarChart3, Bot, Inbox, MessageCircle, Sparkles } from "lucide-react";
import { PlatformIcon } from "@/components/platform-icon";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const features = [
  { icon: Inbox, title: "One inbox for every DM", body: "Collabs, questions and fan mail are sorted by intent so you know what needs you." },
  { icon: Sparkles, title: "Replies in your voice", body: "AI drafts answers using your tone, knowledge and rules. Send, edit or regenerate." },
  { icon: MessageCircle, title: "Comments handled", body: "Bulk-draft replies to comments on posts and Reels, then approve in one click." },
  { icon: Bot, title: "Automations you control", body: "Confidence thresholds decide what is sent automatically and what waits for review." },
  { icon: BarChart3, title: "See the time you save", body: "Track response times, AI acceptance and what your audience asks about most." },
];

const steps = [
  { title: "Create your account", body: "Sign up free in under a minute." },
  { title: "Connect Instagram", body: "Link your Business or Creator account." },
  { title: "Let AI help", body: "Review drafts in your Inbox and turn on automations." },
];

function InboxPreview() {
  return (
    <Card className="ai-glow overflow-hidden text-left" aria-hidden>
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <Avatar name="Jordan Lee" hue={24} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium">Jordan Lee</p>
          <p className="flex items-center gap-1 text-[11px] text-fg-subtle">
            <PlatformIcon platform="instagram" className="size-3" /> Direct message
          </p>
        </div>
        <Badge tone="accent">Collaboration</Badge>
      </div>
      <div className="space-y-3 p-4 text-sm">
        <p className="max-w-[85%] rounded-2xl rounded-bl-md bg-surface-3 px-3 py-2">
          Hi! We&apos;d love to send you our new camera bag for a review. Are you open to collabs?
        </p>
        <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md border border-accent/30 bg-accent-soft px-3 py-2">
          <p className="mb-1 flex items-center gap-1 text-[11px] font-medium text-accent-strong">
            <Sparkles className="size-3" /> AI draft · 94% confident
          </p>
          Thanks Jordan! I&apos;m open to it. Could you share the brief and timeline? I&apos;ll get back to you this week.
        </div>
      </div>
    </Card>
  );
}

export default function LandingPage() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2">
        <div>
          <Badge tone="accent">
            <Sparkles /> AI inbox for Instagram creators
          </Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Your DMs and comments, answered in your voice.
          </h1>
          <p className="mt-4 max-w-lg text-lg text-fg-muted">
            CreatorAI drafts replies to every message and comment, so you spend minutes on your inbox instead of hours.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/signup" variant="ai">
              Start Now <ArrowRight />
            </ButtonLink>
            <ButtonLink href="/pricing">See pricing</ButtonLink>
          </div>
          <p className="mt-3 text-xs text-fg-subtle">Free plan. No credit card required.</p>
        </div>
        <InboxPreview />
      </section>

      <section id="features" className="scroll-mt-16 border-t border-line bg-surface/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="text-2xl font-semibold tracking-tight">Everything your inbox needs</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, body }) => (
              <Card key={title} className="p-5">
                <span className="flex size-8 items-center justify-center rounded-lg bg-accent-soft text-accent-strong">
                  <Icon className="size-4" />
                </span>
                <h3 className="mt-3 text-sm font-medium">{title}</h3>
                <p className="mt-1 text-sm text-fg-muted">{body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="text-2xl font-semibold tracking-tight">Up and running in three steps</h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title} className="rounded-card border border-line p-5">
              <span className="text-xs font-medium text-accent-strong">Step {i + 1}</span>
              <p className="mt-1 text-sm font-medium">{step.title}</p>
              <p className="mt-1 text-sm text-fg-muted">{step.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12 flex flex-col items-start gap-4 rounded-card border border-accent/25 bg-accent-soft/50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">Ready to get your evenings back?</p>
            <p className="text-sm text-fg-muted">Start on the Free plan today.</p>
          </div>
          <ButtonLink href="/signup" variant="ai">
            Start Now <ArrowRight />
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
