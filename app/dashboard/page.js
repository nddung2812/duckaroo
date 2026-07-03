import DashboardClient from "./_components/DashboardClient";

export const metadata = {
  title: "Stock Dashboard",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <DashboardClient />;
}
