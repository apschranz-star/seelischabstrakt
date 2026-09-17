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

/**
 * Static demo build.
 *
 * JING_STATIC_DEMO=1 turns the same source into a folder of HTML that any static
 * host can serve, GitHub Pages included, under the path in JING_BASE_PATH. The
 * route handlers cannot be exported, so scripts/build-static-demo.sh builds from
 * a copy of the tree without app/api, and the checkout computes its mock session
 * in the browser instead (see app/checkout/page.tsx). Nothing about the real
 * deployment changes: without the flag this file is what it always was.
 */
const STATIC_DEMO = process.env.JING_STATIC_DEMO === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    unoptimized: STATIC_DEMO,
  },
  ...(STATIC_DEMO
    ? {
        output: "export" as const,
        // Its own build directory, so a demo build never disturbs a running
        // production build of the same checkout.
        distDir: ".next-demo",
        basePath: process.env.JING_BASE_PATH ?? "",
        trailingSlash: true,
      }
    : {}),

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
