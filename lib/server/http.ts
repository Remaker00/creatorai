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
