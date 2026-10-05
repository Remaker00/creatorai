type ClassValue = string | false | null | undefined;

export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}

export function omitKey<T>(record: Record<string, T>, key: string): Record<string, T> {
  const next = { ...record };
  delete next[key];
  return next;
}

const compactFormatter = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
const numberFormatter = new Intl.NumberFormat("en");

export function formatCompact(value: number): string {
  return compactFormatter.format(value);
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatRelativeTime(iso: string, now: number = Date.now()): string {
  const diffMinutes = Math.max(0, Math.round((now - new Date(iso).getTime()) / 60_000));
  if (diffMinutes < 1) return "now";
  if (diffMinutes < 60) return `${diffMinutes}m`;
  const hours = Math.round(diffMinutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(iso).toLocaleDateString("en", { month: "short", day: "numeric" });
}

export function formatTimeAgo(iso: string): string {
  const relative = formatRelativeTime(iso);
  if (relative === "now") return "just now";
  return /^\d+[mhd]$/.test(relative) ? `${relative} ago` : `on ${relative}`;
}

export function formatClockTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en", { hour: "numeric", minute: "2-digit" });
}

export function formatShortDate(isoDate: string): string {
  if (isoDate === new Date().toISOString().slice(0, 10)) return "Today";
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString("en", { month: "short", day: "numeric" });
}

export function initials(name: string): string {
  return name
    .split(/[\s._]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
