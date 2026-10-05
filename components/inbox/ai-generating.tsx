"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const STEPS = ["Reading the conversation", "Checking your knowledge & rules", "Writing in your voice"];

export function AiGenerating() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 320);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-3" role="status" aria-live="polite">
      <div className="flex items-center gap-2 text-xs">
        <span className="relative flex size-5 items-center justify-center rounded-md bg-accent/20">
          <Sparkles className="size-3 animate-pulse text-accent-strong" />
        </span>
        <span className="font-medium text-fg">CreatorAI is drafting a reply</span>
        <span className="text-fg-subtle">· {STEPS[step]}…</span>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-[92%]" />
        <Skeleton className="h-3 w-[84%]" />
        <Skeleton className="h-3 w-[58%]" />
      </div>
    </div>
  );
}
