import type { LowConfidenceBehavior, Tone } from "@/lib/types";

export const toneOptions: { value: Tone; label: string; description: string }[] = [
  { value: "friendly", label: "Friendly", description: "Warm and approachable" },
  { value: "professional", label: "Professional", description: "Polished, email-like" },
  { value: "playful", label: "Playful", description: "High energy, casual" },
  { value: "concise", label: "Concise", description: "Short and to the point" },
];

export const toneLabels = Object.fromEntries(toneOptions.map((o) => [o.value, o.label])) as Record<Tone, string>;

export const lowConfidenceOptions: { value: LowConfidenceBehavior; label: string; description: string }[] = [
  {
    value: "flag_for_review",
    label: "Flag for review",
    description: "Save the draft and add the conversation to your review queue.",
  },
  {
    value: "send_holding_reply",
    label: "Send a holding reply",
    description: "Let them know you'll get back soon, then flag it for you.",
  },
  { value: "skip", label: "Do nothing", description: "Leave the message untouched in your inbox." },
];

export const lowConfidenceLabels = Object.fromEntries(
  lowConfidenceOptions.map((o) => [o.value, o.label]),
) as Record<LowConfidenceBehavior, string>;

export const delayOptions = [
  { value: 0, label: "Instantly" },
  { value: 30, label: "After 30 seconds" },
  { value: 60, label: "After 1 minute" },
  { value: 120, label: "After 2 minutes" },
  { value: 180, label: "After 3 minutes" },
  { value: 300, label: "After 5 minutes" },
];
