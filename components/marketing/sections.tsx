import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { getAuth } from "@/lib/server/auth/session";
import { cn } from "@/lib/utils";

/** "Start Now" for visitors; signed-in users go straight to their dashboard instead of bouncing off /signup. */
export async function StartNowButton({ className }: { className?: string }) {
  const auth = await getAuth();
  return (
    <ButtonLink href={auth ? "/dashboard" : "/signup"} variant="ai" className={className}>
      {auth ? "Go to dashboard" : "Start Now"} <ArrowRight />
    </ButtonLink>
  );
}

export function Section({ id, className, children }: { id?: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={cn("scroll-mt-16", className)}>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  center?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center")}>
      {eyebrow && <p className="text-xs font-medium tracking-wide text-accent-strong uppercase">{eyebrow}</p>}
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">{title}</h2>
      {body && <p className="mt-3 text-fg-muted">{body}</p>}
    </div>
  );
}

export function PageHero({
  badge,
  title,
  body,
  children,
}: {
  badge: string;
  title: string;
  body: string;
  children?: ReactNode;
}) {
  return (
    <section className="bg-[radial-gradient(ellipse_at_top,var(--color-accent-soft),transparent_60%)]">
      <div className="mx-auto max-w-3xl px-4 pt-16 pb-8 text-center sm:px-6 sm:pt-24">
        <Badge tone="accent">{badge}</Badge>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-fg-muted">{body}</p>
        {children && <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>}
      </div>
    </section>
  );
}

export function CtaBand({
  title = "Ready to get your evenings back?",
  body = "Start on the Free plan today. No credit card required.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <Section>
      <div className="flex flex-col items-start gap-4 rounded-2xl border border-accent/25 bg-[linear-gradient(135deg,var(--color-accent-soft),transparent)] p-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-semibold tracking-tight">{title}</p>
          <p className="text-sm text-fg-muted">{body}</p>
        </div>
        <StartNowButton />
      </div>
    </Section>
  );
}
