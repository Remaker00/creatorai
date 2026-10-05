import type { Platform } from "@/lib/types";
import { cn } from "@/lib/utils";

export const platformLabels: Record<Platform, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
  x: "X",
};

/** Only Instagram is live in V1; other platforms fall back to a neutral glyph. */
export function PlatformIcon({ platform, className }: { platform: Platform; className?: string }) {
  if (platform !== "instagram") {
    return <span className={cn("inline-block size-3.5 rounded-sm bg-fg-subtle", className)} aria-label={platformLabels[platform]} />;
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cn("size-3.5", className)} aria-label="Instagram">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}
