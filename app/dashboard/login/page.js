import LoginForm from "./_components/LoginForm";

export const metadata = {
  title: "Dashboard Login",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-semibold mb-6 text-center">Dashboard</h1>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
