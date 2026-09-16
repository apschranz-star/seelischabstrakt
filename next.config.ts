import type { NextConfig } from "next";

/**
 * Content Security Policy.
 *
 * Everything that can be locked down is locked down: no foreign origin may load
 * anything, the page cannot be framed, there are no plugins, and a form can only
 * post back to this origin.
 *
 * script-src and style-src still carry 'unsafe-inline'. The mode bootstrap and
 * the reveal fallback in app/layout.tsx are inline by necessity, they have to run
 * before the first paint, and Next injects inline bootstrap scripts and styles of
 * its own. Tightening this to nonces means a middleware that stamps a fresh nonce
 * per request, which turns all 19 statically generated pages into dynamically
 * rendered ones. That is a deployment decision, not a code one, and it is listed
 * in the README under what has to be settled before going live.
 */
const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline'",
  "connect-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: CSP },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
