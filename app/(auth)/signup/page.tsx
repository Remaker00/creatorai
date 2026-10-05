import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/signup-form";
import { redirectIfSignedIn } from "../redirect-if-signed-in";

export const metadata: Metadata = { title: "Create your account" };

export default async function SignupPage() {
  await redirectIfSignedIn();
  return <SignupForm />;
}
