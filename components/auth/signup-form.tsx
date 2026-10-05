"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { authService } from "@/lib/services";
import { cn } from "@/lib/utils";
import { AuthCard, FormError } from "./auth-card";
import { useSubmit } from "./use-submit";

export function SignupForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { pending, error, run } = useSubmit();
  const router = useRouter();
  const set = (key: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const invalid = (field: string) => cn(error?.field === field && "border-danger/60 focus:border-danger/60 focus:ring-danger/20");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void run(async () => {
      await authService.signup(form);
      router.replace("/");
      router.refresh();
    });
  }

  return (
    <AuthCard
      title="Create your account"
      description="Let AI handle your DMs and comments in your voice."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-accent-strong hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Field label="Name" htmlFor="name">
          <Input id="name" autoComplete="name" required autoFocus maxLength={80} value={form.name} onChange={set("name")} className={invalid("name")} />
        </Field>
        <Field label="Email" htmlFor="email">
          <Input id="email" type="email" autoComplete="email" required value={form.email} onChange={set("email")} className={invalid("email")} />
        </Field>
        <Field label="Password" htmlFor="password" hint="At least 8 characters.">
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            maxLength={128}
            value={form.password}
            onChange={set("password")}
            className={invalid("password")}
          />
        </Field>
        <FormError message={error?.message ?? null} />
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          loading={pending}
          disabled={!form.name || !form.email || !form.password}
        >
          Create account
        </Button>
      </form>
    </AuthCard>
  );
}
