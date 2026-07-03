export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({ children }) {
  return (
    <div className="text-gray-900 bg-gray-50 min-h-screen">
      {children}
    </div>
  );
}
