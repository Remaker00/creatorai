"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bot,
  Inbox,
  LayoutDashboard,
  Link2,
  Lock,
  Sparkles,
  MessageCircle,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";
import { UserMenu } from "@/components/account/user-menu";
import { PlatformIcon } from "@/components/platform-icon";
import { Avatar } from "@/components/ui/avatar";
import { Logo } from "./logo";
import { lockReason, type Feature } from "@/lib/feature-access";
import { useWorkspace } from "@/lib/store/workspace";
import type { AuthState } from "@/lib/types";
import { cn, formatCompact } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  feature: Feature;
  count?: number;
  locked?: boolean;
}

function NavLink({ item, active, onNavigate }: { item: NavItem; active: boolean; onNavigate?: () => void }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex h-8 items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-medium transition-colors",
        active ? "bg-surface-3 text-fg" : "text-fg-muted hover:bg-surface-2 hover:text-fg",
      )}
    >
      <Icon className={cn("size-4", active ? "text-accent-strong" : "text-fg-subtle group-hover:text-fg-muted")} />
      <span className={cn("flex-1", item.locked && !active && "text-fg-subtle")}>{item.label}</span>
      {item.locked ? (
        <Lock className="size-3.5 text-fg-subtle" aria-label="Locked" />
      ) : (
        item.count !== undefined &&
        item.count > 0 && (
          <span className="rounded-md bg-surface-3 px-1.5 text-[11px] text-fg-muted tabular-nums ring-1 ring-line-strong">
            {item.count}
          </span>
        )
      )}
    </Link>
  );
}

export function Sidebar({ auth, onNavigate }: { auth: AuthState; onNavigate?: () => void }) {
  const pathname = usePathname();
  const { conversations, comments, automations, accounts } = useWorkspace();

  const unread = conversations.items.filter((c) => c.unread).length;
  const pendingComments = comments.items.filter((c) => c.status === "pending" || c.status === "suggested").length;
  const activeAutomations = automations.items.filter((a) => a.enabled).length;
  const account = accounts.items[0];

  const { workspace } = auth;
  const withLock = (items: NavItem[]) =>
    items.map((item) => ({ ...item, locked: lockReason(workspace, item.feature) !== null }));
  const primary = withLock([
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard, feature: "overview" },
    { href: "/inbox", label: "Inbox", icon: Inbox, feature: "inbox", count: unread },
    { href: "/comments", label: "Comments", icon: MessageCircle, feature: "comments", count: pendingComments },
    { href: "/automations", label: "Automations", icon: Bot, feature: "automations" },
    { href: "/analytics", label: "Analytics", icon: BarChart3, feature: "analytics" },
  ]);
  const configure = withLock([
    { href: "/ai-settings", label: "AI Settings", icon: SlidersHorizontal, feature: "aiSettings" },
    { href: "/accounts", label: "Connected Accounts", icon: Link2, feature: "accounts" },
  ]);
  // Bottom card: next setup step until everything is unlocked.
  const setup = !workspace.plan
    ? { href: "/pricing", title: "Unlock CreatorAI", body: "Choose a plan to activate the dashboard." }
    : !workspace.instagramConnected
      ? { href: "/onboarding", title: "Connect Instagram", body: "Link your account to unlock the Inbox." }
      : null;

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center px-4">
        <Link href="/" onClick={onNavigate} aria-label="CreatorAI home">
          <Logo />
        </Link>
      </div>

      {account && workspace.instagramConnected && (
        <div className="mx-3 mb-3 flex items-center gap-2.5 rounded-lg border border-line bg-surface-2/60 px-2.5 py-2">
          <Avatar name={account.displayName} hue={account.avatarHue} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium">@{account.handle}</p>
            <p className="flex items-center gap-1 text-[11px] text-fg-subtle">
              <PlatformIcon platform={account.platform} className="size-3" />
              {formatCompact(account.followers)} followers
            </p>
          </div>
        </div>
      )}

      <nav className="flex-1 space-y-5 overflow-y-auto px-3" aria-label="Main">
        <div className="space-y-0.5">
          {primary.map((item) => (
            <NavLink key={item.href} item={item} active={isActive(item.href)} onNavigate={onNavigate} />
          ))}
        </div>
        <div>
          <p className="mb-1.5 px-2.5 text-[11px] font-medium tracking-wide text-fg-subtle uppercase">Configure</p>
          <div className="space-y-0.5">
            {configure.map((item) => (
              <NavLink key={item.href} item={item} active={isActive(item.href)} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </nav>

      <div className="space-y-3 p-3">
        {setup ? (
          <Link
            href={setup.href}
            onClick={onNavigate}
            className="block rounded-xl border border-accent/30 bg-accent-soft p-3 transition-colors hover:border-accent/50"
          >
            <p className="flex items-center gap-2 text-xs font-medium text-fg">
              <Sparkles className="size-3.5 text-accent-strong" />
              {setup.title}
            </p>
            <p className="mt-1 text-[11px] text-fg-muted">{setup.body}</p>
            <p className="mt-2 text-[11px] font-medium text-accent-strong">Continue setup →</p>
          </Link>
        ) : (
          <Link
            href="/automations"
            onClick={onNavigate}
            className="block rounded-xl border border-accent/20 bg-accent-soft/60 p-3 transition-colors hover:border-accent/35"
          >
            <p className="flex items-center gap-2 text-xs font-medium text-fg">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              AI assistant active
            </p>
            <p className="mt-1 text-[11px] text-fg-muted">
              {automations.loaded ? `${activeAutomations} automations running` : "Loading automations…"}
            </p>
          </Link>
        )}
        <UserMenu auth={auth} variant="sidebar" />
      </div>
    </div>
  );
}
