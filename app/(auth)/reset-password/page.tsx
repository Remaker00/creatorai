import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { ButtonLink } from "@/components/ui/button";

// The token is in the URL; never send it onward in a Referer header.
export const metadata: Metadata = { title: "Reset password", referrer: "no-referrer" };

export default async function ResetPasswordPage({ searchParams }: PageProps<"/reset-password">) {
  const { token } = await searchParams;
  if (typeof token !== "string" || !token) {
    return (
      <AuthCard title="Link missing" description="This page needs the reset link from your email.">
        <ButtonLink href="/forgot-password" variant="primary" className="w-full">
          Request a reset link
        </ButtonLink>
      </AuthCard>
    );
  }
  return <ResetPasswordForm token={token} />;
}
