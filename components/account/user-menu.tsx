"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronsUpDown, LayoutDashboard, Link2, LogOut, Moon, SlidersHorizontal, UserRound } from "lucide-react";
import { ThemeSwitch } from "@/components/theme/theme-toggle";
import { Avatar } from "@/components/ui/avatar";
import { Menu, MenuButton, MenuLink, MenuSeparator } from "@/components/ui/menu";
import { plans } from "@/lib/plans";
import { authService } from "@/lib/services";
import type { AuthState } from "@/lib/types";

interface UserMenuProps {
  auth: AuthState;
  /** `sidebar`: full-width row with name, opens upward. `compact`: avatar only, opens downward. */
  variant?: "sidebar" | "compact";
}

export function UserMenu({ auth, variant = "compact" }: UserMenuProps) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const { user, workspace } = auth;
  const planName = plans.find((p) => p.id === workspace.plan)?.name;

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
    <Menu
      side={variant === "sidebar" ? "top" : "bottom"}
      align={variant === "sidebar" ? "start" : "end"}
      className={variant === "sidebar" ? "w-full" : undefined}
      trigger={(props) =>
        variant === "sidebar" ? (
          <button
            type="button"
            {...props}
            aria-label="Account menu"
            className="flex w-full items-center gap-2.5 rounded-lg px-1 py-1 text-left transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-accent"
          >
            <Avatar name={user.name} hue={262} size="sm" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-medium">{user.name}</span>
              <span className="block truncate text-[11px] text-fg-subtle">{user.email}</span>
            </span>
            <ChevronsUpDown className="size-4 text-fg-subtle" />
          </button>
        ) : (
          <button
            type="button"
            {...props}
            aria-label="Account menu"
            className="rounded-full transition-shadow hover:ring-2 hover:ring-line-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Avatar name={user.name} hue={262} size="sm" />
          </button>
        )
      }
    >
      <div className="flex items-center gap-2.5 px-2.5 py-2">
        <Avatar name={user.name} hue={262} size="md" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-fg-subtle">{user.email}</p>
          <p className="mt-0.5 truncate text-[11px] text-fg-subtle">
            {workspace.name}
            {planName && ` · ${planName} plan`}
          </p>
        </div>
      </div>
      <MenuSeparator />
      <MenuLink href="/dashboard">
        <LayoutDashboard /> Dashboard
      </MenuLink>
      <MenuLink href="/account">
        <UserRound /> Account & profile
      </MenuLink>
      <MenuLink href="/ai-settings">
        <SlidersHorizontal /> AI settings
      </MenuLink>
      <MenuLink href="/accounts">
        <Link2 /> Connected accounts
      </MenuLink>
      <MenuSeparator />
      <div className="flex h-8 items-center gap-2.5 px-2.5 text-[13px] text-fg-muted">
        <Moon className="size-4 text-fg-subtle" />
        <span className="flex-1">Dark mode</span>
        <ThemeSwitch />
      </div>
      <MenuSeparator />
      <MenuButton onSelect={signOut} className="hover:text-danger focus-visible:text-danger">
        <LogOut /> {signingOut ? "Logging out…" : "Log out"}
      </MenuButton>
    </Menu>
  );
}
