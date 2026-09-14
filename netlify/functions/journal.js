// Journal API for the personal page (portfolio/journal.json). Same repository, same env vars as works.js and site.js:
// DESK_KEY, GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH.
// GET  /api/journal                                        -> the whole journal.json
// POST /api/journal {action:"patch", patch:{...}}           deep merge into journal.json
// POST /api/journal {action:"set", sets:[{path,value}]}     write single values by dotted path
// POST /api/journal {action:"entry", entry:{...}}           add or update one entry (matched by id)
// POST /api/journal {action:"deleteEntry", id:"..."}        remove one entry
// POST /api/journal {action:"plate", plate:{...}}           add or update one plate (matched by src)
// POST /api/journal {action:"deletePlate", src:"..."}       remove one plate
// POST /api/journal {action:"image", name:"...", imageBase64|imageUrl}   put a photo into portfolio/img/
const GH = "https://api.github.com";
const FILE = "portfolio/journal.json";
const IMGDIR = "portfolio/img/";
const ALLOWED = ["masthead", "entries", "plates", "colophon", "seo"];
const LANGS = ["en", "de"];

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, x-desk-key",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};
const json = (status, body) => ({ statusCode: status, headers: cors, body: JSON.stringify(body) });
const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);
const slug = (s) => String(s || "").toLowerCase()
  .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
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
async function readJson(path) {
  const f = await gh(path, { q: `?ref=${branch()}` });
  if (!f) return { data: null, sha: undefined };
  return { data: JSON.parse(Buffer.from(f.content, "base64").toString("utf8")), sha: f.sha };
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
    if (!isObj(cur[k]) && !Array.isArray(cur[k])) cur[k] = {};
    cur = cur[k];
  }
  const last = parts[parts.length - 1];
  if (last === "__proto__" || last === "constructor" || last === "prototype") throw new Error("Invalid path");
  if (Array.isArray(cur) && /^\d+$/.test(last)) cur[Number(last)] = value; else cur[last] = value;
}

// text fields are {en, de}; a plain string is accepted and stored for both
const pair = (v) => (typeof v === "string" ? { en: v, de: v } : (isObj(v) ? { en: String(v.en || v.de || ""), de: String(v.de || v.en || "") } : null));
const pairList = (v) => {
  if (Array.isArray(v)) return { en: v.map(String), de: v.map(String) };
  if (isObj(v)) return { en: (v.en || v.de || []).map(String), de: (v.de || v.en || []).map(String) };
  return null;
};

function normaliseEntry(inc, existing) {
  const e = existing ? JSON.parse(JSON.stringify(existing)) : { id: "", kicker: { en: "", de: "" }, title: { en: "", de: "" }, standfirst: { en: "", de: "" }, paragraphs: { en: [], de: [] }, pullquote: { en: "", de: "" }, figure: { src: "", layout: "block", caption: { en: "", de: "" } } };
  if (inc.id) e.id = slug(inc.id);
  for (const k of ["kicker", "title", "standfirst", "pullquote"]) if (inc[k] !== undefined) { const p = pair(inc[k]); if (!p) throw new Error(`${k} must be a string or {en, de}`); e[k] = p; }
  if (inc.paragraphs !== undefined) { const p = pairList(inc.paragraphs); if (!p) throw new Error("paragraphs must be a list or {en:[], de:[]}"); e.paragraphs = p; }
  if (inc.draft !== undefined) { if (inc.draft) e.draft = true; else delete e.draft; }
  if (inc.figure !== undefined) {
    if (!isObj(inc.figure)) throw new Error("figure must be an object");
    e.figure = e.figure || {};
    if (inc.figure.src !== undefined) e.figure.src = String(inc.figure.src);
    if (inc.figure.layout !== undefined) {
      if (!["block", "plate"].includes(inc.figure.layout)) throw new Error('figure.layout must be "block" or "plate"');
      e.figure.layout = inc.figure.layout;
    }
    if (inc.figure.caption !== undefined) { const p = pair(inc.figure.caption); if (!p) throw new Error("figure.caption must be a string or {en, de}"); e.figure.caption = p; }
    if (inc.figure.size !== undefined) e.figure.size = String(inc.figure.size);
  }
  if (inc.factbox !== undefined) {
    if (inc.factbox === null) delete e.factbox;
    else {
      if (!isObj(inc.factbox)) throw new Error("factbox must be an object or null");
      const t = pair(inc.factbox.title), items = pairList(inc.factbox.items);
      if (!t || !items) throw new Error("factbox needs title and items");
      e.factbox = { title: t, items };
    }
  }
  return e;
}

function validate(j) {
  const errs = [];
  if (!isObj(j.masthead) || !j.masthead.name) errs.push("masthead.name must not be empty");
  if (!Array.isArray(j.entries)) errs.push("entries must be a list");
  else {
    const ids = new Set();
    j.entries.forEach((e, i) => {
      if (!e || !e.id) { errs.push(`entry ${i} has no id`); return; }
      if (ids.has(e.id)) errs.push(`duplicate entry id ${e.id}`);
      ids.add(e.id);
      for (const k of ["kicker", "title"]) if (!isObj(e[k])) errs.push(`entry ${e.id}: ${k} must be {en, de}`);
      if (!isObj(e.paragraphs) || !LANGS.some((l) => Array.isArray(e.paragraphs[l]))) errs.push(`entry ${e.id}: paragraphs must be {en:[], de:[]}`);
      if (e.figure && e.figure.layout && !["block", "plate"].includes(e.figure.layout)) errs.push(`entry ${e.id}: figure.layout must be block or plate`);
      if (e.figure && e.figure.src && !/^img\//.test(e.figure.src)) errs.push(`entry ${e.id}: figure.src must start with img/`);
    });
    const live = j.entries.filter((e) => !e.draft).length;
    if (live > 6) errs.push(`${live} published entries, the page is designed for at most six`);
  }
  if (j.plates && !Array.isArray(j.plates.items)) errs.push("plates.items must be a list");
  if (j.plates && Array.isArray(j.plates.items)) j.plates.items.forEach((p, i) => {
    if (!p || !p.src) errs.push(`plate ${i} has no src`);
    else if (!/^img\//.test(p.src)) errs.push(`plate ${i}: src must start with img/`);
  });
  const txt = JSON.stringify(j);
  if (/[–—]/.test(txt)) errs.push("the text contains a dash character, use a comma or a full stop");
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
    const action = body.action || (body.entry ? "entry" : body.sets ? "set" : body.patch ? "patch" : "");

    // photo upload does not touch journal.json
    if (action === "image") {
      let img;
      try {
        if (body.imageBase64) img = { b64: String(body.imageBase64).replace(/^data:image\/\w+;base64,/, ""), ext: "jpg" };
        else if (body.imageUrl) img = await fetchImage(body.imageUrl);
        else return json(400, { error: "Send imageBase64 or imageUrl" });
      } catch (e) { return json(400, { error: e.message }); }
      const base = slug(body.name || "photo") || "photo";
      const path = `${IMGDIR}${base}.${img.ext}`;
      const existing = await gh(path, { q: `?ref=${branch()}` });
      await writeFile(path, img.b64, `Journal photo ${base}.${img.ext}`, existing ? existing.sha : undefined);
      return json(200, { ok: true, action, src: `img/${base}.${img.ext}`, message: `Photo stored as img/${base}.${img.ext}. Use that value as figure.src or plate src.` });
    }

    const { data: j, sha } = await readJson(FILE);
    if (!j) return json(404, { error: `${FILE} not found` });
    const before = JSON.stringify(j);
    let message = body.message || "";

    if (action === "patch") {
      const patch = body.patch || {};
      if (!isObj(patch)) return json(400, { error: "patch must be an object" });
      const bad = Object.keys(patch).filter((k) => !ALLOWED.includes(k));
      if (bad.length) return json(400, { error: `Not allowed at top level: ${bad.join(", ")}. Use ${ALLOWED.join(", ")}` });
      for (const k of Object.keys(patch)) { if (isObj(patch[k]) && isObj(j[k])) merge(j[k], patch[k]); else j[k] = patch[k]; }
      message = message || `Journal: update ${Object.keys(patch).join(", ")}`;
    } else if (action === "set") {
      const sets = Array.isArray(body.sets) ? body.sets : (body.path ? [{ path: body.path, value: body.value }] : []);
      if (!sets.length) return json(400, { error: "sets must be a list of {path, value}" });
      try { for (const s of sets) setPath(j, s.path, s.value); } catch (e) { return json(400, { error: e.message }); }
      message = message || `Journal: set ${sets.map((s) => s.path).join(", ")}`;
    } else if (action === "entry") {
      const inc = body.entry || {};
      if (!inc.id && !inc.title) return json(400, { error: "entry needs an id or a title" });
      const id = slug(inc.id || (isObj(inc.title) ? inc.title.en || inc.title.de : inc.title));
      j.entries = Array.isArray(j.entries) ? j.entries : [];
      const i = j.entries.findIndex((e) => e.id === id);
      let e;
      try { e = normaliseEntry({ ...inc, id }, i >= 0 ? j.entries[i] : null); } catch (err) { return json(400, { error: err.message }); }
      if (i >= 0) { j.entries[i] = e; message = message || `Journal: update entry ${id}`; }
      else {
        const at = Number.isInteger(body.position) ? Math.max(0, Math.min(j.entries.length, body.position)) : j.entries.length;
        j.entries.splice(at, 0, e);
        message = message || `Journal: add entry ${id}`;
      }
    } else if (action === "deleteEntry") {
      const id = slug(body.id || "");
      const i = (j.entries || []).findIndex((e) => e.id === id);
      if (i < 0) return json(404, { error: `No entry with id ${id}` });
      j.entries.splice(i, 1);
      message = message || `Journal: remove entry ${id}`;
    } else if (action === "plate") {
      const p = body.plate || {};
      if (!p.src) return json(400, { error: "plate needs src" });
      const src = String(p.src);
      if (!/^img\//.test(src)) return json(400, { error: "plate src must start with img/" });
      const cap = p.caption !== undefined ? pair(p.caption) : { en: "", de: "" };
      if (!cap) return json(400, { error: "plate caption must be a string or {en, de}" });
      j.plates = j.plates || { items: [] };
      j.plates.items = Array.isArray(j.plates.items) ? j.plates.items : [];
      const i = j.plates.items.findIndex((x) => x.src === src);
      const item = { src, caption: cap };
      if (p.size) item.size = String(p.size);
      if (i >= 0) { j.plates.items[i] = { ...j.plates.items[i], ...item }; message = message || `Journal: update plate ${src}`; }
      else {
        const at = Number.isInteger(body.position) ? Math.max(0, Math.min(j.plates.items.length, body.position)) : j.plates.items.length;
        j.plates.items.splice(at, 0, item);
        message = message || `Journal: add plate ${src}`;
      }
    } else if (action === "deletePlate") {
      const src = String(body.src || "");
      const i = ((j.plates || {}).items || []).findIndex((x) => x.src === src);
      if (i < 0) return json(404, { error: `No plate with src ${src}` });
      j.plates.items.splice(i, 1);
      message = message || `Journal: remove plate ${src}`;
    } else {
      return json(400, { error: "Unknown action. Use patch, set, entry, deleteEntry, plate, deletePlate or image" });
    }

    const errs = validate(j);
    if (errs.length) return json(400, { error: errs.join("; ") });
    if (JSON.stringify(j) === before) return json(200, { ok: true, action, message: "Nothing changed." });

    await writeFile(FILE, Buffer.from(JSON.stringify(j, null, 2) + "\n", "utf8").toString("base64"), message, sha);
    return json(200, { ok: true, action, journal: j, message: `${message}. Netlify is rebuilding; live in about a minute.` });
  } catch (e) {
    return json(500, { error: e.message });
  }
};
