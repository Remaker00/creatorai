import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { UserMenu } from "@/components/account/user-menu";
import { Logo } from "@/components/shell/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ButtonLink } from "@/components/ui/button";
import { getAuth } from "@/lib/server/auth/session";
import { MobileSiteNav } from "./mobile-site-nav";

export const siteLinks = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

/** Reads the session (server-side), so signed-in visitors see their account instead of Start Now. */
export async function SiteHeader() {
  const auth = await getAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" aria-label="CreatorAI home">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-fg-muted md:flex" aria-label="Site">
          {siteLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-fg">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          {auth ? (
            <>
              <ButtonLink href="/dashboard" variant="secondary" className="hidden sm:inline-flex">
                Dashboard <ArrowRight />
              </ButtonLink>
              <UserMenu auth={auth.state} />
            </>
          ) : (
            <ButtonLink href="/signup" variant="ai">
              Start Now <ArrowRight />
            </ButtonLink>
          )}
          <MobileSiteNav links={siteLinks} signedIn={Boolean(auth)} />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-8 text-xs text-fg-subtle sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} CreatorAI. All rights reserved.</p>
        <p>Made for creators who&apos;d rather be creating.</p>
      </div>
    </footer>
  );
}
