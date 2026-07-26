import { redirect } from "next/navigation";

import Layout from "@/app/components/Layout";
import SignOutButton from "./_components/SignOutButton";
import { getCurrentUser } from "@/lib/session";

export const metadata = {
  title: "Your account | Duckaroo",
  description: "Your Duckaroo account details.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/account" },
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

  return (
    <Layout>
      <main className="min-h-[60vh] px-4 py-16">
        <div className="mx-auto w-full max-w-md">
          <h1 className="text-2xl font-semibold text-gray-900">Your account</h1>

          <dl className="mt-8 divide-y divide-gray-200 border-y border-gray-200 text-sm">
            {[
              ["Name", fullName || "—"],
              ["Email", user.email],
              ["Phone", user.phone || "—"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 py-3">
                <dt className="text-gray-500">{label}</dt>
                <dd className="text-gray-900 text-right break-all">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8">
            <SignOutButton />
          </div>
        </div>
      </main>
    </Layout>
  );
}
