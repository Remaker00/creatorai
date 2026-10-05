import { cn, initials } from "@/lib/utils";

interface AvatarProps {
  name: string;
  hue: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "size-7 text-[10px]",
  md: "size-9 text-xs",
  lg: "size-12 text-sm",
};

export function Avatar({ name, hue, size = "md", className }: AvatarProps) {
  return (
    <span
      aria-hidden
      className={cn("inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white/90", sizes[size], className)}
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 55% 42%), hsl(${(hue + 40) % 360} 50% 28%))`,
      }}
    >
      {initials(name)}
    </span>
  );
}
