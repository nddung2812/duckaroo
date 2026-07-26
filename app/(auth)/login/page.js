import { redirect } from "next/navigation";

import AuthShell, { AuthLink } from "../_components/AuthShell";
import LoginForm from "./_components/LoginForm";
import { getCurrentUser } from "@/lib/session";

export const metadata = {
  title: "Sign in | Duckaroo",
  description: "Sign in to your Duckaroo account.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/");

  return (
    <AuthShell
      title="Sign in"
      footer={
        <>
          New here? <AuthLink href="/signup">Create an account</AuthLink>
          <span className="mx-2 text-cream/25">|</span>
          <AuthLink href="/forgot-password">Forgot your password?</AuthLink>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
