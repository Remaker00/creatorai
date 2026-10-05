import type { ReactNode } from "react";
import { BadgeCheck, CalendarDays, MapPin, Users } from "lucide-react";
import { IntentBadge } from "@/components/status-badges";
import { Avatar } from "@/components/ui/avatar";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import type { Conversation, Intent, Sentiment } from "@/lib/types";
import { formatCompact, formatTimeAgo } from "@/lib/utils";

const sentimentTone: Record<Sentiment, BadgeTone> = {
  positive: "success",
  neutral: "neutral",
  negative: "danger",
};

const nextStep: Record<Intent, string> = {
  collaboration: "Potential paid partnership. Route to your business email and check the brand's audience fit.",
  pricing: "Rate request. Your rules say not to share rates over DM.",
  product_question: "Answer from your knowledge base. Good candidate for auto-reply.",
  shipping: "Order issue. Confirm the order number and loop in fulfilment.",
  complaint: "Unhappy customer. Respond personally and resolve quickly.",
  fan_message: "Fan message. A short, personal thank-you goes a long way.",
  spam: "Likely spam. Safe to resolve without replying.",
  general: "General question. Reply when you have a moment.",
};

function Row({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-center gap-2.5 text-xs text-fg-muted [&_svg]:size-3.5 [&_svg]:text-fg-subtle">
      {icon}
      {children}
    </li>
  );
}

export function ContactPanel({ conversation }: { conversation: Conversation }) {
  const { contact } = conversation;
  const aiReplies = conversation.messages.filter((m) => m.author === "ai").length;

  return (
    <div className="h-full space-y-6 overflow-y-auto p-5">
      <div className="flex flex-col items-center text-center">
        <Avatar name={contact.name} hue={contact.avatarHue} size="lg" />
        <p className="mt-3 flex items-center gap-1 text-sm font-semibold">
          {contact.name}
          {contact.verified && <BadgeCheck className="size-4 text-info" />}
        </p>
        <p className="text-xs text-fg-subtle">@{contact.handle}</p>
      </div>

      <ul className="space-y-2.5">
        <Row icon={<Users />}>{formatCompact(contact.followers)} followers</Row>
        {contact.location && <Row icon={<MapPin />}>{contact.location}</Row>}
        <Row icon={<CalendarDays />}>First message {formatTimeAgo(contact.firstSeenAt)}</Row>
      </ul>

      <section className="space-y-3 rounded-xl border border-line bg-surface-2/50 p-4">
        <p className="text-[11px] font-medium tracking-wide text-fg-subtle uppercase">AI insights</p>
        <div className="flex flex-wrap gap-1.5">
          <IntentBadge intent={conversation.intent} />
          <Badge tone={sentimentTone[conversation.sentiment]} className="capitalize">
            {conversation.sentiment}
          </Badge>
          {contact.followers > 10_000 && <Badge tone="accent">High-value contact</Badge>}
        </div>
        <p className="text-xs leading-relaxed text-fg-muted">{nextStep[conversation.intent]}</p>
      </section>

      <section className="space-y-2">
        <p className="text-[11px] font-medium tracking-wide text-fg-subtle uppercase">Conversation</p>
        <dl className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg bg-surface-2/50 p-2.5">
            <dt className="text-fg-subtle">Messages</dt>
            <dd className="mt-0.5 font-medium tabular-nums">{conversation.messages.length}</dd>
          </div>
          <div className="rounded-lg bg-surface-2/50 p-2.5">
            <dt className="text-fg-subtle">AI replies</dt>
            <dd className="mt-0.5 font-medium tabular-nums">{aiReplies}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
