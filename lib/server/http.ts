/** Thrown anywhere in the server layers; route helpers turn it into a JSON error response. */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly field?: string,
  ) {
    super(message);
  }
}

export interface ApiErrorBody {
  error: string;
  field?: string;
}

export function errorResponse(status: number, error: string, field?: string): Response {
  const body: ApiErrorBody = field ? { error, field } : { error };
  return Response.json(body, { status });
}

export async function readJsonObject(request: Request): Promise<Record<string, unknown>> {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    throw new HttpError(415, "Expected application/json");
  }
  const body: unknown = await request.json().catch(() => null);
  if (typeof body !== "object" || body === null || Array.isArray(body)) throw new HttpError(400, "Invalid JSON body");
  return body as Record<string, unknown>;
}

/**
 * Logs a server error without query parameters. Drizzle's query errors carry `params`
 * (password hashes, emails, tokens), so only the SQL text, pg code/message and stack are kept.
 */
export function logServerError(context: string, error: unknown): void {
  const chain: Record<string, unknown>[] = [];
  for (let e: unknown = error; e instanceof Error && chain.length < 5; e = e.cause) {
    const { code, query } = e as { code?: unknown; query?: unknown };
    chain.push({
      name: e.name,
      message: e.message.split("\nparams:")[0],
      code,
      query,
      // The stack starts by repeating the message (params included), so keep frame lines only.
      stack: e.stack?.split("\n").filter((line) => line.trimStart().startsWith("at ")).slice(0, 5).join("\n"),
    });
  }
  console.error(`[${context}]`, chain.length ? chain : String(error));
}
