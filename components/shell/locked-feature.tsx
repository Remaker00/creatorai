import type { ReactNode } from "react";
import { ArrowRight, Check, Lock } from "lucide-react";
import { PlatformIcon } from "@/components/platform-icon";
import { Badge } from "@/components/ui/badge";
import { buttonClasses, ButtonLink } from "@/components/ui/button";
import type { Feature, LockReason } from "@/lib/feature-access";
import { cn } from "@/lib/utils";
import { PageContainer, PageHeader } from "./page-header";

interface FeatureCopy {
  title: string;
  description: string;
  perks: string[];
  preview: "inbox" | "dashboard" | "cards" | "form";
}

const copy: Record<Feature, FeatureCopy> = {
  overview: {
    title: "Overview",
    description: "Your inbox health, AI impact and what needs you — at a glance.",
    perks: ["Live KPIs for DMs and comments", "Needs-attention queue", "Time saved by AI"],
    preview: "dashboard",
  },
  inbox: {
    title: "Inbox",
    description: "Every Instagram DM in one place, with AI drafts ready to send.",
    perks: ["Conversations sorted by intent", "AI replies in your voice", "Review queue for sensitive messages"],
    preview: "inbox",
  },
  comments: {
    title: "Comments",
    description: "Reply to comments on your posts and Reels in bulk.",
    perks: ["Per-post comment view", "Bulk AI drafts", "Approve & send in one click"],
    preview: "cards",
  },
  automations: {
    title: "Automations",
    description: "Let CreatorAI answer routine messages automatically.",
    perks: ["Per-intent automations", "Confidence thresholds", "Holding replies when unsure"],
    preview: "cards",
  },
  analytics: {
    title: "Analytics",
    description: "See what your audience asks and how fast you respond.",
    perks: ["Message volume & reply mix", "Top intents", "Busiest hours"],
    preview: "dashboard",
  },
  aiSettings: {
    title: "AI Settings",
    description: "Teach CreatorAI your voice, knowledge and rules.",
    perks: ["Tone & writing style", "Topics to avoid", "Custom reply rules"],
    preview: "form",
  },
  accounts: {
    title: "Connected Accounts",
    description: "Manage the social accounts CreatorAI works with.",
    perks: ["Connect Instagram", "Sync controls", "Permission overview"],
    preview: "cards",
  },
};

/* ---------- Blurred previews that mirror each page's real layout ---------- */

const bar = "rounded-md bg-surface-3";

function InboxPreview() {
  return (
    <div className="flex h-full">
      <div className="w-full shrink-0 space-y-3 border-r border-line bg-surface/40 p-4 md:w-80 lg:w-[340px]">
        <div className={cn(bar, "h-9 rounded-lg")} />
        <div className={cn(bar, "h-8 rounded-lg")} />
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className="flex items-center gap-3 py-2">
            <div className="size-9 shrink-0 rounded-full bg-surface-3" />
            <div className="flex-1 space-y-2">
              <div className={cn(bar, "h-3 w-1/2")} />
              <div className={cn(bar, "h-3 w-5/6")} />
            </div>
          </div>
        ))}
      </div>
      <div className="hidden flex-1 flex-col gap-4 p-6 md:flex">
        <div className={cn(bar, "h-10 w-64")} />
        <div className={cn(bar, "h-14 w-2/3 rounded-2xl")} />
        <div className="ml-auto h-20 w-1/2 rounded-2xl bg-accent-soft ring-1 ring-accent/20" />
        <div className={cn(bar, "h-12 w-1/2 rounded-2xl")} />
        <div className={cn(bar, "mt-auto h-24 rounded-xl")} />
      </div>
    </div>
  );
}

function PagePreview({ kind }: { kind: FeatureCopy["preview"] }) {
  return (
    <div className="space-y-4">
      {kind === "dashboard" && (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-24 rounded-card border border-line bg-surface p-4">
                <div className={cn(bar, "h-3 w-1/2")} />
                <div className={cn(bar, "mt-4 h-6 w-1/3")} />
              </div>
            ))}
          </div>
          <div className="flex h-64 items-end gap-2 rounded-card border border-line bg-surface p-5">
            {[40, 65, 50, 80, 60, 90, 70, 85, 55, 75, 95, 68].map((h, i) => (
              <div key={i} className="flex-1 rounded-t-md bg-accent/25" style={{ height: `${h}%` }} />
            ))}
          </div>
        </>
      )}
      {kind === "cards" && (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-32 space-y-3 rounded-card border border-line bg-surface p-5">
              <div className={cn(bar, "h-4 w-1/3")} />
              <div className={cn(bar, "h-3 w-5/6")} />
              <div className={cn(bar, "h-3 w-2/3")} />
            </div>
          ))}
        </div>
      )}
      {kind === "form" && (
        <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4 rounded-card border border-line bg-surface p-5">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="space-y-2">
                <div className={cn(bar, "h-3 w-24")} />
                <div className={cn(bar, "h-9 rounded-lg")} />
              </div>
            ))}
          </div>
          <div className="h-72 rounded-card border border-line bg-surface" />
        </div>
      )}
    </div>
  );
}

function UnlockCard({ feature, reason }: { feature: FeatureCopy; reason: LockReason }) {
  const isPlan = reason === "plan";
  return (
    <div className="w-full max-w-sm animate-fade-in rounded-2xl border border-line-strong bg-surface p-6 text-center shadow-2xl shadow-black/20 ai-glow">
      <span className="mx-auto flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent-strong ring-1 ring-accent/25">
        {isPlan ? <Lock className="size-5" /> : <PlatformIcon platform="instagram" className="size-5" />}
      </span>
      <Badge tone="accent" className="mt-4">
        {isPlan ? "Included in every plan" : "Free plan feature"}
      </Badge>
      <h2 className="mt-2 text-lg font-semibold tracking-tight">
        {isPlan ? `Unlock ${feature.title}` : `Connect Instagram to use ${feature.title}`}
      </h2>
      <p className="mt-1 text-sm text-fg-muted">{feature.description}</p>
      <ul className="mt-4 space-y-2 text-left text-sm">
        {feature.perks.map((perk) => (
          <li key={perk} className="flex items-center gap-2.5">
            <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-strong">
              <Check className="size-3" />
            </span>
            {perk}
          </li>
        ))}
      </ul>
      <div className="mt-6 space-y-2">
        {isPlan ? (
          <>
            <ButtonLink href="/pricing" variant="ai" className="w-full">
              Choose a plan <ArrowRight />
            </ButtonLink>
            <ButtonLink href="/features" variant="ghost" className="w-full">
              See what&apos;s included
            </ButtonLink>
          </>
        ) : (
          <>
            {/* Full navigation: starts the OAuth redirect flow. */}
            <a href="/api/integrations/instagram/connect" className={cn(buttonClasses({ variant: "ai" }), "w-full")}>
              Connect Instagram <ArrowRight />
            </a>
            <p className="text-xs text-fg-subtle">Takes under a minute. You can disconnect anytime.</p>
          </>
        )}
      </div>
    </div>
  );
}

/** Keeps the page's real layout visible (blurred, inert) behind an unlock card. */
export function LockedFeature({ feature, reason }: { feature: Feature; reason: LockReason }) {
  const info = copy[feature];
  const overlay = (preview: ReactNode) => (
    <div className="relative h-full min-h-[560px]">
      <div aria-hidden inert className="pointer-events-none h-full opacity-60 blur-[3px] select-none">
        {preview}
      </div>
      <div className="absolute inset-0 flex items-start justify-center bg-gradient-to-b from-canvas/30 via-canvas/60 to-canvas/80 px-4 pt-16 sm:items-center sm:pt-0">
        <UnlockCard feature={info} reason={reason} />
      </div>
    </div>
  );

  if (info.preview === "inbox") return overlay(<InboxPreview />);
  return (
    <PageContainer>
      <PageHeader title={info.title} description={info.description} />
      {overlay(<PagePreview kind={info.preview} />)}
    </PageContainer>
  );
}
