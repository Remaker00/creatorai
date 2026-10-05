import { cn } from "@/lib/utils";

/** Brand mark: chat bubble with an AI sparkle. Matches app/icon.svg (the favicon). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#a194ff] to-[#5641e0] shadow-[0_0_16px_-2px_rgb(139_124_255/0.6)]",
        className,
      )}
    >
      <svg viewBox="0 0 32 32" className="size-full" aria-hidden>
        <rect x="6.5" y="7" width="19" height="14" rx="4.5" fill="#fff" />
        <path d="M10 19.5v5.2c0 .5.6.8 1 .5l5.2-4.4z" fill="#fff" />
        <path d="M16 9.6c.5 2.6 1.4 3.5 4 4-2.6.5-3.5 1.4-4 4-.5-2.6-1.4-3.5-4-4 2.6-.5 3.5-1.4 4-4z" fill="#6d5cf0" />
        <path
          d="M21.2 8.6c.2.9.5 1.2 1.4 1.4-.9.2-1.2.5-1.4 1.4-.2-.9-.5-1.2-1.4-1.4.9-.2 1.2-.5 1.4-1.4z"
          fill="#a194ff"
        />
      </svg>
    </span>
  );
}

/** Mark + wordmark. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="text-[15px] font-semibold tracking-tight">
        Creator<span className="text-accent-strong">AI</span>
      </span>
    </span>
  );
}
