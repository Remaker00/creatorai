"use client";

import { LayoutDashboard, Menu as MenuIcon } from "lucide-react";
import { Menu, MenuLink, MenuSeparator } from "@/components/ui/menu";

/** Site links collapse into a menu below the md breakpoint. */
export function MobileSiteNav({ links, signedIn }: { links: { href: string; label: string }[]; signedIn: boolean }) {
  return (
    <div className="md:hidden">
      <Menu
        className="w-52"
        trigger={(props) => (
          <button
            type="button"
            {...props}
            aria-label="Open site menu"
            className="flex size-8 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
          >
            <MenuIcon className="size-4" />
          </button>
        )}
      >
        {links.map((link) => (
          <MenuLink key={link.href} href={link.href}>
            {link.label}
          </MenuLink>
        ))}
        {signedIn && (
          <>
            <MenuSeparator />
            <MenuLink href="/dashboard">
              <LayoutDashboard /> Dashboard
            </MenuLink>
          </>
        )}
      </Menu>
    </div>
  );
}
