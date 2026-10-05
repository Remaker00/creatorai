"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Select } from "@/components/ui/field";
import { Sheet } from "@/components/ui/sheet";
import type { Automation, AutomationConfig } from "@/lib/types";
import { cn } from "@/lib/utils";
import { delayOptions, lowConfidenceOptions, toneOptions } from "./labels";

interface AutomationConfigSheetProps {
  automation: Automation;
  onClose: () => void;
  onSave: (config: AutomationConfig) => Promise<void>;
}

function OptionCard({
  selected,
  onSelect,
  label,
  description,
  name,
}: {
  selected: boolean;
  onSelect: () => void;
  label: string;
  description: string;
  name: string;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors",
        selected ? "border-accent/50 bg-accent-soft" : "border-line hover:border-line-strong hover:bg-surface-2",
      )}
    >
      <input type="radio" name={name} checked={selected} onChange={onSelect} className="mt-0.5 accent-[var(--color-accent)]" />
      <span>
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-xs text-fg-subtle">{description}</span>
      </span>
    </label>
  );
}

export function AutomationConfigSheet({ automation, onClose, onSave }: AutomationConfigSheetProps) {
  const [config, setConfig] = useState<AutomationConfig>(automation.config);
  const [saving, setSaving] = useState(false);
  const dirty = JSON.stringify(config) !== JSON.stringify(automation.config);

  const set = <K extends keyof AutomationConfig>(key: K, value: AutomationConfig[K]) =>
    setConfig((c) => ({ ...c, [key]: value }));

  const save = async () => {
    setSaving(true);
    await onSave(config);
    setSaving(false);
    onClose();
  };

  return (
    <Sheet
      open
      onClose={onClose}
      title={automation.name}
      description={automation.description}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={save} loading={saving} disabled={!dirty}>
            Save changes
          </Button>
        </>
      }
    >
      <div className="space-y-7">
        <section className="space-y-2.5">
          <h3 className="text-xs font-medium text-fg-muted">Tone of voice</h3>
          <div className="grid grid-cols-2 gap-2">
            {toneOptions.map((tone) => (
              <OptionCard
                key={tone.value}
                name="tone"
                selected={config.tone === tone.value}
                onSelect={() => set("tone", tone.value)}
                label={tone.label}
                description={tone.description}
              />
            ))}
          </div>
        </section>

        <section className="space-y-2.5">
          <div className="flex items-baseline justify-between">
            <h3 className="text-xs font-medium text-fg-muted">Confidence threshold</h3>
            <span className="text-sm font-semibold text-accent-strong tabular-nums">{config.confidenceThreshold}%</span>
          </div>
          <input
            type="range"
            min={50}
            max={99}
            value={config.confidenceThreshold}
            onChange={(e) => set("confidenceThreshold", Number(e.target.value))}
            aria-label="Confidence threshold"
            className="w-full"
          />
          <div className="flex justify-between text-[11px] text-fg-subtle">
            <span>More automated</span>
            <span>More careful</span>
          </div>
          <p className="text-xs text-fg-subtle">
            Replies below {config.confidenceThreshold}% confidence won&apos;t be sent automatically.
          </p>
        </section>

        <section className="space-y-2.5">
          <h3 className="text-xs font-medium text-fg-muted">When confidence is low</h3>
          <div className="space-y-2">
            {lowConfidenceOptions.map((option) => (
              <OptionCard
                key={option.value}
                name="low-confidence"
                selected={config.lowConfidenceBehavior === option.value}
                onSelect={() => set("lowConfidenceBehavior", option.value)}
                label={option.label}
                description={option.description}
              />
            ))}
          </div>
        </section>

        <Field label="Reply timing" htmlFor="reply-delay" hint="A short delay makes automated replies feel more natural.">
          <Select
            id="reply-delay"
            value={config.replyDelaySeconds}
            onChange={(e) => set("replyDelaySeconds", Number(e.target.value))}
          >
            {delayOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Field>

        <section className="space-y-2">
          <h3 className="text-xs font-medium text-fg-muted">Triggers</h3>
          <div className="flex flex-wrap gap-1.5">
            {automation.triggerKeywords.map((keyword) => (
              <span key={keyword} className="rounded-md bg-surface-3 px-2 py-0.5 font-mono text-[11px] text-fg-muted">
                {keyword}
              </span>
            ))}
          </div>
        </section>
      </div>
    </Sheet>
  );
}
