"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { ApiError, authService } from "@/lib/services";
import { AuthCard, FormError } from "./auth-card";

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      await authService.resetPassword({ token, password });
      router.replace("/");
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Network error — try again.");
      setPending(false);
    }
  }

  return (
    <AuthCard
      title="Set a new password"
      description="Choose a new password. You'll be signed out on all other devices."
      footer={
        <Link href="/forgot-password" className="font-medium text-accent-strong hover:underline">
          Request a new link
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Field label="New password" htmlFor="password" hint="At least 8 characters.">
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            autoFocus
            minLength={8}
            maxLength={128}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Field label="Confirm password" htmlFor="confirm">
          <Input
            id="confirm"
            type="password"
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </Field>
        <FormError message={error} />
        <Button type="submit" variant="primary" className="w-full" loading={pending} disabled={!password || !confirm}>
          Update password
        </Button>
      </form>
    </AuthCard>
  );
}
