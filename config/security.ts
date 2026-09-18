/**
 * The Content Security Policy, in one place, because it is delivered in two very
 * different ways.
 *
 * On a server (Vercel, Netlify, a container) next.config.ts sends it as a
 * response header, together with X-Frame-Options, Referrer-Policy and the rest.
 * The static demo has no server: `output: "export"` writes plain files, and a
 * plain file host sends whatever headers it likes. Everything headers() declares
 * is simply absent there. So the export carries the policy as a meta element in
 * the document head instead, see app/layout.tsx.
 *
 * A meta element cannot carry every directive. frame-ancestors and
 * X-Frame-Options are ignored in meta by specification, which is why the demo
 * cannot forbid being framed and the pages on a real server can. That is the one
 * difference between the two ways, and it is the reason the demo is a demo.
 *
 * script-src and style-src still carry 'unsafe-inline'. The mode bootstrap and
 * the reveal fallback in app/layout.tsx are inline by necessity, they have to run
 * before the first paint, and Next injects inline bootstrap scripts and styles of
 * its own. Tightening this to nonces means a middleware that stamps a fresh nonce
 * per request, which turns every statically generated page into a dynamically
 * rendered one. That is a deployment decision, not a code one, and it is listed
 * in the README under what has to be settled before going live.
 */
const DIRECTIVES = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline'",
  "connect-src 'self'",
  "upgrade-insecure-requests",
];

/** For the response header. Carries frame-ancestors, which meta cannot. */
export const CSP_HEADER = ["frame-ancestors 'none'", ...DIRECTIVES].join("; ");

/** For the meta element in the static export. */
export const CSP_META = DIRECTIVES.join("; ");
