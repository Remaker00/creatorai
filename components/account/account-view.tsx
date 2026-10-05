"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleCheck, Link2, LogOut } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/shell/page-header";
import { ThemeSwitch } from "@/components/theme/theme-toggle";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { plans } from "@/lib/plans";
import { authService } from "@/lib/services";
import type { AuthState } from "@/lib/types";

const roleLabels = { owner: "Owner", admin: "Admin", member: "Member" } as const;

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-5 py-3.5 text-sm first:border-t-0">
      <span className="text-fg-muted">{label}</span>
      <span className="flex items-center gap-2">{children}</span>
    </div>
  );
}

export function AccountView({ auth }: { auth: AuthState }) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const { user, workspace } = auth;
  const plan = plans.find((p) => p.id === workspace.plan);

  async function signOut() {
    setSigningOut(true);
    try {
      await authService.logout();
    } finally {
      router.replace("/");
      router.refresh();
    }
  }

  return (
    <PageContainer>
      <PageHeader title="Account" description="Your profile, workspace and preferences." />

      <Card>
        <div className="flex items-center gap-4 p-5">
          <Avatar name={user.name} hue={262} size="lg" />
          <div className="min-w-0">
            <p className="truncate text-base font-semibold">{user.name}</p>
            <p className="truncate text-sm text-fg-subtle">{user.email}</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Workspace" description="Everything in CreatorAI is scoped to this workspace." />
          <div className="pb-1">
            <Row label="Name">{workspace.name}</Row>
            <Row label="Your role">
              <Badge>{roleLabels[workspace.role]}</Badge>
            </Row>
            <Row label="Plan">
              <Badge tone="accent">{plan ? `${plan.name} plan` : "None"}</Badge>
              <ButtonLink href="/pricing" size="sm" variant="ghost">
                View plans
              </ButtonLink>
            </Row>
            <Row label="Instagram">
              {workspace.instagramConnected ? (
                <Badge tone="success">
                  <CircleCheck /> Connected
                </Badge>
              ) : (
                <ButtonLink href="/onboarding" size="sm" variant="ai">
                  <Link2 /> Connect
                </ButtonLink>
              )}
              <ButtonLink href="/accounts" size="sm" variant="ghost">
                Manage
              </ButtonLink>
            </Row>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Appearance" description="Saved on this device." />
            <label className="flex items-center justify-between gap-4 border-t border-line px-5 py-4">
              <span>
                <span className="block text-sm font-medium">Dark mode</span>
                <span className="block text-xs text-fg-subtle">Switch between the light and dark theme</span>
              </span>
              <ThemeSwitch />
            </label>
          </Card>

          <Card>
            <CardHeader title="Session" description="Sessions last 30 days and renew while you stay active." />
            <div className="border-t border-line px-5 py-4">
              <Button variant="danger" onClick={signOut} loading={signingOut}>
                {!signingOut && <LogOut />} Log out
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
