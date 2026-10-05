import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { UserMenu } from "@/components/account/user-menu";
import { LogoMark } from "@/components/shell/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ButtonLink } from "@/components/ui/button";
import { nextStepPath } from "@/lib/auth-flow";
import { getAuth } from "@/lib/server/auth/session";

/** Reads the session (server-side), so signed-in visitors see their account instead of Log in / Start Now. */
export async function SiteHeader() {
  const auth = await getAuth();
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="text-[15px] font-semibold tracking-tight">CreatorAI</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-fg-muted sm:flex" aria-label="Site">
          <Link href="/#features" className="hover:text-fg">
            Features
          </Link>
          <Link href="/pricing" className="hover:text-fg">
            Pricing
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          {auth ? (
            <>
              <ButtonLink href={nextStepPath(auth.state.workspace)} variant="secondary">
                Dashboard <ArrowRight />
              </ButtonLink>
              <UserMenu auth={auth.state} />
            </>
          ) : (
            <>
              <ButtonLink href="/login" variant="ghost" className="hidden sm:inline-flex">
                Log in
              </ButtonLink>
              <ButtonLink href="/signup" variant="ai">
                Start Now <ArrowRight />
              </ButtonLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-xs text-fg-subtle sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} CreatorAI</p>
        <nav className="flex gap-4" aria-label="Footer">
          <Link href="/pricing" className="hover:text-fg-muted">
            Pricing
          </Link>
          <Link href="/#features" className="hover:text-fg-muted">
            Features
          </Link>
        </nav>
      </div>
    </footer>
  );
}
