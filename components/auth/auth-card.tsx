import type { ReactNode } from "react";
import { CircleAlert } from "lucide-react";
import { Card } from "@/components/ui/card";

export function AuthCard({ title, description, children, footer }: {
  title: string;
  description: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <>
      <Card className="p-6">
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-fg-muted">{description}</p>
        <div className="mt-6">{children}</div>
      </Card>
      {footer && <p className="mt-4 text-center text-sm text-fg-muted">{footer}</p>}
    </>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
      <CircleAlert className="mt-0.5 size-4 shrink-0" />
      {message}
    </p>
  );
}
