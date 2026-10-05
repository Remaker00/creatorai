"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { nextStepPath } from "@/lib/auth-flow";
import { authService } from "@/lib/services";
import { AuthCard, FormError } from "./auth-card";
import { useSubmit } from "./use-submit";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { pending, error, run } = useSubmit();
  const router = useRouter();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void run(async () => {
      const { workspace } = await authService.login({ email, password });
      router.replace(nextStepPath(workspace));
      router.refresh();
    });
  }

  return (
    <AuthCard
      title="Welcome back"
      description="Log in to your CreatorAI workspace."
      footer={
        <>
          New to CreatorAI?{" "}
          <Link href="/signup" className="font-medium text-accent-strong hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Field label="Email" htmlFor="email">
          <Input id="email" type="email" autoComplete="email" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Password" htmlFor="password">
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <FormError message={error?.message ?? null} />
        <Button type="submit" variant="primary" className="w-full" loading={pending} disabled={!email || !password}>
          Log in
        </Button>
      </form>
    </AuthCard>
  );
}
