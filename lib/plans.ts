import type { PlanId } from "./types";

export interface Plan {
  id: PlanId;
  name: string;
  price: string;
  tagline: string;
  features: string[];
}

/** Static catalog. No billing yet — choosing a plan just records it on the workspace. */
export const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    tagline: "Everything you need to let AI handle your Instagram inbox.",
    features: [
      "Connect 1 Instagram account",
      "AI-drafted DM replies in your voice",
      "Comment reply suggestions",
      "Automations with review thresholds",
      "Inbox analytics",
    ],
  },
];

export const planIds = plans.map((p) => p.id);
