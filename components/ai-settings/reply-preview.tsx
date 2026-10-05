"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { AiGenerating } from "@/components/inbox/ai-generating";
import { ConfidencePill } from "@/components/inbox/ai-reply-panel";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Select } from "@/components/ui/field";
import { aiService } from "@/lib/services";
import type { AiSettings, AiSuggestion } from "@/lib/types";

const samples = [
  { name: "Chloe", text: "Do your presets work on Lightroom mobile?" },
  { name: "Alex", text: "Hi! We're a camera bag brand and would love to collab on a sponsored post." },
  { name: "Sam", text: "My order hasn't arrived and the tracking is stuck, can I get a refund?" },
  { name: "Riley", text: "Your Iceland reel made me cry, thank you for the inspo 🥹" },
  { name: "Jo", text: "What do you think about the election?" },
];

/** Lets the creator test unsaved settings against a sample message. */
export function ReplyPreview({ settings }: { settings: AiSettings }) {
  const [sampleIndex, setSampleIndex] = useState(0);
  const [result, setResult] = useState<AiSuggestion | null>(null);
  const [loading, setLoading] = useState(false);
  const sample = samples[sampleIndex];

  const run = async () => {
    setLoading(true);
    const suggestion = await aiService.generateReply({
      channel: "dm",
      inbound: [sample.text],
      recipientName: sample.name,
      settings,
      // No automations: preview the creator's own voice without per-automation tone overrides.
      automations: [],
      variant: 0,
    });
    setResult(suggestion);
    setLoading(false);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader title="Test your assistant" description="Preview a reply using your current (unsaved) settings." />
      <div className="space-y-3 px-5 pb-5">
        <Select
          value={sampleIndex}
          onChange={(e) => {
            setSampleIndex(Number(e.target.value));
            setResult(null);
          }}
          aria-label="Sample message"
        >
          {samples.map((s, i) => (
            <option key={s.name} value={i}>
              {s.text}
            </option>
          ))}
        </Select>
        <div className="rounded-xl rounded-bl-md bg-surface-2 px-3.5 py-2.5 text-sm ring-1 ring-line">{sample.text}</div>
        {loading && (
          <div className="rounded-xl border border-accent/25 bg-accent/[0.05] p-3">
            <AiGenerating />
          </div>
        )}
        {!loading && result && (
          <div className="animate-fade-in space-y-2 rounded-xl border border-accent/25 bg-accent/[0.06] p-3">
            <div className="flex items-center gap-2">
              <Sparkles className="size-3.5 text-accent-strong" />
              <ConfidencePill confidence={result.confidence} />
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-line">{result.body}</p>
            <p className="text-[11px] text-fg-subtle">{result.reasoning}</p>
          </div>
        )}
        <Button variant="ai" className="w-full" onClick={run} loading={loading}>
          {!loading && <Sparkles />} {result ? "Generate again" : "Generate preview"}
        </Button>
      </div>
    </Card>
  );
}
