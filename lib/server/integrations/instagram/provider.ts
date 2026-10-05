/**
 * Instagram OAuth seam. The connect/callback routes only talk to `instagramProvider`;
 * swapping the placeholder for the real Instagram Business Login means implementing this
 * interface (authorize URL + code exchange) — routes, state/CSRF handling and persistence stay.
 */
import type { AccountPermission } from "@/lib/types";

export interface InstagramProfile {
  /** Instagram's account ID; becomes `social_accounts.external_id`. */
  externalId: string;
  handle: string;
  displayName: string;
  followers: number;
  permissions: AccountPermission[];
}

export interface InstagramProvider {
  /** Where to send the browser to ask for consent. */
  authorizeUrl(params: { state: string; redirectUri: string }): string;
  /** Exchanges the callback `code` for the account profile (real impl: also long-lived token). */
  exchangeCode(params: { code: string; redirectUri: string }): Promise<InstagramProfile>;
}

const HANDLE_RE = /^[a-z0-9._]{1,30}$/;

/**
 * PLACEHOLDER — no Instagram API calls. The "consent screen" is our own page
 * (`/onboarding/instagram`), and the `code` it returns is simply the handle the user typed.
 */
export const placeholderInstagramProvider: InstagramProvider = {
  authorizeUrl({ state, redirectUri }) {
    const params = new URLSearchParams({ state, redirect_uri: redirectUri });
    return `/onboarding/instagram?${params}`;
  },

  async exchangeCode({ code }) {
    const handle = code.trim().replace(/^@/, "").toLowerCase();
    if (!HANDLE_RE.test(handle)) throw new Error("invalid_code");
    return {
      externalId: `placeholder_${handle}`,
      handle,
      displayName: handle,
      followers: 0,
      permissions: ["messages", "comments", "insights", "profile"],
    };
  },
};

export const instagramProvider: InstagramProvider = placeholderInstagramProvider;
