"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { authService } from "@/lib/services";
import { AuthCard, FormError } from "./auth-card";
import { useSubmit } from "./use-submit";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState<{ devResetUrl?: string } | null>(null);
  const { pending, error, run } = useSubmit();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void run(async () => setSent(await authService.requestPasswordReset(email)));
  }

  const footer = (
    <>
      Remembered it?{" "}
      <Link href="/login" className="font-medium text-accent-strong hover:underline">
        Back to log in
      </Link>
    </>
  );

  if (sent) {
    return (
      <AuthCard
        title="Check your email"
        description={`If an account exists for ${email}, we've sent a link to reset your password. It expires in 30 minutes.`}
        footer={footer}
      >
        <div className="flex items-center gap-3 rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-success">
          <MailCheck className="size-4 shrink-0" /> Reset link sent
        </div>
        {sent.devResetUrl && (
          <div className="mt-4 rounded-lg border border-info/30 bg-info/10 p-3 text-xs text-info">
            <p className="font-medium">Development only — email isn&apos;t configured</p>
            <Link href={sent.devResetUrl.replace(/^https?:\/\/[^/]+/, "")} className="mt-1 block break-all underline">
              Open the reset link
            </Link>
          </div>
        )}
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgot your password?"
      description="Enter your account email and we'll send you a reset link."
      footer={footer}
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Field label="Email" htmlFor="email">
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <FormError message={error?.message ?? null} />
        <Button type="submit" variant="primary" className="w-full" loading={pending} disabled={!email}>
          Send reset link
        </Button>
      </form>
    </AuthCard>
  );
}
