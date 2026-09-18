import type { NextConfig } from "next";

import { CSP_HEADER } from "./config/security";

/**
 * Static demo build.
 *
 * JING_STATIC_DEMO=1 turns the same source into a folder of HTML that any static
 * host can serve, GitHub Pages included, under the path in JING_BASE_PATH. The
 * route handlers cannot be exported, so scripts/build-static-demo.sh builds from
 * a copy of the tree without app/api, and the checkout computes its mock session
 * in the browser instead (see app/checkout/page.tsx). Nothing about the real
 * deployment changes: without the flag this file is what it always was.
 *
 * headers() below is dead in that build. A static export has no server to send a
 * header, so the demo carries its policy as a meta element instead; the two
 * wordings live together in config/security.ts.
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
        basePath: process.env.JING_BASE_PATH ?? "",
        trailingSlash: true,
      }
    : {}),

  /**
   * Only on a server. A static export ignores this whole function, see the note
   * above and config/security.ts.
   */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: CSP_HEADER },
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
