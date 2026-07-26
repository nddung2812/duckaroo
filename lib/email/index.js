/**
 * The single place this app sends transactional email from.
 *
 * Every caller goes through sendEmail(); the provider is chosen here and
 * nowhere else, so swapping Resend for Postmark or SES is a change to this one
 * file. Providers are called over plain fetch rather than an SDK — the request
 * is a single POST, and it keeps the serverless bundle small.
 *
 * Note this is deliberately separate from the EmailJS calls elsewhere in the
 * codebase. EmailJS is a browser SDK with a public key; it is fine for a
 * contact form and unsuitable for anything that grants account access.
 */

import { setPasswordEmail, resetPasswordEmail, SUPPORT_EMAIL } from "./templates.js";

const DEFAULT_FROM = "Duckaroo <accounts@duckaroo.com.au>";

/**
 * Origin used to build the links inside auth emails.
 *
 * There is deliberately NO production fallback: a wrong guessed origin would
 * send customers to broken auth links and silently break the migration. Set
 * APP_URL to wherever this app is actually reachable (https://duckaroo.com.au
 * since the July 2026 DNS cutover).
 */
export function appUrl() {
  const configured = process.env.APP_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "APP_URL is not set — refusing to guess the origin for an auth email link"
    );
  }

  return "http://localhost:3000";
}

/**
 * Resend. Provisioned through the Vercel Marketplace, which injects
 * RESEND_API_KEY into the project environment.
 */
async function sendViaResend({ to, subject, html, text }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || DEFAULT_FROM,
      // Sent from the verified duckaroo.com.au domain for DKIM alignment, but
      // replies go somewhere that can actually receive them — the apex has no
      // MX record, so a reply to accounts@ would bounce.
      reply_to: SUPPORT_EMAIL,
      to: [to],
      subject,
      html,
      text,
    }),
  });

  if (!response.ok) {
    // Resend echoes the recipient in its error payload, so only the status is
    // safe to surface. The body is never logged.
    throw new Error(`Resend rejected the message (HTTP ${response.status})`);
  }

  const result = await response.json().catch(() => ({}));
  return { id: result.id ?? null };
}

/**
 * Local development only — prints the message to the terminal instead of
 * sending it, so you can click a set-password link without configuring a
 * provider. It refuses to run in production precisely because it violates the
 * "never log full email bodies" rule, which is acceptable on a dev machine
 * where the alternative is being unable to test the flow at all.
 */
async function sendViaConsole({ to, subject, text }) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("The console email provider must never be used in production");
  }
  console.log(`\n─── email (console provider, not sent) ───`);
  console.log(`to      : ${to}`);
  console.log(`subject : ${subject}`);
  console.log(text);
  console.log(`─────────────────────────────────────────\n`);
  return { id: null };
}

const PROVIDERS = {
  resend: sendViaResend,
  console: sendViaConsole,
};

function selectProvider() {
  const configured = process.env.EMAIL_PROVIDER?.trim().toLowerCase();
  if (configured) {
    const provider = PROVIDERS[configured];
    if (!provider) throw new Error(`Unknown EMAIL_PROVIDER "${configured}"`);
    return [configured, provider];
  }
  // No explicit choice: use Resend if it is configured, otherwise fall back to
  // the console so local development works out of the box.
  if (process.env.RESEND_API_KEY) return ["resend", sendViaResend];
  return ["console", sendViaConsole];
}

/**
 * Send one transactional email.
 *
 * Never throws at the call site — auth routes must not leak whether an address
 * exists or whether delivery succeeded, and a provider outage must not turn a
 * login attempt into a 500. Failures are logged by name and status only.
 *
 * @returns {Promise<{sent: boolean}>}
 */
export async function sendEmail({ to, subject, html, text }) {
  const [name, send] = selectProvider();

  try {
    await send({ to, subject, html, text });
    return { sent: true };
  } catch (error) {
    // Subject is fixed template copy, so it is safe to log. The recipient,
    // the body and the token-bearing URL are not.
    console.error(`Email send failed via ${name} — subject "${subject}": ${error.message}`);
    return { sent: false };
  }
}

// ── The two auth emails ─────────────────────────────────────────────────────

export function setPasswordUrl(token) {
  return `${appUrl()}/set-password?token=${encodeURIComponent(token)}`;
}

export function resetPasswordUrl(token) {
  return `${appUrl()}/reset-password?token=${encodeURIComponent(token)}`;
}

/**
 * Build the message and send it, never throwing at the call site.
 *
 * appUrl() throws when APP_URL is missing in production, and that must not turn
 * a login attempt into a 500 — it is a deployment misconfiguration, so it is
 * logged loudly and reported as "not sent".
 */
async function sendAuthEmail({ to, firstName, token, buildUrl, buildMessage }) {
  let message;
  try {
    message = buildMessage({ firstName, url: buildUrl(token) });
  } catch (error) {
    console.error(`Cannot build auth email link: ${error.message}`);
    return { sent: false };
  }
  return sendEmail({ to, ...message });
}

/** "We've upgraded our store" — for an imported customer claiming their account. */
export function sendSetPasswordEmail({ to, firstName, token }) {
  return sendAuthEmail({
    to,
    firstName,
    token,
    buildUrl: setPasswordUrl,
    buildMessage: setPasswordEmail,
  });
}

/** Ordinary forgot-password reset. */
export function sendResetPasswordEmail({ to, firstName, token }) {
  return sendAuthEmail({
    to,
    firstName,
    token,
    buildUrl: resetPasswordUrl,
    buildMessage: resetPasswordEmail,
  });
}
