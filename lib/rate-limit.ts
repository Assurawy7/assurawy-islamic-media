/**
 * Minimal in-memory rate limiter for auth endpoints (login/register).
 *
 * CAVEAT: this state lives in a single server process. It works fine on a
 * single long-running Node server (e.g. `next start` on one container/VM),
 * but on serverless platforms (Vercel) each invocation may hit a different
 * instance, so limits are not shared across them. For real production use
 * on serverless, swap this for a shared store — e.g. Upstash Redis with
 * `@upstash/ratelimit`, which is a drop-in replacement for the `check()`
 * function below.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function checkRateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt < now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { allowed: true, remaining: limit - existing.count, resetAt: existing.resetAt };
}

/** Best-effort client identifier for rate limiting behind a proxy/CDN. */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}
