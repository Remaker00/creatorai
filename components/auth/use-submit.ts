"use client";

import { useState } from "react";
import { ApiError } from "@/lib/services";

/** Runs a form submission and exposes its error (and the field it belongs to). */
export function useSubmit() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<{ message: string; field?: string } | null>(null);

  async function run(action: () => Promise<void>) {
    setPending(true);
    setError(null);
    try {
      await action();
    } catch (e) {
      setError(e instanceof ApiError ? { message: e.message, field: e.field } : { message: "Network error — try again." });
      setPending(false);
    }
    // On success we stay pending: the caller navigates away.
  }

  return { pending, error, run };
}
