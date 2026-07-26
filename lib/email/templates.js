/**
 * Transactional email bodies.
 *
 * Deliberately plain HTML with inline styles and no images — auth email needs to
 * render in every client and land in the inbox, not look like marketing. Each
 * template returns { subject, html, text }; the text part is not optional,
 * spam filters weight multipart messages more kindly.
 */

const BRAND = "Duckaroo";
const SUPPORT_EMAIL = "hello@duckaroo.com.au";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function greeting(firstName) {
  const name = (firstName ?? "").trim();
  return name ? `Hi ${name},` : "Hi,";
}

function layout({ heading, bodyParagraphs, buttonLabel, url, footNote }) {
  const paragraphs = bodyParagraphs
    .map(
      (p) =>
        `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#333;">${p}</p>`
    )
    .join("");

  return `<!doctype html>
<html lang="en">
<body style="margin:0;padding:24px;background:#f4f7f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;padding:32px;">
    <tr><td>
      <h1 style="margin:0 0 24px;font-size:22px;line-height:1.3;color:#111;">${escapeHtml(heading)}</h1>
      ${paragraphs}
      <p style="margin:28px 0;">
        <a href="${escapeHtml(url)}" style="display:inline-block;padding:14px 28px;background:#0f766e;color:#ffffff;text-decoration:none;border-radius:8px;font-size:16px;font-weight:600;">${escapeHtml(buttonLabel)}</a>
      </p>
      <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#666;">
        If the button does not work, copy and paste this link into your browser:<br>
        <span style="word-break:break-all;color:#0f766e;">${escapeHtml(url)}</span>
      </p>
      <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#666;">${footNote}</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
      <p style="margin:0;font-size:13px;line-height:1.6;color:#888;">
        ${BRAND} — fish tank cleaning, Brisbane &amp; Gold Coast<br>
        Questions? Just reply, or email <a href="mailto:${SUPPORT_EMAIL}" style="color:#0f766e;">${SUPPORT_EMAIL}</a>.
      </p>
    </td></tr>
  </table>
</body>
</html>`;
}

/**
 * Sent when someone imported from the old Shopify store tries to log in for the
 * first time. They have an account but have never had a password on this site.
 */
export function setPasswordEmail({ firstName, url, expiresInMinutes = 60 }) {
  const hello = greeting(firstName);

  return {
    subject: `Set your password for ${BRAND}`,
    html: layout({
      heading: "We've upgraded our store",
      bodyParagraphs: [
        escapeHtml(hello),
        `Your ${BRAND} account has moved to our new website. Your order history came across with it — but for security, passwords did not, so you'll need to set a new one.`,
        "It only takes a moment:",
      ],
      buttonLabel: "Set your password",
      url,
      footNote: `This link can only be used once and expires in ${expiresInMinutes} minutes. If you didn't try to log in, you can safely ignore this email — nothing will change.`,
    }),
    text: [
      hello,
      "",
      `Your ${BRAND} account has moved to our new website. Your order history came across with it, but for security, passwords did not — so you'll need to set a new one.`,
      "",
      "Set your password here:",
      url,
      "",
      `This link can only be used once and expires in ${expiresInMinutes} minutes.`,
      "If you didn't try to log in, you can safely ignore this email — nothing will change.",
      "",
      `${BRAND} — fish tank cleaning, Brisbane & Gold Coast`,
      SUPPORT_EMAIL,
    ].join("\n"),
  };
}

/** Ordinary forgotten-password reset. */
export function resetPasswordEmail({ firstName, url, expiresInMinutes = 60 }) {
  const hello = greeting(firstName);

  return {
    subject: `Reset your ${BRAND} password`,
    html: layout({
      heading: "Reset your password",
      bodyParagraphs: [
        escapeHtml(hello),
        `Someone asked to reset the password for this ${BRAND} account. If that was you, use the button below.`,
      ],
      buttonLabel: "Reset your password",
      url,
      footNote: `This link can only be used once and expires in ${expiresInMinutes} minutes. If you didn't request this, you can safely ignore this email — your password will not change.`,
    }),
    text: [
      hello,
      "",
      `Someone asked to reset the password for this ${BRAND} account. If that was you, use the link below.`,
      "",
      url,
      "",
      `This link can only be used once and expires in ${expiresInMinutes} minutes.`,
      "If you didn't request this, you can safely ignore this email — your password will not change.",
      "",
      `${BRAND} — fish tank cleaning, Brisbane & Gold Coast`,
      SUPPORT_EMAIL,
    ].join("\n"),
  };
}
