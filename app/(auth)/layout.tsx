import Link from "next/link";
import { LogoMark } from "@/components/shell/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center px-4 py-10 sm:justify-center">
      <div className="absolute top-3 right-3">
        <ThemeToggle />
      </div>
      <Link href="/" className="mb-8 flex items-center gap-2.5">
        <LogoMark />
        <span className="text-[15px] font-semibold tracking-tight">CreatorAI</span>
      </Link>
      <div className="w-full max-w-sm animate-fade-in">{children}</div>
    </div>
  );
}
