// Password gate for the Studio desk. /desk and /admin.html are rewritten to this function (netlify.toml).
// The browser asks for a name and password (HTTP Basic Auth); only the password is checked, against the
// env var DESK_PASSWORD (Netlify -> Site configuration -> Environment variables). The name can be anything.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const same = (a, b) => {
  const x = Buffer.from(String(a), "utf8"), y = Buffer.from(String(b), "utf8");
  if (x.length !== y.length) return false;
  return crypto.timingSafeEqual(x, y);
};
const text = (status, body, extra = {}) => ({ statusCode: status, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow", ...extra }, body });

exports.handler = async (event) => {
  const pw = process.env.DESK_PASSWORD;
  if (!pw) return text(503, "Studio desk is locked. Set DESK_PASSWORD in the Netlify environment variables and redeploy.");
  const auth = event.headers.authorization || event.headers.Authorization || "";
  let ok = false;
  if (auth.startsWith("Basic ")) {
    const decoded = Buffer.from(auth.slice(6), "base64").toString("utf8");
    const i = decoded.indexOf(":");
    ok = same(i >= 0 ? decoded.slice(i + 1) : decoded, pw);
  }
  if (!ok) return text(401, "Studio desk: password required.", { "WWW-Authenticate": 'Basic realm="Studio desk", charset="UTF-8"' });
  const candidates = [path.join(process.cwd(), "admin.html"), path.join(__dirname, "admin.html"), path.join(__dirname, "..", "..", "admin.html"), path.join(__dirname, "..", "..", "..", "admin.html")];
  for (const f of candidates) {
    try { const html = fs.readFileSync(f, "utf8"); return { statusCode: 200, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" }, body: html }; } catch (e) {}
  }
  return text(500, "admin.html is not in the function bundle. Check included_files in netlify.toml.");
};
