import TokenGate from "../_components/TokenGate";

export const metadata = {
  title: "Set your password | Duckaroo",
  description: "Set a password for your Duckaroo account.",
  robots: { index: false, follow: false },
  // Empty object replaces the root layout's alternates so no homepage
  // canonical is inherited onto this noindexed page.
  alternates: {},
};

export const dynamic = "force-dynamic";

/** Landing page for the "We've upgraded our store" email. */
export default async function SetPasswordPage({ searchParams }) {
  const params = await searchParams;
  const token = typeof params?.token === "string" ? params.token : "";

  return (
    <TokenGate
      token={token}
      title="Set your password"
      intro="Choose a password for your Duckaroo account. Your order history is already waiting for you."
      submitLabel="Set password and sign in"
    />
  );
}
