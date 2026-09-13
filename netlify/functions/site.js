// seelischabstrakt site API. Reads and patches site.json (texts, design, shop rules, legal data) in the GitHub
// repository that Netlify deploys from. Same env vars as works.js: DESK_KEY, GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH.
// GET  /api/site                      -> site.json without the publish block
// POST /api/site  {action:"patch", patch:{...}}                 deep-merge into site.json (objects merge, arrays and scalars replace)
// POST /api/site  {action:"set", sets:[{path:"texts.heroMeta.de", value:"..."}]}   set single values by dotted path
// Allowed top-level keys: brand, theme, commerce, texts, printTiers, legal. publish is never touched.
const GH = "https://api.github.com";
const ALLOWED = ["brand", "theme", "commerce", "texts", "printTiers", "legal"];
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, x-desk-key",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};
const json = (status, body) => ({ statusCode: status, headers: cors, body: JSON.stringify(body) });
const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);

async function gh(path, opts = {}) {
  const r = await fetch(`${GH}/repos/${process.env.GITHUB_REPO}/contents/${path}${opts.q || ""}`, {
    method: opts.method || "GET",
    headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: "application/vnd.github+json", "Content-Type": "application/json", "User-Agent": "seelischabstrakt-desk" },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (r.status === 404 && (opts.method || "GET") === "GET") return null;
  if (!r.ok) throw new Error(`GitHub ${r.status} on ${path}: ${(await r.text()).slice(0, 200)}`);
  return r.json();
}
const branch = () => process.env.GITHUB_BRANCH || "main";
async function readJson(path) {
  const f = await gh(path, { q: `?ref=${branch()}` });
  if (!f) return { data: null, sha: undefined };
  return { data: JSON.parse(Buffer.from(f.content, "base64").toString("utf8")), sha: f.sha };
}
async function writeFile(path, contentBase64, message, sha) {
  return gh(path, { method: "PUT", body: { message, content: contentBase64, branch: branch(), sha } });
}

function merge(target, patch, trail = []) {
  for (const [k, v] of Object.entries(patch)) {
    if (k === "__proto__" || k === "constructor" || k === "prototype") continue;
    if (isObj(v) && isObj(target[k])) merge(target[k], v, trail.concat(k));
    else target[k] = v;
  }
  return target;
}
function setPath(obj, path, value) {
  const parts = String(path).split(".").filter(Boolean);
  if (!ALLOWED.includes(parts[0])) throw new Error(`Path must start with one of ${ALLOWED.join(", ")}: ${path}`);
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    if (k === "__proto__" || k === "constructor") throw new Error("Invalid path");
    if (Array.isArray(cur) && /^\d+$/.test(k)) { cur = cur[Number(k)]; continue; }
    if (!isObj(cur[k]) && !Array.isArray(cur[k])) cur[k] = {};
    cur = cur[k];
  }
  const last = parts[parts.length - 1];
  if (Array.isArray(cur) && /^\d+$/.test(last)) cur[Number(last)] = value; else cur[last] = value;
}
function validate(site) {
  const errs = [];
  if (!site.brand?.name) errs.push("brand.name must not be empty");
  if (site.commerce && typeof site.commerce.kleinunternehmer !== "boolean") errs.push("commerce.kleinunternehmer must be true or false");
  const rates = site.commerce?.shipping?.rates || {};
  for (const [reg, r] of Object.entries(rates)) { if (typeof r?.print !== "number" || typeof r?.original !== "number") errs.push(`commerce.shipping.rates.${reg} needs numeric print and original`); }
  if (site.printTiers && !Array.isArray(site.printTiers)) errs.push("printTiers must be an array");
  for (const l of ["en", "de"]) { const ui = site.texts?.ui?.[l]; if (ui !== undefined && !isObj(ui)) errs.push(`texts.ui.${l} must be an object of key: text`); }
  if (site.theme?.customCss !== undefined && typeof site.theme.customCss !== "string") errs.push("theme.customCss must be a string");
  if (typeof site.theme?.customCss === "string" && /<\/?script|@import|url\((?!["']?(data:|img\/))/i.test(site.theme.customCss)) errs.push("theme.customCss may not contain script tags, @import or external url()");
  return errs;
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: cors, body: "" };
  try {
    if (event.httpMethod === "GET") {
      const { data } = await readJson("site.json");
      if (!data) return json(404, { error: "site.json not found" });
      const { publish, ...pub } = data;
      return json(200, pub);
    }
    if (event.httpMethod !== "POST") return json(405, { error: "Use GET or POST" });
    const key = event.headers["x-desk-key"] || event.headers["X-Desk-Key"];
    if (!process.env.DESK_KEY || key !== process.env.DESK_KEY) return json(401, { error: "Wrong or missing x-desk-key" });
    if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_REPO) return json(500, { error: "Server not configured: set GITHUB_TOKEN and GITHUB_REPO" });

    const body = JSON.parse(event.body || "{}");
    const action = body.action || (body.sets ? "set" : "patch");
    const { data: site, sha } = await readJson("site.json");
    if (!site) return json(404, { error: "site.json not found" });
    const before = JSON.stringify(site);
    const changed = new Set();

    if (action === "patch") {
      const patch = body.patch || {};
      if (!isObj(patch)) return json(400, { error: "patch must be an object" });
      const bad = Object.keys(patch).filter((k) => !ALLOWED.includes(k));
      if (bad.length) return json(400, { error: `Not allowed at top level: ${bad.join(", ")}. Use ${ALLOWED.join(", ")}` });
      for (const k of Object.keys(patch)) { changed.add(k); if (isObj(patch[k]) && isObj(site[k])) merge(site[k], patch[k]); else site[k] = patch[k]; }
    } else if (action === "set") {
      const sets = Array.isArray(body.sets) ? body.sets : (body.path ? [{ path: body.path, value: body.value }] : []);
      if (!sets.length) return json(400, { error: "sets must be a list of {path, value}" });
      try { for (const s of sets) { setPath(site, s.path, s.value); changed.add(String(s.path).split(".")[0]); } } catch (e) { return json(400, { error: e.message }); }
    } else return json(400, { error: `Unknown action ${action}. Use patch or set` });

    const errs = validate(site);
    if (errs.length) return json(400, { error: errs.join("; ") });
    if (JSON.stringify(site) === before) return json(200, { ok: true, action, changed: [], message: "Nothing changed." });

    const message = body.message || `Update site: ${[...changed].join(", ")}`;
    const content = Buffer.from(JSON.stringify(site, null, 2) + "\n", "utf8").toString("base64");
    await writeFile("site.json", content, message, sha);
    const { publish, ...pub } = site;
    return json(200, { ok: true, action, changed: [...changed], site: pub, message: `${message}. Netlify is rebuilding; live in about a minute.` });
  } catch (e) {
    return json(500, { error: e.message });
  }
};
