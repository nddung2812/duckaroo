"use client";

/**
 * Small shared pieces so the four auth forms stay consistent and short.
 * Styling follows the site's dark "Living Art" idiom — the same input and
 * button treatment as UnifiedServiceForm.
 */

export function Field({ id, label, type = "text", value, onChange, autoComplete, required, autoFocus, placeholder, hint }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-cream/80 mb-1.5">
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
        className="w-full bg-abyss/40 border border-cream/20 rounded-xl px-3 py-2.5 text-sm text-cream placeholder:text-cream/40 focus:outline-none focus:border-amber-glow focus:ring-2 focus:ring-amber-glow/40 transition-colors"
      />
      {hint && <p className="mt-1.5 text-xs text-cream/50">{hint}</p>}
    </div>
  );
}

export function SubmitButton({ loading, children, loadingLabel }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-amber-glow text-[#04121b] rounded-full px-4 py-3 text-[13px] uppercase tracking-[0.14em] font-medium hover:shadow-[0_6px_30px_rgba(232,160,92,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all duration-300"
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
      className="rounded-2xl bg-amber-glow/10 border border-amber-glow/30 px-4 py-3 text-sm leading-relaxed text-amber-glow"
    >
      {children}
    </div>
  );
}

export function ErrorText({ children }) {
  if (!children) return null;
  return (
    <p
      role="alert"
      className="rounded-2xl bg-red-950/30 border border-red-800/40 px-4 py-3 text-sm text-red-300"
    >
      {children}
    </p>
  );
}
