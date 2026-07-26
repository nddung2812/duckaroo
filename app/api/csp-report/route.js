/**
 * Collector for Content-Security-Policy violation reports.
 *
 * next.config.mjs sends the policy as Content-Security-Policy-Report-Only and
 * points `report-uri` here, so this endpoint is how we find out what a real
 * enforcing policy would break before we turn one on. Reports land in the
 * Vercel runtime logs — filter for "CSP violation".
 *
 * Deliberately stores nothing: the body is attacker-influenced (anyone can POST
 * here, and browsers send these without credentials), so it is size-capped,
 * summarised to a handful of known fields, and dropped. Always answers 204 so a
 * misbehaving client never retries against us.
 */

const MAX_BODY_BYTES = 8 * 1024;

/** Reports arrive in two shapes depending on report-uri vs the Reporting API. */
function summarise(payload) {
  const body = payload?.["csp-report"] ?? payload?.body ?? payload;
  if (!body || typeof body !== "object") return null;
  return {
    directive: body["effective-directive"] ?? body["violated-directive"] ?? body.effectiveDirective,
    blocked: body["blocked-uri"] ?? body.blockedURL,
    document: body["document-uri"] ?? body.documentURL,
    disposition: body.disposition,
  };
}

export async function POST(request) {
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return new Response(null, { status: 204 });
    }

    const reports = JSON.parse(raw);
    for (const report of Array.isArray(reports) ? reports : [reports]) {
      const summary = summarise(report);
      if (summary?.directive) {
        console.warn("CSP violation", JSON.stringify(summary));
      }
    }
  } catch {
    // Malformed or non-JSON body — nothing useful to log.
  }

  return new Response(null, { status: 204 });
}
