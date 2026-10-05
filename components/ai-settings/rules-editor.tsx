"use client";

import { useState } from "react";
import { Plus, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import type { AiRule } from "@/lib/types";

interface RulesEditorProps {
  rules: AiRule[];
  onChange: (rules: AiRule[]) => void;
}

export function RulesEditor({ rules, onChange }: RulesEditorProps) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const text = draft.trim();
    if (!text) return;
    onChange([...rules, { id: `r_${Date.now().toString(36)}`, text }]);
    setDraft("");
  };

  return (
    <div className="space-y-3">
      <ol className="space-y-1.5">
        {rules.map((rule, index) => (
          <li
            key={rule.id}
            className="group flex animate-fade-in items-start gap-3 rounded-lg border border-line bg-surface-2/50 px-3 py-2.5"
          >
            <span className="mt-0.5 font-mono text-[11px] text-fg-subtle">{String(index + 1).padStart(2, "0")}</span>
            <p className="flex-1 text-sm text-fg-muted">{rule.text}</p>
            <button
              type="button"
              onClick={() => onChange(rules.filter((r) => r.id !== rule.id))}
              className="rounded p-1 text-fg-subtle opacity-100 transition-opacity hover:bg-danger/10 hover:text-danger sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
              aria-label="Remove rule"
            >
              <Trash2 className="size-3.5" />
            </button>
          </li>
        ))}
        {rules.length === 0 && (
          <li className="flex items-center gap-2 rounded-lg border border-dashed border-line px-3 py-4 text-xs text-fg-subtle">
            <ShieldCheck className="size-4" /> No rules yet. CreatorAI will rely on your writing style only.
          </li>
        )}
      </ol>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
      >
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="e.g. Never promise a reply time shorter than 24 hours"
          aria-label="New AI rule"
        />
        <Button type="submit" disabled={!draft.trim()}>
          <Plus /> Add rule
        </Button>
      </form>
    </div>
  );
}
