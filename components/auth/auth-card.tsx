import type { ReactNode } from "react";
import Link from "next/link";
import { CircleAlert } from "lucide-react";
import { Logo } from "@/components/shell/logo";
import { Card } from "@/components/ui/card";

/** Single card: brand, heading, form and the alternate-action link all live inside it. */
export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <Card className="overflow-hidden shadow-xl shadow-black/5">
      <div className="p-6 sm:p-8">
        <Link href="/" aria-label="CreatorAI home" className="inline-flex">
          <Logo />
        </Link>
        <h1 className="mt-6 text-xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-fg-muted">{description}</p>
        <div className="mt-6">{children}</div>
      </div>
      {footer && (
        <p className="border-t border-line bg-surface-2/50 px-6 py-4 text-center text-sm text-fg-muted sm:px-8">
          {footer}
        </p>
      )}
    </Card>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger"
    >
      <CircleAlert className="mt-0.5 size-4 shrink-0" />
      {message}
    </p>
  );
}
