"use client";

/** Small shared pieces so the four auth forms stay consistent and short. */

export function Field({ id, label, type = "text", value, onChange, autoComplete, required, autoFocus, placeholder, hint }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
      />
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

export function SubmitButton({ loading, children, loadingLabel }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-teal-700 text-white rounded-md px-4 py-2.5 text-sm font-medium hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? loadingLabel : children}
    </button>
  );
}

/** Neutral, informational — used for "check your email", not for failures. */
export function Notice({ children }) {
  if (!children) return null;
  return (
    <div
      role="status"
      className="rounded-md bg-teal-50 border border-teal-200 px-3 py-2.5 text-sm text-teal-900"
    >
      {children}
    </div>
  );
}

export function ErrorText({ children }) {
  if (!children) return null;
  return (
    <p role="alert" className="text-sm text-red-600">
      {children}
    </p>
  );
}
