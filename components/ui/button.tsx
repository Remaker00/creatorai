import type { ComponentProps } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "ai";
type Size = "sm" | "md" | "icon";

const variants: Record<Variant, string> = {
  primary: "bg-fg text-canvas hover:bg-fg/85",
  secondary: "border border-line-strong bg-surface-2 text-fg hover:bg-surface-3",
  ghost: "text-fg-muted hover:bg-surface-2 hover:text-fg",
  danger: "border border-danger/30 bg-danger/10 text-danger hover:bg-danger/15",
  ai: "bg-accent text-white shadow-[0_0_0_1px_rgb(139_124_255/0.5),0_6px_20px_-6px_rgb(139_124_255/0.6)] hover:bg-accent-strong",
};

const sizes: Record<Size, string> = {
  sm: "h-7 gap-1.5 rounded-md px-2.5 text-xs",
  md: "h-9 gap-2 rounded-lg px-3.5 text-sm",
  icon: "size-8 rounded-lg",
};

const base =
  "inline-flex shrink-0 items-center justify-center font-medium whitespace-nowrap transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export function Button({
  variant = "secondary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" />}
      {children}
    </button>
  );
}

/** For plain `<a>` elements that must do a full navigation (e.g. OAuth redirects through /api). */
export function buttonClasses({ variant = "secondary", size = "md" }: { variant?: Variant; size?: Size } = {}): string {
  return cn(base, variants[variant], sizes[size]);
}

interface ButtonLinkProps extends ComponentProps<typeof Link> {
  variant?: Variant;
  size?: Size;
}

export function ButtonLink({ variant = "secondary", size = "md", className, ...props }: ButtonLinkProps) {
  return <Link className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}
