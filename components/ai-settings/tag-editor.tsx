"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { cn } from "@/lib/utils";

interface TagEditorProps {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
  label: string;
  tone?: "neutral" | "danger";
}

export function TagEditor({ values, onChange, placeholder, label, tone = "neutral" }: TagEditorProps) {
  const [draft, setDraft] = useState("");
  const value = draft.trim();
  const duplicate = values.some((v) => v.toLowerCase() === value.toLowerCase());

  const add = () => {
    if (!value || duplicate) return;
    onChange([...values, value]);
    setDraft("");
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {values.map((tag) => (
          <span
            key={tag}
            className={cn(
              "inline-flex animate-fade-in items-center gap-1 rounded-md py-1 pr-1 pl-2.5 text-xs ring-1 ring-inset",
              tone === "danger" ? "bg-danger/10 text-danger ring-danger/20" : "bg-surface-3 text-fg-muted ring-line-strong",
            )}
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(values.filter((v) => v !== tag))}
              className="rounded p-0.5 opacity-60 hover:bg-fg/10 hover:opacity-100"
              aria-label={`Remove ${tag}`}
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        {values.length === 0 && <span className="text-xs text-fg-subtle">Nothing added yet.</span>}
      </div>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
      >
        <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={placeholder} aria-label={label} />
        <Button type="submit" disabled={!value || duplicate}>
          <Plus /> Add
        </Button>
      </form>
    </div>
  );
}
