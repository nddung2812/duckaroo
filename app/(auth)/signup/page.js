import { redirect } from "next/navigation";

import AuthShell, { AuthLink } from "../_components/AuthShell";
import SignupForm from "./_components/SignupForm";
import { getCurrentUser } from "@/lib/session";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/policy.mjs";

export const metadata = {
  title: "Create an account | Duckaroo",
  description: "Create a Duckaroo account to track your orders and bookings.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/signup" },
};

export const dynamic = "force-dynamic";

export default async function SignupPage() {
  if (await getCurrentUser()) redirect("/");

  return (
    <AuthShell
      title="Create an account"
      intro="Bought from us before? Use the same email address and we'll reconnect you to your order history."
      footer={
        <>
          Already have an account? <AuthLink href="/login">Sign in</AuthLink>
        </>
      }
    >
      <SignupForm minPasswordLength={MIN_PASSWORD_LENGTH} />
    </AuthShell>
  );
}
