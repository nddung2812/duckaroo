import { redirect } from "next/navigation";

import Layout from "@/app/components/Layout";
import PageAmbience from "@/app/components/PageAmbience";
import SignOutButton from "./_components/SignOutButton";
import OrderHistory from "./_components/OrderHistory";
import { getCurrentUser } from "@/lib/session";
import { getOrdersForEmail } from "@/lib/orders";

export const metadata = {
  title: "Your account | Duckaroo",
  description: "Your Duckaroo account details.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Reads the signed-in customer directly in a React Server Component — no API
 * call, no client-side fetch. This is the helper the rest of the app should use
 * whenever it needs the current customer during render.
 */
export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
  const orders = await getOrdersForEmail(user.email);

  return (
    <>
      <PageAmbience />

      <Layout>
        {/* pt clears the fixed h-20 Navbar — see AuthShell. */}
        <div className="relative z-10 min-h-[60vh] px-4 pt-32 pb-16">
          <div className="mx-auto w-full max-w-2xl">
            <h1 className="font-display text-3xl md:text-4xl font-medium text-parchment text-center [text-wrap:balance]">
              Your account
            </h1>

            <div className="mt-8 bg-cream/5 backdrop-blur-md border border-cream/15 rounded-2xl shadow-2xl p-6 sm:p-8">
              <dl className="divide-y divide-cream/10 text-sm">
                {[
                  ["Name", fullName || "—"],
                  ["Email", user.email],
                  ["Phone", user.phone || "—"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 py-3 first:pt-0 last:pb-0">
                    <dt className="text-cream/60">{label}</dt>
                    <dd className="text-cream text-right break-all">{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8">
                <SignOutButton />
              </div>
            </div>

            <h2 className="mt-12 font-display text-2xl md:text-3xl font-medium text-parchment text-center">
              Order history
            </h2>
            <OrderHistory orders={orders} />
          </div>
        </div>
      </Layout>
    </>
  );
}
