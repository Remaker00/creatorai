import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { redirectIfSignedIn } from "../redirect-if-signed-in";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage() {
  await redirectIfSignedIn();
  return <LoginForm />;
}
