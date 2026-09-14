// Practice API for the doctor's site (farida/content.json). Same repository and the same env vars
// as works.js, site.js and journal.js: DESK_KEY, GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH.
// GET  /api/practice                                            -> the whole content.json
// POST /api/practice {action:"patch", patch:{...}}               deep merge
// POST /api/practice {action:"set", sets:[{path,value}]}         single values by dotted path
// POST /api/practice {action:"service", service:{...}}           add or update one service (matched by the Italian name)
// POST /api/practice {action:"deleteService", name:"..."}        remove one service
// POST /api/practice {action:"review", review:{...}}             add or update one patient voice (needs consent true to appear)
// POST /api/practice {action:"deleteReview", id:"..."}           remove one
// POST /api/practice {action:"location", location:{...}}         add or update one practice address (matched by street)
// POST /api/practice {action:"deleteLocation", street:"..."}     remove one
// POST /api/practice {action:"image", name:"...", imageBase64|imageUrl}   put a photo into farida/img/
const GH = "https://api.github.com";
const FILE = "farida/content.json";
const IMGDIR = "farida/img/";
const ALLOWED = ["profile", "nav", "approach", "expertise", "services", "reviews", "practice", "legal", "ui", "seo", "footer"];
const LANGS = ["it", "en", "de", "fr", "ar"];
const SRC = "it";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, x-desk-key",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};
const json = (status, body) => ({ statusCode: status, headers: cors, body: JSON.stringify(body) });
const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);
const slug = (s) => String(s || "").toLowerCase()
  .normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

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
const MAXDOC = 512 * 1024;
async function readJson(path) {
  const f = await gh(path, { q: `?ref=${branch()}` });
  if (!f) return { data: null, sha: undefined };
  if (f.encoding !== "base64" || !f.content) throw new Error(`${path} is larger than 1 MB and can no longer be read through the API. Edit it in GitHub and try again.`);
  return { data: JSON.parse(Buffer.from(f.content, "base64").toString("utf8")), sha: f.sha };
}
async function fileExists(path) {
  try { return !!(await gh(path, { q: `?ref=${branch()}` })); } catch (e) { return true; }
}
async function writeFile(path, contentBase64, message, sha) {
  return gh(path, { method: "PUT", body: { message, content: contentBase64, branch: branch(), sha } });
}
async function fetchImage(url) {
  let u;
  try { u = new URL(url); } catch (e) { throw new Error("imageUrl is not a valid URL"); }
  if (u.protocol !== "https:") throw new Error("imageUrl must be https");
  const r = await fetch(u.toString(), { headers: { "User-Agent": "seelischabstrakt-desk" }, redirect: "follow" });
  if (!r.ok) throw new Error(`Image download failed: ${r.status}`);
  const ct = r.headers.get("content-type") || "";
  if (!/image\/(jpeg|jpg|png|webp)/.test(ct)) throw new Error(`Not an image: ${ct}`);
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length > 6 * 1024 * 1024) throw new Error("Image larger than 6 MB, resize first");
  return { b64: buf.toString("base64"), ext: ct.includes("png") ? "png" : ct.includes("webp") ? "webp" : "jpg" };
}

function merge(target, patch) {
  for (const [k, v] of Object.entries(patch)) {
    if (k === "__proto__" || k === "constructor" || k === "prototype") continue;
    if (isObj(v) && isObj(target[k])) merge(target[k], v);
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
    if (k === "__proto__" || k === "constructor" || k === "prototype") throw new Error("Invalid path");
    if (Array.isArray(cur) && /^\d+$/.test(k)) { cur = cur[Number(k)]; if (cur === undefined) throw new Error(`No item at ${path}`); continue; }
    if (cur[k] !== undefined && !isObj(cur[k]) && !Array.isArray(cur[k])) throw new Error(`${parts.slice(0, i + 1).join(".")} is a single value, so nothing can sit underneath it.`);
    if (!isObj(cur[k]) && !Array.isArray(cur[k])) cur[k] = {};
    cur = cur[k];
  }
  const last = parts[parts.length - 1];
  if (last === "__proto__" || last === "constructor" || last === "prototype") throw new Error("Invalid path");
  if (Array.isArray(cur) && /^\d+$/.test(last)) cur[Number(last)] = value; else cur[last] = value;
}

// Every text is {it, en, de, fr, ar}. Italian is the source. A named language overwrites only
// that language. A bare string is taken as Italian and only accepted while nothing is written yet.
const pairInto = (v, cur) => {
  const out = {};
  for (const l of LANGS) out[l] = String((cur && cur[l]) || "");
  if (typeof v === "string") {
    if (LANGS.some((l) => out[l])) return null;
    out[SRC] = v;
    return out;
  }
  if (!isObj(v)) return null;
  for (const l of LANGS) if (v[l] !== undefined) out[l] = String(v[l]);
  return out;
};
const emptyPair = () => Object.fromEntries(LANGS.map((l) => [l, ""]));
const hasSrc = (p) => !!(p && String(p[SRC] || "").trim());
function dashPaths(v, path = "", out = []) {
  if (typeof v === "string") { if (/[–—]/.test(v)) out.push({ path: path || "(root)", value: v }); }
  else if (Array.isArray(v)) v.forEach((x, i) => dashPaths(x, `${path}[${i}]`, out));
  else if (isObj(v)) for (const [k, x] of Object.entries(v)) dashPaths(x, path ? `${path}.${k}` : k, out);
  return out;
}
// which languages are still missing, so the answer can say so instead of silently publishing Italian everywhere
function missingLangs(node, out = new Set()) {
  if (isObj(node)) {
    const keys = Object.keys(node);
    if (LANGS.every((l) => keys.includes(l))) {
      if (String(node[SRC] || "").trim()) for (const l of LANGS) if (!String(node[l] || "").trim()) out.add(l);
      return out;
    }
    for (const v of Object.values(node)) missingLangs(v, out);
  } else if (Array.isArray(node)) node.forEach((v) => missingLangs(v, out));
  return out;
}

function normaliseService(inc, existing) {
  const s = existing ? JSON.parse(JSON.stringify(existing)) : { name: emptyPair(), text: emptyPair(), duration: "", price: "" };
  for (const k of ["name", "text"]) if (inc[k] !== undefined) {
    const p = pairInto(inc[k], s[k]);
    if (!p) throw new Error(`${k} already exists, so send it as {"it": "...", "en": "...", "de": "...", "fr": "...", "ar": "..."} and not as one text`);
    s[k] = p;
  }
  if (inc.duration !== undefined) s.duration = String(inc.duration);
  if (inc.price !== undefined) {
    // a price is either a plain string like "80 EUR" or a text in the five languages, for example free of charge
    if (isObj(inc.price)) { const p = pairInto(inc.price, isObj(s.price) ? s.price : null); if (!p) throw new Error("price already exists in five languages, send it the same way"); s.price = p; }
    else s.price = String(inc.price);
  }
  return s;
}
function normaliseLocation(inc, existing) {
  const l = existing ? JSON.parse(JSON.stringify(existing)) : { label: emptyPair(), street: "", zipCity: "", note: emptyPair(), mapUrl: "", hours: [] };
  for (const k of ["label", "note"]) if (inc[k] !== undefined) {
    const p = pairInto(inc[k], l[k]);
    if (!p) throw new Error(`${k} already exists, so send it in all five languages`);
    l[k] = p;
  }
  for (const k of ["street", "zipCity", "mapUrl"]) if (inc[k] !== undefined) l[k] = String(inc[k]);
  if (l.mapUrl && !/^https:\/\//.test(l.mapUrl)) throw new Error("mapUrl must be an https address");
  if (inc.hours !== undefined) {
    if (!Array.isArray(inc.hours)) throw new Error("hours must be a list of {day, time}");
    l.hours = inc.hours.map((h, i) => {
      if (!isObj(h) || !h.time) throw new Error(`hours ${i} needs time, for example 09:00 to 13:00 written with a hyphen`);
      const day = pairInto(h.day, null);
      if (!day) throw new Error(`hours ${i}: day must be a text in the five languages`);
      return { day, time: String(h.time) };
    });
  }
  return l;
}
function normaliseReview(inc, existing, list) {
  const r = existing ? JSON.parse(JSON.stringify(existing)) : { id: "", name: "", date: new Date().toISOString().slice(0, 10), text: "", consent: false };
  if (inc.name !== undefined) r.name = String(inc.name).slice(0, 60);
  if (inc.text !== undefined) r.text = String(inc.text).slice(0, 1200);
  if (inc.date !== undefined) {
    const d = String(inc.date);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) throw new Error("date must look like 2026-09-14");
    r.date = d;
  }
  if (inc.consent !== undefined) {
    if (typeof inc.consent !== "boolean") throw new Error("consent must be true or false");
    r.consent = inc.consent;
  }
  if (!r.text) throw new Error("a patient voice needs text");
  if (!r.name) r.name = "Anonimo";
  if (!r.id) {
    const base = slug(r.name) || "paziente";
    let n = 1, id = `${base}-${n}`;
    while (list.some((x) => x && x.id === id)) { n += 1; id = `${base}-${n}`; }
    r.id = id;
  }
  return r;
}

function validate(d) {
  const errs = [];
  if (!isObj(d.profile) || !d.profile.name) errs.push("profile.name must not be empty");
  if (d.profile && d.profile.bookingUrl && !/^https:\/\//.test(d.profile.bookingUrl)) errs.push("profile.bookingUrl must be an https address");
  if (d.profile && d.profile.photo && !/^img\//.test(d.profile.photo)) errs.push("profile.photo must start with img/");
  const sv = (d.services || {}).items || [];
  if (d.services && !Array.isArray(d.services.items)) errs.push("services.items must be a list");
  else sv.forEach((s, i) => { if (!hasSrc(s.name)) errs.push(`service ${i} has no Italian name`); });
  const qs = d.reviews ? d.reviews.quotes : [];
  if (d.reviews && qs !== undefined && !Array.isArray(qs)) errs.push("reviews.quotes must be a list");
  else (qs || []).forEach((q, i) => { if (!isObj(q) || !String(q.text || "").trim()) errs.push(`quoted review ${i} has no text`); });
  const rv = d.reviews ? d.reviews.items : [];
  if (d.reviews && !Array.isArray(rv)) errs.push("reviews.items must be a list");
  else (rv || []).forEach((r, i) => {
    if (!isObj(r)) { errs.push(`review ${i} must be an object`); return; }
    if (!String(r.text || "").trim()) errs.push(`review ${r.id || i} has no text`);
    if (r.consent !== true && r.consent !== false) errs.push(`review ${r.id || i}: consent must be true or false`);
  });
  const loc = (d.practice || {}).locations || [];
  if (d.practice && !Array.isArray(d.practice.locations)) errs.push("practice.locations must be a list");
  else loc.forEach((l, i) => { if (!String(l.street || "").trim() && !String(l.zipCity || "").trim()) errs.push(`location ${i} has neither street nor town`); });
  return errs;
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: cors, body: "" };
  try {
    if (event.httpMethod === "GET") {
      const { data } = await readJson(FILE);
      if (!data) return json(404, { error: `${FILE} not found` });
      return json(200, data);
    }
    if (event.httpMethod !== "POST") return json(405, { error: "Use GET or POST" });
    const key = event.headers["x-desk-key"] || event.headers["X-Desk-Key"];
    if (!process.env.DESK_KEY || key !== process.env.DESK_KEY) return json(401, { error: "Wrong or missing x-desk-key" });
    if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_REPO) return json(500, { error: "Server not configured: set GITHUB_TOKEN and GITHUB_REPO" });

    const body = JSON.parse(event.body || "{}");
    const action = body.action || (body.service ? "service" : body.review ? "review" : body.location ? "location" : body.sets ? "set" : body.patch ? "patch" : "");

    if (action === "image") {
      let img;
      try {
        if (body.imageBase64) img = { b64: String(body.imageBase64).replace(/^data:image\/\w+;base64,/, ""), ext: "jpg" };
        else if (body.imageUrl) img = await fetchImage(body.imageUrl);
        else return json(400, { error: "Send imageBase64 or imageUrl" });
      } catch (e) { return json(400, { error: e.message }); }
      const base = slug(body.name || "foto") || "foto";
      const path = `${IMGDIR}${base}.${img.ext}`;
      const existing = await gh(path, { q: `?ref=${branch()}` });
      await writeFile(path, img.b64, `Practice photo ${base}.${img.ext}`, existing ? existing.sha : undefined);
      return json(200, { ok: true, action, src: `img/${base}.${img.ext}`, message: `Photo stored as img/${base}.${img.ext}. Use that value as profile.photo.` });
    }

    const { data: d, sha } = await readJson(FILE);
    if (!d) return json(404, { error: `${FILE} not found` });
    const before = JSON.stringify(d);
    let message = body.message || "";

    if (action === "patch") {
      const patch = body.patch || {};
      if (!isObj(patch)) return json(400, { error: "patch must be an object" });
      const bad = Object.keys(patch).filter((k) => !ALLOWED.includes(k));
      if (bad.length) return json(400, { error: `Not allowed at top level: ${bad.join(", ")}. Use ${ALLOWED.join(", ")}` });
      for (const k of Object.keys(patch)) { if (isObj(patch[k]) && isObj(d[k])) merge(d[k], patch[k]); else d[k] = patch[k]; }
      message = message || `Practice: update ${Object.keys(patch).join(", ")}`;
    } else if (action === "set") {
      const sets = Array.isArray(body.sets) ? body.sets : (body.path ? [{ path: body.path, value: body.value }] : []);
      if (!sets.length) return json(400, { error: "sets must be a list of {path, value}" });
      try { for (const s of sets) setPath(d, s.path, s.value); } catch (e) { return json(400, { error: e.message }); }
      message = message || `Practice: set ${sets.map((s) => s.path).join(", ")}`;
    } else if (action === "service") {
      const inc = body.service || {};
      d.services = isObj(d.services) ? d.services : {};
      d.services.items = Array.isArray(d.services.items) ? d.services.items : [];
      const wanted = isObj(inc.name) ? String(inc.name.it || "") : String(inc.name || "");
      const key2 = slug(inc.id || wanted);
      if (!key2) return json(400, { error: "service needs a name, at least in Italian" });
      const i = d.services.items.findIndex((s) => slug(s.name && s.name.it) === key2);
      let s;
      try { s = normaliseService(inc, i >= 0 ? d.services.items[i] : null); } catch (e) { return json(400, { error: e.message }); }
      if (i >= 0) { d.services.items[i] = s; message = message || `Practice: update service ${key2}`; }
      else {
        const at = Number.isInteger(body.position) ? Math.max(0, Math.min(d.services.items.length, body.position)) : d.services.items.length;
        d.services.items.splice(at, 0, s);
        message = message || `Practice: add service ${key2}`;
      }
    } else if (action === "deleteService") {
      const key2 = slug(body.name || body.id || "");
      const list = (d.services || {}).items || [];
      const i = list.findIndex((s) => slug(s.name && s.name.it) === key2);
      if (i < 0) return json(404, { error: `No service called ${body.name || body.id}` });
      list.splice(i, 1);
      message = message || `Practice: remove service ${key2}`;
    } else if (action === "review") {
      const inc = body.review || {};
      d.reviews = isObj(d.reviews) ? d.reviews : {};
      d.reviews.items = Array.isArray(d.reviews.items) ? d.reviews.items : [];
      const id = inc.id ? String(inc.id) : "";
      const i = id ? d.reviews.items.findIndex((r) => r.id === id) : -1;
      if (id && i < 0) return json(404, { error: `No patient voice with id ${id}` });
      let r;
      try { r = normaliseReview(inc, i >= 0 ? d.reviews.items[i] : null, d.reviews.items); } catch (e) { return json(400, { error: e.message }); }
      if (i >= 0) d.reviews.items[i] = r; else d.reviews.items.push(r);
      message = message || `Practice: ${i >= 0 ? "update" : "add"} patient voice ${r.id}`;
      if (!r.consent) message += " (hidden, no consent recorded)";
    } else if (action === "deleteReview") {
      const id = String(body.id || "");
      const list = (d.reviews || {}).items || [];
      const i = list.findIndex((r) => r.id === id);
      if (i < 0) return json(404, { error: `No patient voice with id ${id}` });
      list.splice(i, 1);
      message = message || `Practice: remove patient voice ${id}`;
    } else if (action === "location") {
      const inc = body.location || {};
      d.practice = isObj(d.practice) ? d.practice : {};
      d.practice.locations = Array.isArray(d.practice.locations) ? d.practice.locations : [];
      const street = String(inc.street || "");
      const i = d.practice.locations.findIndex((l) => l.street && street && l.street === street);
      let l;
      try { l = normaliseLocation(inc, i >= 0 ? d.practice.locations[i] : null); } catch (e) { return json(400, { error: e.message }); }
      if (!String(l.street || "").trim() && !String(l.zipCity || "").trim()) return json(400, { error: "a practice address needs at least street or zipCity" });
      if (i >= 0) { d.practice.locations[i] = l; message = message || `Practice: update address ${l.street}`; }
      else { d.practice.locations.push(l); message = message || `Practice: add address ${l.street}`; }
    } else if (action === "deleteLocation") {
      const street = String(body.street || "");
      const list = (d.practice || {}).locations || [];
      const i = list.findIndex((l) => l.street === street);
      if (i < 0) return json(404, { error: `No address at ${street}` });
      list.splice(i, 1);
      message = message || `Practice: remove address ${street}`;
    } else {
      return json(400, { error: "Unknown action. Use patch, set, service, deleteService, review, deleteReview, location, deleteLocation or image" });
    }

    if (d.profile && d.profile.photo && !(await fileExists(`farida/${d.profile.photo}`)))
      return json(400, { error: `There is no photo at farida/${d.profile.photo}. Upload it first with action image.` });

    const errs = validate(d);
    if (errs.length) return json(400, { error: errs.join("; ") });
    if (JSON.stringify(d) === before) return json(200, { ok: true, action, message: "Nothing changed." });

    // a patient wrote what they wrote; only the texts of the practice follow the house style
    let stale = [];
    if (action !== "review" && action !== "deleteReview") {
      const had = new Set(dashPaths(JSON.parse(before)).map((h) => h.value));
      const now = dashPaths(d);
      const introduced = now.filter((h) => !had.has(h.value) && !/^reviews\.items/.test(h.path));
      if (introduced.length) return json(400, { error: `Dash character in ${introduced.map((h) => h.path).join(", ")}. Use a comma or a full stop. Nothing was written.` });
      stale = now.filter((h) => had.has(h.value) && !/^reviews\.items/.test(h.path)).map((h) => h.path);
    }

    const doc = JSON.stringify(d, null, 2) + "\n";
    if (Buffer.byteLength(doc, "utf8") > MAXDOC) return json(400, { error: "This change would make content.json larger than 512 kB, so nothing was written." });
    await writeFile(FILE, Buffer.from(doc, "utf8").toString("base64"), message, sha);
    const missing = [...missingLangs(d)];
    return json(200, {
      ok: true, action, content: d,
      message: `${message}. Netlify is rebuilding; live in about a minute.`
        + (missing.length ? ` Still missing in ${missing.join(", ")}, Italian is shown there in the meantime.` : "")
        + (stale.length ? ` Note: an older dash is still sitting in ${stale.join(", ")}.` : ""),
    });
  } catch (e) {
    return json(500, { error: e.message });
  }
};
