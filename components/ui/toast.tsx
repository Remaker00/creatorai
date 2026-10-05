"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CircleAlert, CircleCheck, Sparkles } from "lucide-react";

type ToastTone = "success" | "info" | "ai";

interface Toast {
  id: number;
  tone: ToastTone;
  title: string;
  description?: string;
}

type Notify = (title: string, options?: { tone?: ToastTone; description?: string }) => void;

const ToastContext = createContext<Notify | null>(null);

const icons: Record<ToastTone, ReactNode> = {
  success: <CircleCheck className="size-4 text-success" />,
  info: <CircleAlert className="size-4 text-info" />,
  ai: <Sparkles className="size-4 text-accent-strong" />,
};

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback<Notify>((title, options) => {
    nextId += 1;
    const toast: Toast = { id: nextId, title, tone: options?.tone ?? "success", description: options?.description };
    setToasts((list) => [...list.slice(-2), toast]);
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== toast.id)), 3200);
  }, []);

  return (
    <ToastContext value={notify}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed right-4 bottom-4 z-[60] flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex animate-fade-in items-start gap-3 rounded-xl border border-line-strong bg-surface-2 px-3.5 py-3 shadow-xl shadow-black/40"
          >
            <span className="mt-0.5">{icons[toast.tone]}</span>
            <div className="min-w-0">
              <p className="text-sm font-medium">{toast.title}</p>
              {toast.description && <p className="mt-0.5 text-xs text-fg-subtle">{toast.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </ToastContext>
  );
}

export function useToast(): Notify {
  const notify = useContext(ToastContext);
  if (!notify) throw new Error("useToast must be used inside <ToastProvider>");
  return notify;
}
