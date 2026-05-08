import { headers } from "next/headers";

/**
 * Returns the best-guess client IP address from Next.js request headers.
 * Falls back to "unknown" when running outside an HTTP context (e.g. tests).
 *
 * Header priority:
 *  1. x-forwarded-for  (set by Vercel / most reverse proxies)
 *  2. x-real-ip        (set by nginx)
 *  3. "unknown"
 */
export async function getClientIp(): Promise<string> {
  try {
    const h = await headers();
    const xff = h.get("x-forwarded-for");
    if (xff) {
      // "x-forwarded-for" can be a comma-separated list; the first entry is the client.
      return xff.split(",")[0].trim();
    }
    const xri = h.get("x-real-ip");
    if (xri) return xri.trim();
  } catch {
    // headers() throws outside a request context
  }
  return "unknown";
}
