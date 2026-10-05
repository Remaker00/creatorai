import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Info } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonClasses } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { getAuth } from "@/lib/server/auth/session";
import { CALLBACK_PATH } from "@/lib/server/integrations/instagram/oauth-state";

export const metadata: Metadata = { title: "Authorize Instagram" };

/**
 * PLACEHOLDER for Instagram's own consent screen. With real OAuth, `instagramProvider.authorizeUrl`
 * points at instagram.com instead and this page is deleted. It always posts back to our fixed
 * callback (never a caller-supplied redirect_uri), carrying the CSRF `state` it was given.
 */
export default async function InstagramConsentPage({ searchParams }: PageProps<"/onboarding/instagram">) {
  const auth = await getAuth();
  if (!auth) redirect("/login");
  const { state } = await searchParams;
  if (typeof state !== "string" || !state) redirect("/onboarding");

  const cancel = `${CALLBACK_PATH}?${new URLSearchParams({ error: "access_denied", state })}`;

  return (
    <AuthCard
      title="Authorize CreatorAI"
      description={
        <>
          CreatorAI will be able to read and reply to messages and comments for{" "}
          <span className="text-fg">{auth.state.workspace.name}</span>.
        </>
      }
    >
      <p className="mb-4 flex items-start gap-2 rounded-lg border border-info/30 bg-info/10 px-3 py-2 text-xs text-info">
        <Info className="mt-0.5 size-3.5 shrink-0" />
        <span>
          <Badge tone="info" className="mr-1">
            Placeholder
          </Badge>
          Instagram login isn&apos;t live yet. Enter your Instagram username to simulate the connection.
        </span>
      </p>
      <form method="get" action={CALLBACK_PATH} className="space-y-4">
        <input type="hidden" name="state" value={state} />
        <Field label="Instagram username" htmlFor="code">
          <Input id="code" name="code" required autoFocus placeholder="yourhandle" pattern="@?[A-Za-z0-9._]{1,30}" autoComplete="off" />
        </Field>
        <div className="flex gap-2">
          <a href={cancel} className={buttonClasses({ variant: "ghost" })}>
            Cancel
          </a>
          <Button type="submit" variant="ai" className="flex-1">
            Authorize
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}
