import AuthShell, { AuthLink } from "./AuthShell";
import SetPasswordForm from "../set-password/_components/SetPasswordForm";
import { peekAuthToken, PURPOSE_SET_PASSWORD, PURPOSE_RESET_PASSWORD } from "@/lib/authTokens";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/policy.mjs";

/**
 * Shared by /set-password and /reset-password — the same form behind the same
 * token check, differing only in the copy.
 *
 * The token is inspected but NOT redeemed here. Redeeming happens when the new
 * password is submitted, so a mail scanner that prefetches links, or a customer
 * who opens the email twice, does not silently burn a single-use token.
 */
const DEAD_TOKEN_COPY = {
  not_found: "That link is not valid — it may have been mistyped or already replaced by a newer one.",
  expired: "That link has expired. Links are good for one hour.",
  already_used: "That link has already been used. If you need to change your password again, request a new link.",
};

export default async function TokenGate({ token, title, intro, submitLabel }) {
  const check = await peekAuthToken({
    token,
    purposes: [PURPOSE_SET_PASSWORD, PURPOSE_RESET_PASSWORD],
  });

  if (!check.usable) {
    return (
      <AuthShell
        title="That link doesn't work"
        intro={DEAD_TOKEN_COPY[check.reason] ?? DEAD_TOKEN_COPY.not_found}
        footer={<AuthLink href="/login">Back to sign in</AuthLink>}
      >
        <p className="text-sm leading-relaxed text-cream/70">
          <AuthLink href="/forgot-password">Request a new link</AuthLink> and we'll email you a
          fresh one.
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell title={title} intro={intro} footer={<AuthLink href="/login">Back to sign in</AuthLink>}>
      <SetPasswordForm
        token={token}
        minPasswordLength={MIN_PASSWORD_LENGTH}
        submitLabel={submitLabel}
      />
    </AuthShell>
  );
}
