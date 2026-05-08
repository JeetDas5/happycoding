/**
 * In-memory rate limiter for Next.js server actions.
 *
 * Uses a sliding-window counter keyed by `ip:action`.
 * Safe for single-server / Vercel serverless (per-function isolation).
 *
 * For multi-region production, swap the Map for Upstash Redis.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number; // epoch ms
}

// Global Map survives across requests within the same function instance.
const store = new Map<string, RateLimitEntry>();

// Periodically purge expired entries to prevent unbounded growth.
// Only runs in Node environments (skipped during edge runtime).
if (typeof setInterval !== "undefined") {
  setInterval(
    () => {
      const now = Date.now();
      for (const [key, entry] of store) {
        if (entry.resetAt < now) store.delete(key);
      }
    },
    5 * 60 * 1000, // every 5 minutes
  );
}

export interface RateLimitConfig {
  /** Max requests allowed within `windowMs`. */
  limit: number;
  /** Time window in milliseconds. */
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  /** Remaining requests in the current window. */
  remaining: number;
  /** Seconds until the window resets. */
  retryAfter: number;
}

/**
 * Check and increment the rate limit counter for a given key.
 *
 * @param key     - Unique identifier, e.g. `"signup:127.0.0.1"`.
 * @param config  - `limit` and `windowMs`.
 */
export function rateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    // New window
    store.set(key, { count: 1, resetAt: now + config.windowMs });
    return { success: true, remaining: config.limit - 1, retryAfter: 0 };
  }

  if (entry.count >= config.limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { success: false, remaining: 0, retryAfter };
  }

  entry.count += 1;
  return {
    success: true,
    remaining: config.limit - entry.count,
    retryAfter: 0,
  };
}

// ─── Pre-configured limiters ──────────────────────────────────────────────────

/** Signup: max 3 attempts per IP per 10 minutes */
export const signupLimiter: RateLimitConfig = {
  limit: 3,
  windowMs: 10 * 60 * 1000,
};

/** Password reset: max 3 attempts per IP per 15 minutes */
export const passwordResetLimiter: RateLimitConfig = {
  limit: 3,
  windowMs: 15 * 60 * 1000,
};

/** Login: max 10 attempts per IP per 10 minutes */
export const loginLimiter: RateLimitConfig = {
  limit: 10,
  windowMs: 10 * 60 * 1000,
};

/** Contact form: max 5 submissions per IP per 30 minutes */
export const contactLimiter: RateLimitConfig = {
  limit: 5,
  windowMs: 30 * 60 * 1000,
};
