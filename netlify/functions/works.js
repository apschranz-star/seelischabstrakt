// seelischabstrakt shop API. Writes works.json and photos into the GitHub repository that Netlify deploys from.
// Env vars (Netlify → Site configuration → Environment variables):
//   DESK_KEY        a long secret you choose; callers send it as header x-desk-key
//   GITHUB_TOKEN    fine-grained token, Contents: read and write, this repo only
//   GITHUB_REPO     owner/repo, e.g. a-schranz/seelischabstrakt
//   GITHUB_BRANCH   main
const GH = "https://api.github.com";
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, x-desk-key",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};
const json = (status, body) => ({ statusCode: status, headers: cors, body: JSON.stringify(body) });
const slug = (s) => String(s || "").toLowerCase().replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/ß/g,"ss").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"") || ("work-" + Date.now());

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
  if (f.encoding !== "base64" || !f.content) throw new Error(`${path} is larger than 1 MB and can no longer be read through the API. Open the Studio desk, remove the oversized text and publish again.`);
  return { data: JSON.parse(Buffer.from(f.content, "base64").toString("utf8")), sha: f.sha };
}
async function writeFile(path, contentBase64, message, sha) {
  return gh(path, { method: "PUT", body: { message, content: contentBase64, branch: branch(), sha } });
}
async function fetchImage(url) {
  const r = await fetch(url, { headers: { "User-Agent": "seelischabstrakt-desk" } });
  if (!r.ok) throw new Error(`Image download failed: ${r.status}`);
  const ct = r.headers.get("content-type") || "";
  if (!/image\/(jpeg|jpg|png|webp)/.test(ct)) throw new Error(`Not an image: ${ct}`);
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length > 6 * 1024 * 1024) throw new Error("Image larger than 6 MB; resize first");
  return { b64: buf.toString("base64"), ext: ct.includes("png") ? "png" : ct.includes("webp") ? "webp" : "jpg" };
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: cors, body: "" };
  try {
    if (event.httpMethod === "GET") {
      const { data } = await readJson("works.json");
      return json(200, { works: (data?.works || []).map(({ id, title, year, w, h, medium, original, prints, img, caption }) => ({ id, title, year, w, h, medium, original, prints, img, caption })) });
    }
    if (event.httpMethod !== "POST") return json(405, { error: "Use GET or POST" });
    const key = event.headers["x-desk-key"] || event.headers["X-Desk-Key"];
    if (!process.env.DESK_KEY || key !== process.env.DESK_KEY) return json(401, { error: "Wrong or missing x-desk-key" });
    if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_REPO) return json(500, { error: "Server not configured: set GITHUB_TOKEN and GITHUB_REPO" });

    const body = JSON.parse(event.body || "{}");
    const action = body.action || (body.id ? "update" : "add");
    const { data: worksFile, sha } = await readJson("works.json");
    const works = worksFile?.works || [];
    let work, message;

    if (action === "delete") {
      const i = works.findIndex((x) => x.id === body.id);
      if (i < 0) return json(404, { error: `No work with id ${body.id}` });
      const [removed] = works.splice(i, 1); work = removed; message = `Remove ${removed.title}`;
    } else {
      const incoming = body.work || body;
      let existing = incoming.id ? works.find((x) => x.id === incoming.id) : null;
      if (action === "update" && !existing) return json(404, { error: `No work with id ${incoming.id}` });
      if (!existing) {
        for (const k of ["title", "w", "h", "price"])
          if (incoming[k] === undefined || incoming[k] === "") return json(400, { error: `${k} is required on a new work. Ask Alexander for it; nothing was written.` });
        existing = { id: slug(incoming.title), title: incoming.title, year: new Date().getFullYear(), medium: { en: "", de: "" }, w: 30, h: 24, size: "", tilt: 0, nomat: false, original: { price: 0, available: true, link: "" }, prints: [] };
        if (works.some((x) => x.id === existing.id)) return json(409, { error: `A work with the id ${existing.id} already exists. To change it send that id, to add a second one give it a different title.` });
        works.unshift(existing);
        message = `Add ${existing.title}`;
      } else message = `Update ${existing.title}`;
      // merge simple fields
      for (const k of ["title", "size", "nomat", "style"]) if (incoming[k] !== undefined) existing[k] = incoming[k];
      for (const k of ["medium", "caption", "alt"]) if (incoming[k] !== undefined) existing[k] = typeof incoming[k] === "string" ? { en: incoming[k], de: existing[k]?.de || "" } : { ...(existing[k] || {}), ...incoming[k] };
      const num = (v, what) => { if (typeof v !== "number" || !Number.isFinite(v)) throw new Error(`${what} must be a plain number without quotation marks and without a thousands separator, for example 4800`); return v; };
      try {
        for (const k of ["year", "w", "h", "tilt", "seed"]) if (incoming[k] !== undefined) existing[k] = num(incoming[k], k);
        if (incoming.price !== undefined) existing.original.price = num(incoming.price, "price");
        if (incoming.available !== undefined) existing.original.available = !!incoming.available;
        if (incoming.link !== undefined) existing.original.link = String(incoming.link);
        if (incoming.original) {
          const o = incoming.original;
          if (o.price !== undefined) existing.original.price = num(o.price, "original.price");
          if (o.available !== undefined) existing.original.available = !!o.available;
          if (o.link !== undefined) existing.original.link = String(o.link);
        }
        if (Array.isArray(incoming.prints)) existing.prints = incoming.prints.map((pr) => ({ size: String(pr.size || ""), price: num(pr.price, "print price"), link: pr.link ? String(pr.link) : "" }));
      } catch (e) { return json(400, { error: `${e.message}. Nothing was written.` }); }
      // photo: base64 (from add.html) or a public URL (from a chat that can hand over a link)
      let img;
      if (incoming.imageBase64) img = { b64: incoming.imageBase64.replace(/^data:image\/\w+;base64,/, ""), ext: "jpg" };
      else if (incoming.imageUrl) img = await fetchImage(incoming.imageUrl);
      if (img) {
        const path = `img/${slug(existing.title)}-${Date.now().toString(36)}.${img.ext}`;
        await writeFile(path, img.b64, `Photo for ${existing.title}`);
        existing.img = path;
      }
      work = existing;
    }
    const doc = JSON.stringify({ works }, null, 2);
    if (Buffer.byteLength(doc, "utf8") > MAXDOC) return json(400, { error: "This change would make works.json larger than 512 kB, so nothing was written. A photo or a very long text has probably ended up in a text field." });
    await writeFile("works.json", Buffer.from(doc, "utf8").toString("base64"), message, sha);
    return json(200, { ok: true, action, work, message: `${message}. Netlify is rebuilding; live in about a minute.` });
  } catch (e) {
    return json(500, { error: e.message });
  }
};
