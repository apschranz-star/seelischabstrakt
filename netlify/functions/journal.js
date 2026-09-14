// Journal API for the personal page (portfolio/journal.json). Same repository, same env vars as works.js and site.js:
// DESK_KEY, GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH.
// GET  /api/journal                                           -> the whole journal.json
// POST /api/journal {action:"patch", patch:{...}}              deep merge into journal.json
// POST /api/journal {action:"set", sets:[{path,value}]}        write single values by dotted path
// POST /api/journal {action:"chapter", chapter:{...}}          add or update one story chapter (matched by id)
// POST /api/journal {action:"deleteChapter", id:"..."}         remove one chapter
// POST /api/journal {action:"post", post:{...}}                add or update one blog post (matched by id)
// POST /api/journal {action:"deletePost", id:"..."}            remove one post
// POST /api/journal {action:"comment", comment:{...}}          publish a reader comment, or add a reply from Alexander
// POST /api/journal {action:"hideComment", id:"..."}           take a published comment off the page
// POST /api/journal {action:"deleteComment", id:"..."}         remove a comment for good
// POST /api/journal {action:"image", name:"...", imageBase64|imageUrl}   put a photo into portfolio/img/
const GH = "https://api.github.com";
const FILE = "portfolio/journal.json";
const IMGDIR = "portfolio/img/";
const ALLOWED = ["profile", "nav", "story", "writing", "commentForm", "comments", "contact", "footer", "seo"];
const LANGS = ["en", "de"];
const MAXCHAPTERS = 6;

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
const today = () => new Date().toISOString().slice(0, 10);

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
  if (f.encoding !== "base64" || !f.content) throw new Error(`${path} is larger than 1 MB and can no longer be read through the API. Edit it in GitHub, remove the oversized text and try again.`);
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
    if (cur[k] !== undefined && !isObj(cur[k]) && !Array.isArray(cur[k])) throw new Error(`${parts.slice(0, i + 1).join(".")} is a single value, so nothing can sit underneath it. Set ${parts.slice(0, i + 1).join(".")} itself.`);
    if (!isObj(cur[k]) && !Array.isArray(cur[k])) cur[k] = {};
    cur = cur[k];
  }
  const last = parts[parts.length - 1];
  if (last === "__proto__" || last === "constructor" || last === "prototype") throw new Error("Invalid path");
  if (Array.isArray(cur) && /^\d+$/.test(last)) cur[Number(last)] = value; else cur[last] = value;
}

// Text fields are {en, de}. A named language overwrites only that language, an empty side
// is filled from the other one, and a bare string is refused once text already exists.
const pairInto = (v, cur) => {
  const out = { en: String((cur && cur.en) || ""), de: String((cur && cur.de) || "") };
  if (typeof v === "string") {
    if (out.en || out.de) return null;
    return { en: v, de: v };
  }
  if (!isObj(v)) return null;
  if (v.en !== undefined) out.en = String(v.en);
  if (v.de !== undefined) out.de = String(v.de);
  if (!out.en) out.en = out.de;
  if (!out.de) out.de = out.en;
  return out;
};
const pairListInto = (v, cur) => {
  const arr = (x) => (Array.isArray(x) ? x.map(String) : []);
  const out = { en: arr(cur && cur.en), de: arr(cur && cur.de) };
  if (Array.isArray(v)) {
    if (out.en.length || out.de.length) return null;
    return { en: v.map(String), de: v.map(String) };
  }
  if (!isObj(v)) return null;
  if (Array.isArray(v.en)) out.en = v.en.map(String);
  if (Array.isArray(v.de)) out.de = v.de.map(String);
  if (!out.en.length) out.en = out.de.slice();
  if (!out.de.length) out.de = out.en.slice();
  return out;
};
// every string value that carries a dash, with the path where it sits
function dashPaths(v, path = "", out = []) {
  if (typeof v === "string") { if (/[–—]/.test(v)) out.push({ path: path || "(root)", value: v }); }
  else if (Array.isArray(v)) v.forEach((x, i) => dashPaths(x, `${path}[${i}]`, out));
  else if (isObj(v)) for (const [k, x] of Object.entries(v)) dashPaths(x, path ? `${path}.${k}` : k, out);
  return out;
}

function imageInto(inc, cur) {
  const img = isObj(cur) ? JSON.parse(JSON.stringify(cur)) : { src: "", caption: { en: "", de: "" } };
  if (!isObj(inc)) throw new Error("image must be an object with src and caption");
  if (inc.src !== undefined) img.src = String(inc.src);
  if (inc.size !== undefined) img.size = String(inc.size);
  if (inc.caption !== undefined) {
    const p = pairInto(inc.caption, img.caption);
    if (!p) throw new Error('caption already exists in both languages, so send it as {"en": "...", "de": "..."}');
    img.caption = p;
  }
  return img;
}

function normaliseChapter(inc, existing) {
  const c = existing ? JSON.parse(JSON.stringify(existing))
    : { id: "", title: { en: "", de: "" }, period: { en: "", de: "" }, paragraphs: { en: [], de: [] }, image: { src: "", caption: { en: "", de: "" } } };
  if (inc.id) c.id = slug(inc.id);
  for (const k of ["title", "period"]) if (inc[k] !== undefined) {
    const p = pairInto(inc[k], c[k]);
    if (!p) throw new Error(`${k} already exists in both languages, so send it as {"en": "...", "de": "..."} and not as one text`);
    c[k] = p;
  }
  if (inc.paragraphs !== undefined) {
    const p = pairListInto(inc.paragraphs, c.paragraphs);
    if (!p) throw new Error('paragraphs already exist, so send them as {"en": [...], "de": [...]} and not as one list');
    c.paragraphs = p;
  }
  if (inc.draft !== undefined) { if (inc.draft) c.draft = true; else delete c.draft; }
  if (inc.image !== undefined) c.image = inc.image === null ? { src: "", caption: { en: "", de: "" } } : imageInto(inc.image, c.image);
  return c;
}

function normalisePost(inc, existing) {
  const p = existing ? JSON.parse(JSON.stringify(existing))
    : { id: "", date: today(), title: { en: "", de: "" }, excerpt: { en: "", de: "" }, paragraphs: { en: [], de: [] }, images: [] };
  if (inc.id) p.id = slug(inc.id);
  if (inc.date !== undefined) {
    const d = String(inc.date);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) throw new Error("date must look like 2026-09-14");
    p.date = d;
  }
  for (const k of ["title", "excerpt"]) if (inc[k] !== undefined) {
    const q = pairInto(inc[k], p[k]);
    if (!q) throw new Error(`${k} already exists in both languages, so send it as {"en": "...", "de": "..."} and not as one text`);
    p[k] = q;
  }
  if (inc.paragraphs !== undefined) {
    const q = pairListInto(inc.paragraphs, p.paragraphs);
    if (!q) throw new Error('paragraphs already exist, so send them as {"en": [...], "de": [...]} and not as one list');
    p.paragraphs = q;
  }
  if (inc.draft !== undefined) { if (inc.draft) p.draft = true; else delete p.draft; }
  if (inc.commentsClosed !== undefined) { if (inc.commentsClosed) p.commentsClosed = true; else delete p.commentsClosed; }
  if (inc.images !== undefined) {
    if (!Array.isArray(inc.images)) throw new Error("images must be a list, send [] to remove all photos");
    p.images = inc.images.map((im, i) => {
      const cur = Array.isArray(existing && existing.images) ? existing.images.find((x) => x && x.src === (isObj(im) ? String(im.src || "") : "")) : null;
      const out = imageInto(im, cur);
      if (!out.src) throw new Error(`image ${i} has no src`);
      return out;
    });
  }
  // an excerpt that was never written follows the first paragraph
  if (!p.excerpt.en && !p.excerpt.de && (p.paragraphs.en[0] || p.paragraphs.de[0])) {
    p.excerpt = { en: String(p.paragraphs.en[0] || p.paragraphs.de[0]), de: String(p.paragraphs.de[0] || p.paragraphs.en[0]) };
  }
  return p;
}

// Reader comments arrive by email through the Netlify form, not through this API.
// Alexander reads them and publishes the ones that belong on the page.
function normaliseComment(inc, existing, list) {
  const c = existing ? JSON.parse(JSON.stringify(existing)) : { id: "", post: "", name: "", text: "", date: today() };
  if (inc.post !== undefined) c.post = slug(inc.post);
  if (inc.name !== undefined) c.name = String(inc.name).slice(0, 60);
  if (inc.text !== undefined) c.text = String(inc.text).slice(0, 2000);
  if (inc.date !== undefined) {
    const d = String(inc.date);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) throw new Error("date must look like 2026-09-14");
    c.date = d;
  }
  if (inc.author !== undefined) {
    if (inc.author === "me") c.author = "me";
    else if (!inc.author) delete c.author;
    else throw new Error('author is either "me" for a reply from Alexander, or left out for a reader');
  }
  if (inc.approved !== undefined) { if (inc.approved === false) c.approved = false; else delete c.approved; }
  if (!c.post) throw new Error("comment needs post, the id of the text it belongs under");
  if (!c.text) throw new Error("comment needs text");
  if (!c.name) c.name = c.author === "me" ? "Alexander" : "Anonymous";
  if (!c.id) {
    const base = `${c.post}-${slug(c.name) || "reader"}`;
    let n = 1, id = `${base}-${n}`;
    while (list.some((x) => x && x.id === id)) { n += 1; id = `${base}-${n}`; }
    c.id = id;
  }
  return c;
}

function validate(j) {
  const errs = [];
  const strList = (v) => Array.isArray(v) && v.every((x) => typeof x === "string");
  if (!isObj(j.profile) || !j.profile.name) errs.push("profile.name must not be empty");

  const chapters = ((j.story || {}).chapters) || [];
  if (j.story && !Array.isArray(j.story.chapters)) errs.push("story.chapters must be a list");
  else {
    const ids = new Set();
    chapters.forEach((c, i) => {
      if (!c || !c.id) { errs.push(`chapter ${i} has no id`); return; }
      if (ids.has(c.id)) errs.push(`duplicate chapter id ${c.id}`);
      ids.add(c.id);
      if (!isObj(c.title)) errs.push(`chapter ${c.id}: title must be {en, de}`);
      if (!isObj(c.paragraphs)) errs.push(`chapter ${c.id}: paragraphs must be {en:[], de:[]}`);
      else {
        for (const l of LANGS) if (c.paragraphs[l] !== undefined && !strList(c.paragraphs[l])) errs.push(`chapter ${c.id}: paragraphs.${l} must be a list of sentences, each in quotation marks`);
        if (!c.draft && LANGS.some((l) => !Array.isArray(c.paragraphs[l]) || !c.paragraphs[l].length)) errs.push(`chapter ${c.id}: a published chapter needs paragraphs in English and in German, or set draft true`);
      }
      if (c.image && c.image.src && !/^img\//.test(c.image.src)) errs.push(`chapter ${c.id}: image.src must start with img/`);
    });
    const live = chapters.filter((c) => !c.draft).length;
    if (live > MAXCHAPTERS) errs.push(`${live} published chapters, the story is designed for at most ${MAXCHAPTERS}`);
  }

  const posts = ((j.writing || {}).posts) || [];
  if (j.writing && !Array.isArray(j.writing.posts)) errs.push("writing.posts must be a list");
  else {
    const ids = new Set();
    posts.forEach((p, i) => {
      if (!p || !p.id) { errs.push(`post ${i} has no id`); return; }
      if (ids.has(p.id)) errs.push(`duplicate post id ${p.id}`);
      ids.add(p.id);
      if (!isObj(p.title)) errs.push(`post ${p.id}: title must be {en, de}`);
      if (p.date !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(String(p.date))) errs.push(`post ${p.id}: date must look like 2026-09-14`);
      if (!isObj(p.paragraphs)) errs.push(`post ${p.id}: paragraphs must be {en:[], de:[]}`);
      else {
        for (const l of LANGS) if (p.paragraphs[l] !== undefined && !strList(p.paragraphs[l])) errs.push(`post ${p.id}: paragraphs.${l} must be a list of sentences, each in quotation marks`);
        if (!p.draft && LANGS.some((l) => !Array.isArray(p.paragraphs[l]) || !p.paragraphs[l].length)) errs.push(`post ${p.id}: a published text needs paragraphs in English and in German, or set draft true`);
      }
      if (p.images !== undefined && !Array.isArray(p.images)) errs.push(`post ${p.id}: images must be a list`);
      else (p.images || []).forEach((im, k) => {
        if (!im || !im.src) errs.push(`post ${p.id}: image ${k} has no src`);
        else if (!/^img\//.test(im.src)) errs.push(`post ${p.id}: image ${k} src must start with img/`);
      });
    });
  }

  if (j.comments !== undefined) {
    if (!Array.isArray(j.comments)) errs.push("comments must be a list");
    else {
      const postIds = new Set(posts.map((p) => p && p.id));
      const ids = new Set();
      j.comments.forEach((c, i) => {
        if (!isObj(c)) { errs.push(`comment ${i} must be an object`); return; }
        if (!c.id) errs.push(`comment ${i} has no id`);
        else if (ids.has(c.id)) errs.push(`duplicate comment id ${c.id}`);
        ids.add(c.id);
        if (typeof c.text !== "string" || !c.text) errs.push(`comment ${c.id || i}: text must not be empty`);
        if (typeof c.name !== "string" || !c.name) errs.push(`comment ${c.id || i}: name must not be empty`);
        if (!postIds.has(c.post)) errs.push(`comment ${c.id || i}: there is no text with the id ${c.post}`);
        if (c.author !== undefined && c.author !== "me") errs.push(`comment ${c.id || i}: author is either "me" or left out`);
      });
    }
  }
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
    const action = body.action || (body.chapter ? "chapter" : body.post ? "post" : body.comment ? "comment" : body.sets ? "set" : body.patch ? "patch" : "");

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
      return json(200, { ok: true, action, src: `img/${base}.${img.ext}`, message: `Photo stored as img/${base}.${img.ext}. Use that value as image.src.` });
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
    } else if (action === "chapter") {
      const inc = body.chapter || {};
      if (!inc.id && !inc.title) return json(400, { error: "chapter needs an id or a title" });
      const id = slug(inc.id || (isObj(inc.title) ? inc.title.en || inc.title.de : inc.title));
      j.story = isObj(j.story) ? j.story : {};
      j.story.chapters = Array.isArray(j.story.chapters) ? j.story.chapters : [];
      const i = j.story.chapters.findIndex((c) => c.id === id);
      let c;
      try { c = normaliseChapter({ ...inc, id }, i >= 0 ? j.story.chapters[i] : null); } catch (err) { return json(400, { error: err.message }); }
      if (c.image && c.image.src && (i < 0 || (j.story.chapters[i].image || {}).src !== c.image.src) && !(await fileExists(`portfolio/${c.image.src}`)))
        return json(400, { error: `There is no photo at portfolio/${c.image.src}. Upload it first with action image, then use the path it returns.` });
      if (i >= 0) { j.story.chapters[i] = c; message = message || `Journal: update chapter ${id}`; }
      else {
        const at = Number.isInteger(body.position) ? Math.max(0, Math.min(j.story.chapters.length, body.position)) : j.story.chapters.length;
        j.story.chapters.splice(at, 0, c);
        message = message || `Journal: add chapter ${id}`;
      }
    } else if (action === "deleteChapter") {
      const id = slug(body.id || "");
      const list = (j.story || {}).chapters || [];
      const i = list.findIndex((c) => c.id === id);
      if (i < 0) return json(404, { error: `No chapter with id ${id}` });
      list.splice(i, 1);
      message = message || `Journal: remove chapter ${id}`;
    } else if (action === "post") {
      const inc = body.post || {};
      if (!inc.id && !inc.title) return json(400, { error: "post needs an id or a title" });
      const id = slug(inc.id || (isObj(inc.title) ? inc.title.en || inc.title.de : inc.title));
      j.writing = isObj(j.writing) ? j.writing : {};
      j.writing.posts = Array.isArray(j.writing.posts) ? j.writing.posts : [];
      const i = j.writing.posts.findIndex((p) => p.id === id);
      let p;
      try { p = normalisePost({ ...inc, id }, i >= 0 ? j.writing.posts[i] : null); } catch (err) { return json(400, { error: err.message }); }
      const had = new Set((i >= 0 ? (j.writing.posts[i].images || []) : []).map((im) => im && im.src));
      for (const im of p.images || []) {
        if (im.src && !had.has(im.src) && !(await fileExists(`portfolio/${im.src}`)))
          return json(400, { error: `There is no photo at portfolio/${im.src}. Upload it first with action image, then use the path it returns.` });
      }
      if (i >= 0) { j.writing.posts[i] = p; message = message || `Journal: update text ${id}`; }
      else {
        const at = Number.isInteger(body.position) ? Math.max(0, Math.min(j.writing.posts.length, body.position)) : 0;
        j.writing.posts.splice(at, 0, p);
        message = message || `Journal: add text ${id}`;
      }
    } else if (action === "deletePost") {
      const id = slug(body.id || "");
      const list = (j.writing || {}).posts || [];
      const i = list.findIndex((p) => p.id === id);
      if (i < 0) return json(404, { error: `No text with id ${id}` });
      list.splice(i, 1);
      j.comments = (Array.isArray(j.comments) ? j.comments : []).filter((c) => c.post !== id);
      message = message || `Journal: remove text ${id}`;
    } else if (action === "comment") {
      const inc = body.comment || {};
      j.comments = Array.isArray(j.comments) ? j.comments : [];
      const id = inc.id ? String(inc.id) : "";
      const i = id ? j.comments.findIndex((c) => c.id === id) : -1;
      if (id && i < 0 && !inc.post) return json(404, { error: `No comment with id ${id}` });
      let c;
      try { c = normaliseComment({ ...inc, id }, i >= 0 ? j.comments[i] : null, j.comments); } catch (err) { return json(400, { error: err.message }); }
      const posts = (j.writing || {}).posts || [];
      const target = posts.find((p) => p.id === c.post);
      if (!target) return json(400, { error: `There is no text with the id ${c.post}. Ask for the journal first and use one of the ids under writing.posts.` });
      if (target.commentsClosed && c.author !== "me") return json(400, { error: `Comments are closed under ${c.post}.` });
      if (i >= 0) { j.comments[i] = c; message = message || `Journal: update comment ${c.id}`; }
      else { j.comments.push(c); message = message || `Journal: publish comment by ${c.name} under ${c.post}`; }
    } else if (action === "hideComment") {
      const id = String(body.id || "");
      const i = (Array.isArray(j.comments) ? j.comments : []).findIndex((c) => c.id === id);
      if (i < 0) return json(404, { error: `No comment with id ${id}` });
      j.comments[i].approved = false;
      message = message || `Journal: hide comment ${id}`;
    } else if (action === "deleteComment") {
      const id = String(body.id || "");
      const i = (Array.isArray(j.comments) ? j.comments : []).findIndex((c) => c.id === id);
      if (i < 0) return json(404, { error: `No comment with id ${id}` });
      j.comments.splice(i, 1);
      message = message || `Journal: remove comment ${id}`;
    } else {
      return json(400, { error: "Unknown action. Use patch, set, chapter, deleteChapter, post, deletePost, comment, hideComment, deleteComment or image" });
    }

    const errs = validate(j);
    if (errs.length) return json(400, { error: errs.join("; ") });
    if (JSON.stringify(j) === before) return json(200, { ok: true, action, message: "Nothing changed." });

    // A reader writes as a reader. Only Alexander's own texts are held to the house style.
    let stale = [];
    if (!["comment", "hideComment", "deleteComment"].includes(action)) {
      const had = new Set(dashPaths(JSON.parse(before)).map((h) => h.value));
      const now = dashPaths(j);
      const introduced = now.filter((h) => !had.has(h.value) && !/^comments\[/.test(h.path));
      if (introduced.length) return json(400, { error: `Dash character in ${introduced.map((h) => h.path).join(", ")}. Use a comma or a full stop. Nothing was written.` });
      stale = now.filter((h) => had.has(h.value) && !/^comments\[/.test(h.path)).map((h) => h.path);
    }

    const doc = JSON.stringify(j, null, 2) + "\n";
    if (Buffer.byteLength(doc, "utf8") > MAXDOC) return json(400, { error: "This change would make journal.json larger than 512 kB, so nothing was written. A photo or a very long text has probably ended up in a text field." });
    await writeFile(FILE, Buffer.from(doc, "utf8").toString("base64"), message, sha);
    return json(200, { ok: true, action, journal: j, message: `${message}. Netlify is rebuilding; live in about a minute.${stale.length ? ` Note: an older dash is still sitting in ${stale.join(", ")}.` : ""}` });
  } catch (e) {
    return json(500, { error: e.message });
  }
};
