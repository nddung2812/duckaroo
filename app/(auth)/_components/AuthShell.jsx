import Link from "next/link";

/**
 * Shared chrome for the auth pages — a single centred card. Plain Tailwind, to
 * match the idiom already used by the dashboard login form.
 */
export default function AuthShell({ title, intro, children, footer }) {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          {intro && <p className="mt-2 text-sm leading-relaxed text-gray-600">{intro}</p>}
          <div className="mt-6">{children}</div>
        </div>
        {footer && <div className="mt-6 text-center text-sm text-gray-600">{footer}</div>}
      </div>
    </main>
  );
}

export function AuthLink({ href, children }) {
  return (
    <Link href={href} className="text-teal-700 font-medium hover:text-teal-800 underline">
      {children}
    </Link>
  );
}
