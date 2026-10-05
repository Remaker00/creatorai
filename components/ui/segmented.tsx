import { cn } from "@/lib/utils";

interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  count?: number;
}

interface SegmentedProps<T extends string> {
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
  label: string;
  className?: string;
}

export function Segmented<T extends string>({ value, options, onChange, label, className }: SegmentedProps<T>) {
  return (
    <div role="tablist" aria-label={label} className={cn("inline-flex rounded-lg bg-surface-2 p-0.5 ring-1 ring-line", className)}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium whitespace-nowrap transition-colors",
              active ? "bg-surface-3 text-fg shadow-sm ring-1 ring-line-strong" : "text-fg-subtle hover:text-fg-muted",
            )}
          >
            {option.label}
            {option.count !== undefined && option.count > 0 && (
              <span className={cn("tabular-nums", active ? "text-fg-muted" : "text-fg-subtle")}>{option.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
