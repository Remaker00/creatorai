import { redirect } from "next/navigation";
import { nextStepPath } from "@/lib/auth-flow";
import { getAuth } from "@/lib/server/auth/session";

export async function redirectIfSignedIn(): Promise<void> {
  const auth = await getAuth();
  if (auth) redirect(nextStepPath(auth.state.workspace));
}
