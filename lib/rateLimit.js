import sql from "./neon";

/**
 * Fixed-window rate limiting, counted in Postgres.
 *
 * Serverless functions have no shared memory, so an in-process counter would
 * reset on every cold start and be trivially bypassed. Postgres is the state
 * this app already has; at Duckaroo's traffic one extra upsert per login
 * attempt is not worth adding Redis for.
 *
 * Fixed windows allow a burst of up to 2x the limit across a window boundary.
 * That is an acceptable trade for the simplicity — these limits exist to stop
 * credential stuffing and mail-bombing, not to meter an API.
 */

/**
 * Count one attempt against a bucket.
 *
 * @param {string} key      identifies what is being limited, e.g. "login:ip:1.2.3.4"
 * @param {number} limit    attempts allowed per window
 * @param {number} windowSeconds
 * @returns {Promise<{allowed: boolean, remaining: number, retryAfterSeconds: number}>}
 */
export async function consumeRateLimit(key, limit, windowSeconds) {
  let rows;

  try {
    rows = await sql`
      INSERT INTO rate_limits (bucket, count, window_start, expires_at)
      VALUES (${key}, 1, NOW(), NOW() + make_interval(secs => ${windowSeconds}))
      ON CONFLICT (bucket) DO UPDATE SET
        count = CASE
          WHEN rate_limits.expires_at <= NOW() THEN 1
          ELSE rate_limits.count + 1
        END,
        window_start = CASE
          WHEN rate_limits.expires_at <= NOW() THEN NOW()
          ELSE rate_limits.window_start
        END,
        expires_at = CASE
          WHEN rate_limits.expires_at <= NOW() THEN NOW() + make_interval(secs => ${windowSeconds})
          ELSE rate_limits.expires_at
        END
      RETURNING count, EXTRACT(EPOCH FROM (expires_at - NOW()))::int AS retry_after
    `;
  } catch (error) {
    // Fail open. A rate limiter that takes the login page down with it is a
    // worse outcome than a brief window without throttling, and the generic
    // responses and argon2 cost still apply.
    console.error(`Rate limit check failed, allowing request: ${error.message}`);
    return { allowed: true, remaining: limit, retryAfterSeconds: 0 };
  }

  const count = Number(rows[0]?.count ?? 1);
  const retryAfterSeconds = Math.max(0, Number(rows[0]?.retry_after ?? windowSeconds));

  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    retryAfterSeconds,
  };
}

/**
 * The client IP.
 *
 * On Vercel x-forwarded-for is set by the platform and the leftmost entry is
 * the real client. Behind any other proxy this header is attacker-controlled,
 * which is why it is only ever used for rate limiting and never for auth.
 */
export function clientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/**
 * Standard limits. Email-sending paths are throttled harder per address than
 * per IP, because the harm there is mail-bombing one person's inbox rather
 * than guessing one person's password.
 */
export const LIMITS = {
  loginPerIp: { limit: 20, windowSeconds: 15 * 60 },
  loginPerEmail: { limit: 8, windowSeconds: 15 * 60 },
  emailPerIp: { limit: 10, windowSeconds: 60 * 60 },
  emailPerEmail: { limit: 3, windowSeconds: 60 * 60 },
  signupPerIp: { limit: 10, windowSeconds: 60 * 60 },
  setPasswordPerIp: { limit: 20, windowSeconds: 60 * 60 },
  // Public form / payment endpoints. Generous for real customers (a checkout
  // needs one intent, a service enquiry is one submission) but low enough
  // that a spammer cannot flood the DB or burn Stripe API quota.
  leadPerIp: { limit: 5, windowSeconds: 60 * 60 },
  leadPerEmail: { limit: 3, windowSeconds: 60 * 60 },
  paymentIntentPerIp: { limit: 20, windowSeconds: 60 * 60 },
  confirmPaymentPerIp: { limit: 60, windowSeconds: 60 * 60 },
  orderCreatePerIp: { limit: 10, windowSeconds: 60 * 60 },
  dashboardLoginPerIp: { limit: 10, windowSeconds: 15 * 60 },
};

/** Apply several limits at once; the first breach wins. */
export async function checkLimits(entries) {
  for (const [key, { limit, windowSeconds }] of entries) {
    const result = await consumeRateLimit(key, limit, windowSeconds);
    if (!result.allowed) return result;
  }
  return { allowed: true, remaining: 0, retryAfterSeconds: 0 };
}

/** Housekeeping: drop stale buckets. Safe to run any time. */
export async function purgeExpiredRateLimits() {
  await sql`DELETE FROM rate_limits WHERE expires_at < NOW() - INTERVAL '1 day'`;
}
