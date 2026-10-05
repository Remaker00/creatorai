import type { Metadata } from "next";
import { Eye, HeartHandshake, Lock, MessageCircleHeart, Rocket, ShieldCheck } from "lucide-react";
import { CtaBand, PageHero, Section, SectionHeading } from "@/components/marketing/sections";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "About", description: "Why we're building CreatorAI." };

const values = [
  {
    icon: MessageCircleHeart,
    title: "Your voice, always",
    body: "AI should sound like you on a good day — never like a template. You decide the tone, the facts and the limits.",
  },
  {
    icon: Eye,
    title: "Transparent by default",
    body: "Every draft shows why it was written and how confident the AI is. No black boxes in your inbox.",
  },
  {
    icon: ShieldCheck,
    title: "Safe with your audience",
    body: "Your workspace is isolated, your data is never used to train models, and nothing is sent without your rules allowing it.",
  },
];

const roadmap = [
  { icon: Rocket, title: "Now", body: "AI inbox, comments, automations and analytics for Instagram." },
  { icon: Lock, title: "Next", body: "Live Instagram sync, paid plans for higher volume, and team seats." },
  { icon: HeartHandshake, title: "Later", body: "More platforms — YouTube, TikTok and X — in the same inbox." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        badge="About"
        title="We're giving creators their time back"
        body="CreatorAI started with a simple observation: the more your audience grows, the more of your day disappears into your inbox."
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Our story"
            title="Messages are the best part of being a creator — until there are thousands"
          />
          <div className="space-y-4 text-fg-muted">
            <p>
              Brand deals hide between fan messages. The same five questions arrive fifty times a day. Replying to
              everyone feels impossible, and leaving people on read feels worse.
            </p>
            <p>
              We built CreatorAI so every message gets a thoughtful answer in your voice, the important ones get your
              attention first, and you get your evenings back. AI does the drafting; you stay in charge of what goes
              out.
            </p>
          </div>
        </div>
      </Section>

      <Section className="border-y border-line bg-surface/40">
        <SectionHeading center eyebrow="What we believe" title="Principles we build by" />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {values.map(({ icon: Icon, title, body }) => (
            <Card key={title} className="p-6">
              <span className="flex size-9 items-center justify-center rounded-lg bg-accent-soft text-accent-strong">
                <Icon className="size-4" />
              </span>
              <h3 className="mt-4 font-medium">{title}</h3>
              <p className="mt-1 text-sm text-fg-muted">{body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Where we're going" title="Roadmap" />
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {roadmap.map(({ icon: Icon, title, body }, i) => (
            <li key={title} className="relative rounded-card border border-line p-5">
              <span className="flex items-center gap-2 text-xs font-medium tracking-wide text-accent-strong uppercase">
                <Icon className="size-4" /> {title}
              </span>
              <p className="mt-2 text-sm text-fg-muted">{body}</p>
              {i === 0 && <span className="absolute top-4 right-4 size-2 animate-ping rounded-full bg-accent" />}
            </li>
          ))}
        </ol>
      </Section>

      <CtaBand title="Come build your inbox with us" />
    </>
  );
}
