"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const MenuContext = createContext<() => void>(() => {});

interface MenuProps {
  /** Renders the trigger; spread `props` onto a <button>. */
  trigger: (props: { onClick: () => void; "aria-expanded": boolean; "aria-haspopup": "menu"; "aria-controls": string }) => ReactNode;
  side?: "top" | "bottom";
  align?: "start" | "end";
  className?: string;
  children: ReactNode;
}

/** Dropdown menu: closes on outside click, Escape and item selection; arrow keys move focus. */
export function Menu({ trigger, side = "bottom", align = "end", className, children }: MenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const items = () => Array.from(panelRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
    items()[0]?.focus();

    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        rootRef.current?.querySelector<HTMLElement>("[aria-haspopup]")?.focus();
      } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const list = items();
        const i = list.indexOf(document.activeElement as HTMLElement);
        list[(i + (e.key === "ArrowDown" ? 1 : -1) + list.length) % list.length]?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      {trigger({ onClick: () => setOpen((o) => !o), "aria-expanded": open, "aria-haspopup": "menu", "aria-controls": id })}
      {open && (
        <MenuContext value={() => setOpen(false)}>
          <div
            ref={panelRef}
            id={id}
            role="menu"
            className={cn(
              "absolute z-50 w-64 animate-fade-in rounded-xl border border-line-strong bg-surface-2 p-1 shadow-xl shadow-black/20",
              side === "bottom" ? "top-full mt-2" : "bottom-full mb-2",
              align === "end" ? "right-0" : "left-0",
              className,
            )}
          >
            {children}
          </div>
        </MenuContext>
      )}
    </div>
  );
}

const itemClass =
  "flex h-8 w-full items-center gap-2.5 rounded-lg px-2.5 text-left text-[13px] text-fg-muted outline-none transition-colors hover:bg-surface-3 hover:text-fg focus-visible:bg-surface-3 focus-visible:text-fg [&_svg]:size-4 [&_svg]:text-fg-subtle";

export function MenuLink({ href, children }: { href: string; children: ReactNode }) {
  const close = useContext(MenuContext);
  return (
    <Link href={href} role="menuitem" tabIndex={-1} onClick={close} className={itemClass}>
      {children}
    </Link>
  );
}

export function MenuButton({ onSelect, children, className }: { onSelect: () => void; children: ReactNode; className?: string }) {
  const close = useContext(MenuContext);
  return (
    <button
      type="button"
      role="menuitem"
      tabIndex={-1}
      onClick={() => {
        close();
        onSelect();
      }}
      className={cn(itemClass, className)}
    >
      {children}
    </button>
  );
}

export function MenuSeparator() {
  return <div role="separator" className="my-1 h-px bg-line" />;
}
