import AuthShell, { AuthLink } from "../_components/AuthShell";
import ForgotPasswordForm from "./_components/ForgotPasswordForm";

export const metadata = {
  title: "Forgot your password | Duckaroo",
  description: "Request a link to set a new Duckaroo password.",
  robots: { index: false, follow: false },
  // Empty object replaces the root layout's alternates so no homepage
  // canonical is inherited onto this noindexed page.
  alternates: {},
};

export const dynamic = "force-dynamic";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Forgot your password"
      intro="Enter your email address and we'll send you a link to set a new one."
      footer={<AuthLink href="/login">Back to sign in</AuthLink>}
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
