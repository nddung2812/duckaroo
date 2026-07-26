import TokenGate from "../_components/TokenGate";

export const metadata = {
  title: "Reset your password | Duckaroo",
  description: "Choose a new password for your Duckaroo account.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/** Landing page for the ordinary "Reset your password" email. */
export default async function ResetPasswordPage({ searchParams }) {
  const params = await searchParams;
  const token = typeof params?.token === "string" ? params.token : "";

  return (
    <TokenGate
      token={token}
      title="Choose a new password"
      intro="Signing in anywhere else will stop working once you save this."
      submitLabel="Save new password"
    />
  );
}
