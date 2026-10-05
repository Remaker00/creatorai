/** API error with the offending field (if any) so forms can highlight it. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly field?: string,
  ) {
    super(message);
  }
}

// Auth rides on the HttpOnly session cookie; nothing auth-related touches JS storage.
export async function apiRequest<T>(method: "GET" | "POST" | "PATCH" | "DELETE", url: string, body?: object): Promise<T> {
  const res = await fetch(url, {
    method,
    cache: "no-store",
    credentials: "same-origin",
    ...(body ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {}),
  });
  if (res.status === 204) return undefined as T;
  const data: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const { error, field } = (data ?? {}) as { error?: string; field?: string };
    throw new ApiError(error ?? `Request failed (${res.status})`, res.status, field);
  }
  return data as T;
}
