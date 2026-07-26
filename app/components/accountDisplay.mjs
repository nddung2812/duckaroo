/**
 * Pure helpers for rendering the signed-in customer and prefilling forms.
 *
 * No React, no Next imports — same reasoning as lib/auth/policy.mjs. The rules
 * here decide whether a customer's typing gets overwritten, which is worth
 * testing directly rather than only through a browser.
 *
 * Re-exported from useCurrentUser.js, so components keep importing from there.
 */

/** What to show in a header link: their name, their email, or "Sign in". */
export function accountLabel(user) {
  if (user === undefined) return "";
  if (!user) return "Sign in";
  return user.firstName?.trim() || user.email;
}

/**
 * The single letter for the header avatar — their first name's initial, or
 * their email's if we never got a name. Desktop headers show only this circle;
 * the full name and the sign-out button live on /account.
 */
export function accountInitial(user) {
  if (!user) return "";
  const source = user.firstName?.trim() || user.email || "";
  return source.trim().charAt(0).toUpperCase();
}

/**
 * Their name as one string, for forms with a single "name" field.
 * Empty when we have neither part — many Shopify imports have no name at all.
 */
export function fullName(user) {
  if (!user) return "";
  return [user.firstName, user.lastName]
    .map((part) => (typeof part === "string" ? part.trim() : ""))
    .filter(Boolean)
    .join(" ");
}

/**
 * Fill a blank field from the account, never overwriting what was typed.
 *
 * The account arrives from an async /api/auth/me fetch, so a customer can be
 * mid-keystroke when it lands. Anything already entered wins — including a
 * value they deliberately changed away from their account details.
 *
 * @param {string} current  what is in the field right now
 * @param {string} incoming what the account has
 */
export function prefill(current, incoming) {
  if (typeof current === "string" && current.trim()) return current;
  return incoming || current || "";
}
