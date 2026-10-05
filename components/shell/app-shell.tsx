"use client";

import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToastProvider } from "@/components/ui/toast";
import { WorkspaceProvider } from "@/lib/store/workspace";
import type { AuthState } from "@/lib/types";
import { cn } from "@/lib/utils";
import { UserMenu } from "@/components/account/user-menu";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Sidebar } from "./sidebar";

export function AppShell({ auth, children }: { auth: AuthState; children: ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <ToastProvider>
      <WorkspaceProvider>
        <div className="flex h-dvh overflow-hidden">
          <aside className="hidden w-60 shrink-0 border-r border-line bg-surface/50 lg:block">
            <Sidebar auth={auth} />
          </aside>

          {/* Mobile navigation drawer */}
          <div className={cn("fixed inset-0 z-40 lg:hidden", mobileNavOpen ? "block" : "hidden")}>
            <div className="absolute inset-0 bg-black/60" onClick={() => setMobileNavOpen(false)} aria-hidden />
            <aside className="absolute inset-y-0 left-0 w-64 animate-fade-in border-r border-line bg-surface">
              <Sidebar auth={auth} onNavigate={() => setMobileNavOpen(false)} />
            </aside>
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex h-12 shrink-0 items-center gap-2 border-b border-line px-3 lg:hidden">
              <Button variant="ghost" size="icon" onClick={() => setMobileNavOpen((open) => !open)} aria-label="Toggle navigation">
                {mobileNavOpen ? <X /> : <Menu />}
              </Button>
              <span className="flex-1 text-sm font-semibold">CreatorAI</span>
              <ThemeToggle />
              <UserMenu auth={auth} />
            </div>
            <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
      </WorkspaceProvider>
    </ToastProvider>
  );
}
