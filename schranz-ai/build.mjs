#!/usr/bin/env node
/*
 * Builds the SCHRANZ AI SOLUTIONS site from content.json into dist/.
 *
 *   node build.mjs                      site at the domain root (Netlify)
 *   SITE_BASE=/seelischabstrakt/schranz-ai node build.mjs   under a path (GitHub Pages)
 *   SITE_URL=https://example.com node build.mjs             absolute URLs for hreflang and og
 *
 * Output: dist/index.html (German), dist/en/index.html (English), the legal
 * pages in both languages, 404.html, robots.txt, sitemap.xml and the deck.
 * No dependencies. Node 18 or newer.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, copyFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const content = JSON.parse(readFileSync(join(here, "content.json"), "utf8"));
const css = readFileSync(join(here, "styles.css"), "utf8");
const js = readFileSync(join(here, "site.js"), "utf8");

const BASE = (process.env.SITE_BASE ?? "").replace(/\/$/, "");
const URL_ROOT = (process.env.SITE_URL ?? content.site.url).replace(/\/$/, "");
const LANGS = ["de", "en"];
const DEFAULT_LANG = "de";

/* ---------- helpers ---------- */

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** t(node, lang): a bilingual {en, de} node or a plain string. Fails loudly on a missing language. */
function t(node, lang, path = "") {
  if (node == null) throw new Error(`Missing text at ${path}`);
  if (typeof node === "string") return esc(node);
  if (typeof node[lang] !== "string" || node[lang].trim() === "") {
    throw new Error(`Missing ${lang} text at ${path || JSON.stringify(node)}`);
  }
  return esc(node[lang]);
}

/** Paths. The German page sits at the root, English under /en/. */
const langPath = (lang, sub = "") => `${BASE}/${lang === DEFAULT_LANG ? "" : "en/"}${sub}`;
const abs = (p) => `${URL_ROOT}${p.startsWith(BASE) ? p.slice(BASE.length) : p}`;

let revealIndex = 0;
/** A reveal wrapper with a stagger delay in the group. */
const rv = (i = 0) => ` class="reveal" style="--d:${Math.min(i, 6) * 70}ms"`;

/* ---------- shared pieces ---------- */

function head(lang, { title, description, path, altPath, noindex = false }) {
  const other = lang === "de" ? "en" : "de";
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex,follow">' : ""}
<link rel="canonical" href="${abs(path)}">
<link rel="alternate" hreflang="${lang}" href="${abs(path)}">
<link rel="alternate" hreflang="${other}" href="${abs(altPath)}">
<link rel="alternate" hreflang="x-default" href="${abs(langPath(DEFAULT_LANG))}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${abs(path)}">
<meta property="og:locale" content="${lang === "de" ? "de_AT" : "en_GB"}">
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)">
<link rel="icon" href="${BASE}/icon.svg" type="image/svg+xml">
<style>${css}</style>
</head>
<body>`;
}

function header(lang, { home = false } = {}) {
  const n = content.nav;
  const other = lang === "de" ? "en" : "de";
  const homeHref = langPath(lang);
  const otherHref = langPath(other);
  const link = (item, i) =>
    `<a href="${home ? "" : homeHref}#${item.id}" style="--i:${i}">${t(item.label, lang, `nav.${item.id}`)}</a>`;
  return `<a class="skip" href="#main">${t(n.skip, lang)}</a>
<header class="nav">
  <div class="wrap">
    <a class="brand" href="${homeHref}" aria-label="${esc(content.site.name)}">${esc(content.site.name)}</a>
    <nav class="nav-links" aria-label="${lang === "de" ? "Abschnitte" : "Sections"}">
      ${n.items.map(link).join("\n      ")}
    </nav>
    <div class="nav-tools">
      <a class="lang" href="${otherHref}" hreflang="${other}" lang="${other}" aria-label="${t(n.langSwitchAria, lang)}">${t(n.langSwitch, lang)}</a>
      <a class="btn btn-solid btn-sm" href="${home ? "" : homeHref}#ask">${t(n.cta, lang)}</a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="drawer" aria-label="${t(n.menu, lang)}"><span></span></button>
    </div>
  </div>
  <div class="drawer" id="drawer">
    <nav class="wrap" aria-label="${t(n.menu, lang)}">
      ${n.items.map(link).join("\n      ")}
      <a class="btn btn-solid" href="${home ? "" : homeHref}#ask">${t(n.cta, lang)}</a>
    </nav>
  </div>
</header>`;
}

function footer(lang) {
  const f = content.footer;
  const p = content.person;
  return `<footer>
  <div class="wrap">
    <div class="row">
      <span class="brand">${esc(content.site.name)}</span>
      <span>${esc(p.name)}, ${t(p.city, lang)}</span>
    </div>
    <p>${t(f.note, lang)}</p>
    <div class="row">
      <a href="${langPath(lang, "impressum/")}">${t(f.imprint, lang)}</a>
      <a href="${langPath(lang, "datenschutz/")}">${t(f.privacy, lang)}</a>
      <a href="${BASE}/${esc(content.site.deckFile)}" download>${t(content.site.deckLabel, lang)}</a>
      <a href="#top">${t(f.top, lang)}</a>
    </div>
  </div>
</footer>
<script>${js}</script>
</body>
</html>`;
}

/* ---------- home page sections ---------- */

function hero(lang) {
  const h = content.hero;
  const p = content.person;
  return `<section class="hero" id="top">
  <div class="wrap">
    <p class="t-kicker"${rv(0)}>${t(h.kicker, lang)}</p>
    <h1 class="t-display"${rv(1)}>${t(h.title, lang)}</h1>
    <p class="t-lead"${rv(2)}>${t(h.lead, lang)}</p>
    <p class="t-body"${rv(3)}>${t(h.sub, lang)}</p>
    <div class="hero-actions"${rv(4)}>
      <a class="btn btn-ink" href="#market">${t(h.primary, lang)}</a>
      <a class="btn btn-ghost" href="#ask">${t(h.secondary, lang)}</a>
    </div>
    <p class="hero-meta"${rv(5)}><span>${esc(p.name)}</span><span>${t(p.city, lang)}</span><a href="mailto:${esc(p.email)}">${esc(p.email)}</a></p>
  </div>
</section>`;
}

function thesis(lang) {
  const th = content.thesis;
  return `<section class="thesis alt">
  <div class="wrap">
    <h2 class="t-h1 thesis-lines" aria-label="${th.lines.map((l) => t(l, lang)).join(" ")}">
      ${th.lines.map((l) => `<span aria-hidden="true">${t(l, lang)}</span>`).join("\n      ")}
    </h2>
    <p class="t-lead"${rv(1)}>${t(th.text, lang)}</p>
  </div>
</section>`;
}

function market(lang) {
  const m = content.market;
  const stat = (s, i) => {
    const countAttr = s.count != null ? ` data-count="${s.count}" data-sample="${esc(s.value)}"` : "";
    return `<div class="stat"${rv(i)}>
        <p class="value t-num"><span${countAttr}>${esc(s.value)}</span>${s.unit ? `<small>${esc(s.unit)}</small>` : ""}</p>
        <p class="t-body">${t(s.text, lang, `market.stats[${i}]`)}</p>
      </div>`;
  };
  return `<section id="market">
  <div class="wrap">
    <div class="sec-head">
      <p class="t-kicker"${rv(0)}>${t(m.kicker, lang)}</p>
      <h2 class="t-h1"${rv(1)}>${t(m.title, lang)}</h2>
    </div>
    <div class="stats">
      ${m.stats.map(stat).join("\n      ")}
    </div>
    <p class="claim t-h2"${rv(0)}>${t(m.claim, lang)}</p>
    <p class="source t-small"${rv(1)}>${t(m.source, lang)}</p>
  </div>
</section>`;
}

function difference(lang) {
  const d = content.difference;
  return `<section class="alt">
  <div class="wrap">
    <div class="sec-head">
      <p class="t-kicker"${rv(0)}>${t(d.kicker, lang)}</p>
      <h2 class="t-h1"${rv(1)}>${t(d.title, lang)}</h2>
    </div>
    <ul class="grid two">
      ${d.items
        .map(
          (it, i) => `<li class="item"${rv(i)}>
        <h3 class="t-h3">${t(it.title, lang, `difference[${i}]`)}</h3>
        <p class="t-body">${t(it.text, lang, `difference[${i}]`)}</p>
      </li>`,
        )
        .join("\n      ")}
    </ul>
  </div>
</section>`;
}

function method(lang) {
  const m = content.method;
  return `<section id="method">
  <div class="wrap method-layout">
    <div class="method-sticky sec-head" style="margin-bottom:0">
      <p class="t-kicker"${rv(0)}>${t(m.kicker, lang)}</p>
      <h2 class="t-h1"${rv(1)}>${t(m.title, lang)}</h2>
      <p class="t-lead"${rv(2)}>${t(m.sub, lang)}</p>
    </div>
    <ol class="steps">
      ${m.steps
        .map(
          (s, i) => `<li class="step">
        <span class="n t-num">${String(i + 1).padStart(2, "0")}</span>
        <h3 class="t-h3">${t(s.title, lang, `method[${i}]`)}</h3>
        <p class="t-body">${t(s.text, lang, `method[${i}]`)}</p>
      </li>`,
        )
        .join("\n      ")}
    </ol>
  </div>
</section>`;
}

function proof(lang) {
  const p = content.proof;
  const L = p.labels;
  const one = (c, i) => `<article class="case"${rv(i)}>
        <div class="case-head">
          <p class="t-kicker"><b>${esc(c.number)}</b> ${t(c.title, lang, `proof[${i}].title`)}</p>
          <h3 class="t-h2">${t(c.title, lang, `proof[${i}].title`)}</h3>
          <p class="t-small meta">${t(c.meta, lang, `proof[${i}].meta`)}</p>
        </div>
        <div class="figures">
          ${c.figures
            .map(
              (f) => `<div class="fig"><p class="t-num">${esc(f.value)}</p><p class="t-small">${t(f.label, lang, `proof[${i}].figures`)}</p></div>`,
            )
            .join("\n          ")}
        </div>
        <div class="cols">
          <div class="col"><p class="t-kicker">${t(L.start, lang)}</p><p class="t-body">${t(c.start, lang, `proof[${i}].start`)}</p></div>
          <div class="col"><p class="t-kicker">${t(L.built, lang)}</p><p class="t-body">${t(c.built, lang, `proof[${i}].built`)}</p></div>
          <div class="col"><p class="t-kicker">${t(L.measured, lang)}</p><p class="t-body">${t(c.measured, lang, `proof[${i}].measured`)}</p></div>
        </div>
      </article>`;
  return `<section id="proof" class="alt">
  <div class="wrap">
    <div class="sec-head">
      <p class="t-kicker"${rv(0)}>${t(p.kicker, lang)}</p>
      <h2 class="t-h1"${rv(1)}>${t(p.title, lang)}</h2>
    </div>
    <div class="cases">
      ${p.cases.map(one).join("\n      ")}
    </div>
  </div>
</section>`;
}

function numbers(lang) {
  const n = content.numbers;
  const price = (it) => (lang === "de" ? esc(it.priceDe) : esc(it.price));
  return `<section id="numbers">
  <div class="wrap">
    <div class="sec-head">
      <p class="t-kicker"${rv(0)}>${t(n.kicker, lang)}</p>
      <h2 class="t-h1"${rv(1)}>${t(n.title, lang)}</h2>
      <p class="t-lead"${rv(2)}>${t(n.sub, lang)}</p>
    </div>
    <div class="numbers-layout">
      <div class="panel"${rv(0)}>
        <h3 class="t-h3">${t(n.prices.title, lang)}</h3>
        <ul class="pricelist">
          ${n.prices.items.map((it) => `<li><span>${t(it.name, lang)}</span><span class="t-num">${price(it)}</span></li>`).join("\n          ")}
        </ul>
        <p class="t-small">${t(n.prices.note, lang)}</p>
      </div>
      <div class="panel"${rv(1)}>
        <h3 class="t-h3">${t(n.year1.title, lang)}</h3>
        <p class="big t-num"><span data-count="190000" data-sample="${esc(lang === "de" ? n.year1.figureDe : n.year1.figure)}">${esc(lang === "de" ? n.year1.figureDe : n.year1.figure)}</span></p>
        <p class="t-small">${t(n.year1.figureLabel, lang)}</p>
        <p class="t-body">${t(n.year1.text, lang)}</p>
      </div>
      <div class="panel"${rv(2)}>
        <h3 class="t-h3">${t(n.why.title, lang)}</h3>
        <p class="t-body">${t(n.why.text, lang)}</p>
      </div>
    </div>
  </div>
</section>`;
}

function timelineSection(lang, sec, { id = "", alt = false, withName = false }) {
  return `<section${id ? ` id="${id}"` : ""}${alt ? ' class="alt"' : ""}>
  <div class="wrap">
    <div class="sec-head">
      <p class="t-kicker"${rv(0)}>${t(sec.kicker, lang)}</p>
      <h2 class="t-h1"${rv(1)}>${t(sec.title, lang)}</h2>
      ${sec.sub ? `<p class="t-lead"${rv(2)}>${t(sec.sub, lang)}</p>` : ""}
    </div>
    <ol class="timeline">
      ${sec.items
        .map(
          (it, i) => `<li class="trow"${rv(i)}>
        <span class="when">${typeof it.when === "string" ? esc(it.when) : t(it.when, lang)}</span>
        ${withName ? `<h3>${t(it.name, lang)}</h3>` : ""}
        <p class="t-body">${t(it.text, lang)}</p>
      </li>`,
        )
        .join("\n      ")}
    </ol>
  </div>
</section>`;
}

function listSection(lang, sec, { id = "", alt = false, columns = "three", closing = null }) {
  return `<section${id ? ` id="${id}"` : ""}${alt ? ' class="alt"' : ""}>
  <div class="wrap">
    <div class="sec-head">
      <p class="t-kicker"${rv(0)}>${t(sec.kicker, lang)}</p>
      <h2 class="t-h1"${rv(1)}>${t(sec.title, lang)}</h2>
      ${sec.sub ? `<p class="t-lead"${rv(2)}>${t(sec.sub, lang)}</p>` : ""}
    </div>
    <ul class="grid ${columns}">
      ${sec.items
        .map(
          (it, i) => `<li class="item"${rv(i)}>
        <h3 class="t-h3">${t(it.title, lang)}</h3>
        <p class="t-body">${t(it.text, lang)}</p>
      </li>`,
        )
        .join("\n      ")}
    </ul>
    ${closing ? `<p class="closing t-body"${rv(0)}>${t(closing, lang)}</p>` : ""}
  </div>
</section>`;
}

function funds(lang) {
  const f = content.funds;
  const sum = f.items.reduce((a, it) => a + it.amount, 0);
  if (sum !== f.total) throw new Error(`Use of funds adds up to ${sum}, not ${f.total}`);
  const pct = (it) => Math.round((it.amount / f.total) * 100);
  const amt = (it) => (lang === "de" ? esc(it.labelDe) : esc(it.label));
  return `<section id="funds" class="alt">
  <div class="wrap">
    <div class="sec-head">
      <p class="t-kicker"${rv(0)}>${t(f.kicker, lang)}</p>
      <h2 class="t-h1"${rv(1)}>${t(f.title, lang)}</h2>
      <p class="t-lead"${rv(2)}>${t(f.sub, lang)}</p>
    </div>
    <div class="bar" role="img" aria-label="${f.items.map((it) => `${t(it.title, lang)} ${pct(it)}%`).join(", ")}">
      ${f.items.map((it, k) => `<span style="--w:${(it.amount / f.total) * 100}%;--k:${k}"></span>`).join("")}
    </div>
    <ol class="funds-list">
      ${f.items
        .map(
          (it, i) => `<li class="fund"${rv(i)}>
        <span class="amt t-num">${amt(it)}<span class="pct">${pct(it)} %</span></span>
        <h3 class="t-h3">${t(it.title, lang)}</h3>
        <p class="t-body">${t(it.text, lang)}</p>
      </li>`,
        )
        .join("\n      ")}
    </ol>
    <div class="funds-two">
      <div${rv(0)}>
        <h3 class="t-h2" style="margin-bottom:20px">${t(f.payback.title, lang)}</h3>
        <ul class="kv">
          ${f.payback.items.map((it) => `<li><span class="k">${t(it.label, lang)}</span><p class="t-body">${t(it.text, lang)}</p></li>`).join("\n          ")}
        </ul>
      </div>
      <div${rv(1)}>
        <h3 class="t-h2" style="margin-bottom:20px">${t(f.milestones.title, lang)}</h3>
        <ol class="timeline">
          ${f.milestones.items.map((it) => `<li class="trow"><span class="when">${esc(it.when)}</span><p class="t-body">${t(it.text, lang)}</p></li>`).join("\n          ")}
        </ol>
      </div>
    </div>
  </div>
</section>`;
}

function ask(lang) {
  const a = content.ask;
  const p = content.person;
  return `<section id="ask">
  <div class="wrap">
    <div class="sec-head">
      <p class="t-kicker"${rv(0)}>${t(a.kicker, lang)}</p>
      <h2 class="t-h1"${rv(1)}>${t(a.title, lang)}</h2>
    </div>
    <ol class="ask-list">
      ${a.items.map((it, i) => `<li${rv(i)}><span>${t(it, lang, `ask[${i}]`)}</span></li>`).join("\n      ")}
    </ol>
    <div class="contact"${rv(0)}>
      <h3 class="t-h1">${t(a.contactTitle, lang)}</h3>
      <p class="t-lead">${t(a.contactText, lang)}</p>
      <div class="contact-actions">
        <a class="btn btn-ink" href="mailto:${esc(p.email)}">${t(a.email, lang)}</a>
        <a class="btn btn-ghost" href="tel:${esc(p.phoneHref)}">${t(a.call, lang)}</a>
        <button class="btn btn-ghost" type="button" data-copy="${esc(p.email)}" data-copied="${t(a.copied, lang)}">${t(a.copy, lang)}</button>
      </div>
      <div class="contact-lines">
        <span>${esc(p.name)}, ${t(p.city, lang)}</span>
        <a href="mailto:${esc(p.email)}">${esc(p.email)}</a>
        <a href="tel:${esc(p.phoneHref)}">${esc(p.phone)}</a>
        <a href="${esc(p.linkedin)}" rel="me noopener" target="_blank">${esc(p.linkedinLabel)}</a>
      </div>
    </div>
  </div>
</section>`;
}

function homePage(lang) {
  revealIndex = 0;
  const path = langPath(lang);
  const altPath = langPath(lang === "de" ? "en" : "de");
  return [
    head(lang, { title: content.site.title[lang], description: content.site.description[lang], path, altPath }),
    header(lang, { home: true }),
    `<main id="main">`,
    hero(lang),
    thesis(lang),
    market(lang),
    difference(lang),
    method(lang),
    proof(lang),
    numbers(lang),
    timelineSection(lang, content.fields, { alt: true, withName: true }),
    listSection(lang, content.governance, { columns: "three", closing: content.governance.closing }),
    listSection(lang, content.value, { alt: true, columns: "three" }),
    timelineSection(lang, content.horizon, {}),
    funds(lang),
    listSection(lang, content.returns, { columns: "three" }),
    ask(lang),
    `</main>`,
    footer(lang),
  ].join("\n");
}

/* ---------- legal pages ---------- */

function legalPage(lang, kind) {
  const L = content.legal[kind];
  const p = content.person;
  const sub = kind === "imprint" ? "impressum/" : "datenschutz/";
  const path = langPath(lang, sub);
  const altPath = langPath(lang === "de" ? "en" : "de", sub);
  const title = `${L.title[lang]}. ${content.site.name}`;
  let body;
  if (kind === "imprint") {
    body = `<p class="t-body">${t(L.intro, lang)}</p>
    <h2 class="t-h3">${t(L.owner, lang)}</h2>
    <address>${esc(p.name)}<br>${esc(L.address)}<br><a href="mailto:${esc(p.email)}">${esc(p.email)}</a><br><a href="tel:${esc(p.phoneHref)}">${esc(p.phone)}</a></address>
    <p class="t-body">${t(L.business, lang)}</p>
    <p class="placeholder">${t(L.note, lang)}</p>`;
  } else {
    body = `${L.paragraphs.map((par, i) => `<p class="t-body">${t(par, lang, `privacy[${i}]`)}</p>`).join("\n    ")}
    <h2 class="t-h3">${t(L.controller, lang)}</h2>
    <address>${esc(p.name)}, ${t(p.city, lang)}<br><a href="mailto:${esc(p.email)}">${esc(p.email)}</a></address>`;
  }
  return [
    head(lang, { title, description: content.site.description[lang], path, altPath, noindex: true }),
    header(lang),
    `<main id="main" class="legal"><div class="wrap">
    <h1 class="t-h1">${t(L.title, lang)}</h1>
    ${body}
  </div></main>`,
    footer(lang),
  ].join("\n");
}

function notFound() {
  return [
    head("de", { title: `Seite nicht gefunden. ${content.site.name}`, description: content.site.description.de, path: langPath("de"), altPath: langPath("en"), noindex: true }),
    header("de"),
    `<main id="main" class="legal"><div class="wrap">
    <h1 class="t-h1">Diese Seite gibt es nicht.</h1>
    <p class="t-body">This page does not exist.</p>
    <p><a class="btn btn-ink" href="${langPath("de")}">Zur Startseite</a> <a class="btn btn-ghost" href="${langPath("en")}">English</a></p>
  </div></main>`,
    footer("de"),
  ].join("\n");
}

/* ---------- write ---------- */

const dist = join(here, "dist");
rmSync(dist, { recursive: true, force: true });
const write = (rel, html) => {
  const file = join(dist, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
};

const pages = [];
for (const lang of LANGS) {
  const dir = lang === DEFAULT_LANG ? "" : "en/";
  write(`${dir}index.html`, homePage(lang));
  write(`${dir}impressum/index.html`, legalPage(lang, "imprint"));
  write(`${dir}datenschutz/index.html`, legalPage(lang, "privacy"));
  pages.push(langPath(lang));
}
write("404.html", notFound());
write("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${abs(`${BASE}/sitemap.xml`)}\n`);
write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${pages
    .map(
      (p) =>
        `  <url><loc>${abs(p)}</loc>${LANGS.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${abs(langPath(l))}"/>`).join("")}</url>`,
    )
    .join("\n")}\n</urlset>\n`,
);
write(
  "icon.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#1d1d1f"/><text x="32" y="41" text-anchor="middle" font-family="-apple-system,Helvetica,Arial,sans-serif" font-weight="700" font-size="26" fill="#fff">S</text></svg>\n`,
);
writeFileSync(join(dist, ".nojekyll"), "");
if (existsSync(join(here, content.site.deckFile))) {
  copyFileSync(join(here, content.site.deckFile), join(dist, content.site.deckFile));
}
console.log(`Built ${pages.length} languages into dist/ (base "${BASE || "/"}", url ${URL_ROOT})`);
