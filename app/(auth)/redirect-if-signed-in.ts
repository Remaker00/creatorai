import { redirect } from "next/navigation";
import { getAuth } from "@/lib/server/auth/session";

export async function redirectIfSignedIn(): Promise<void> {
  const auth = await getAuth();
  if (auth) redirect("/");
}
