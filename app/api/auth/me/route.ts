import { authedRoute } from "@/lib/server/auth/route";

export const GET = authedRoute(async (_request, auth) =>
  Response.json(auth.state, { headers: { "Cache-Control": "private, no-store" } }),
);
