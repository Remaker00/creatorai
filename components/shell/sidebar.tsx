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
  MessageCircle,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";
import { UserMenu } from "@/components/account/user-menu";
import { PlatformIcon } from "@/components/platform-icon";
import { Avatar } from "@/components/ui/avatar";
import { LogoMark } from "./logo";
import { useWorkspace } from "@/lib/store/workspace";
import type { AuthState } from "@/lib/types";
import { cn, formatCompact } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  count?: number;
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
      <span className="flex-1">{item.label}</span>
      {item.count !== undefined && item.count > 0 && (
        <span className="rounded-md bg-surface-3 px-1.5 text-[11px] text-fg-muted tabular-nums ring-1 ring-line-strong">
          {item.count}
        </span>
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

  const primary: NavItem[] = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    auth.workspace.instagramConnected
      ? { href: "/inbox", label: "Inbox", icon: Inbox, count: unread }
      : { href: "/onboarding", label: "Inbox", icon: Lock },
    { href: "/comments", label: "Comments", icon: MessageCircle, count: pendingComments },
    { href: "/automations", label: "Automations", icon: Bot },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
  ];
  const configure: NavItem[] = [
    { href: "/ai-settings", label: "AI Settings", icon: SlidersHorizontal },
    { href: "/accounts", label: "Connected Accounts", icon: Link2 },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center gap-2.5 px-4">
        <LogoMark />
        <span className="text-[15px] font-semibold tracking-tight">CreatorAI</span>
      </div>

      {account && (
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
        <UserMenu auth={auth} variant="sidebar" />
      </div>
    </div>
  );
}
