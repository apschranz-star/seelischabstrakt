#!/usr/bin/env node
/*
 * Builds the SCHRANZ AI SOLUTIONS site from content.json into dist/.
 *
 *   node build.mjs                      site at the domain root (Netlify)
 *   SITE_BASE=/seelischabstrakt/schranz-ai node build.mjs   under a path (GitHub Pages)
 *   SITE_URL=https://example.com node build.mjs             absolute URLs for hreflang and og
 *
 * Output: dist/index.html (German), dist/en/index.html (English), the legal
 * pages in both languages, the scale rider (mitmachen/, en/scale/), 404.html,
 * robots.txt, sitemap.xml, the deck and the heading font.
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

/*
 * The access gate. With SITE_ACCESS_KEY set, every page carries the snippet
 * from ../gate/gate.snippet.html with the code written in, and a visitor
 * without the code or the link sees a field instead of the page. Without the
 * variable the pages are public. See ../gate/README.md.
 */
const ACCESS_KEY = process.env.SITE_ACCESS_KEY ?? "";
const GATE_FILE = join(here, "..", "gate", "gate.snippet.html");
if (ACCESS_KEY && !/^[A-Za-z0-9_-]+$/.test(ACCESS_KEY)) {
  throw new Error("SITE_ACCESS_KEY may only contain A-Z a-z 0-9 _ -");
}
// Ein fehlender Schnipsel darf nicht heissen, dass die Seite still ohne Zugang
// gebaut wird: der Lauf meldete Erfolg und die Seite laege offen im Netz.
if (ACCESS_KEY && !existsSync(GATE_FILE)) {
  throw new Error(`SITE_ACCESS_KEY ist gesetzt, aber ${GATE_FILE} fehlt. Nichts gebaut.`);
}
const GATE =
  ACCESS_KEY && existsSync(GATE_FILE)
    ? readFileSync(GATE_FILE, "utf8")
        .replace(/__ACCESS_KEY__/g, ACCESS_KEY)
        .replace(/__SITE_NAME__/g, content.site.name)
        .replace(/__OPERATOR__/g, `${content.person.name}, ${content.person.city.de}`)
        .replace(/__CONTACT_LINE__/g, ` Kontakt: ${content.person.email}.`)
    : "";
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

/** A reveal wrapper with a stagger delay in the group. extra adds classes. */
const rv = (i = 0, extra = "") => ` class="reveal${extra ? " " + extra : ""}" style="--d:${Math.min(i, 6) * 70}ms"`;

/** A heading whose words slide up out of a mask. site.js splits the words;
    without JavaScript it is a plain heading. */
const sp = (i = 0) => ` class="t-h1 split" data-split style="--d:${Math.min(i, 6) * 70}ms"`;

/** Section head: kicker, a heading that slides in, an optional lead. */
function secHead(lang, sec, path) {
  return `<div class="sec-head">
      <p class="t-kicker"${rv(0)}>${t(sec.kicker, lang, path + ".kicker")}</p>
      <h2${sp(1)}>${t(sec.title, lang, path + ".title")}</h2>
      ${sec.sub ? `<p class="t-lead"${rv(2)}>${t(sec.sub, lang, path + ".sub")}</p>` : ""}
    </div>`;
}

const ARROW_L = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>';
const ARROW_R = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>';

/** A rail: cards in a row that slide sideways, with a progress line and
    buttons. Without JavaScript it is a row you can swipe. */
function rail(lang, cards, { wide = false, label = "" } = {}) {
  const r = content.rail;
  return `<div class="rail-wrap">
      <ul class="rail${wide ? " wide" : ""}" tabindex="0" aria-label="${esc(label)}">
        ${cards.join("\n        ")}
      </ul>
      <div class="rail-bar">
        <span class="rail-hint">${t(r.hint, lang)}</span>
        <span class="rail-track" aria-hidden="true"><i></i></span>
        <span class="rail-btns">
          <button class="rail-btn" type="button" data-dir="-1" aria-label="${t(r.prev, lang)}">${ARROW_L}</button>
          <button class="rail-btn" type="button" data-dir="1" aria-label="${t(r.next, lang)}">${ARROW_R}</button>
        </span>
      </div>
    </div>`;
}

/* ---------- shared pieces ---------- */

/* The scale rider has its own page. German and English slugs differ. */
const SCALE = { de: "mitmachen/", en: "scale/" };
const scalePath = (lang) => langPath(lang, SCALE[lang]);
const FONT_FILES = ["bricolage-grotesque-latin-normal-300-800.woff2", "bricolage-grotesque-latin-ext-normal-300-800.woff2"];
const FONT_SRC = join(here, "..", "anker", "fonts");

/* Display face for headings, self-hosted next to the page. Body stays on
   the system stack, as in the original. */
const fontFace = () => `@font-face{font-family:"Bricolage Grotesque";font-style:normal;font-weight:300 800;font-display:swap;src:url("${BASE}/fonts/${FONT_FILES[0]}") format("woff2");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:"Bricolage Grotesque";font-style:normal;font-weight:300 800;font-display:swap;src:url("${BASE}/fonts/${FONT_FILES[1]}") format("woff2");unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}`;

function head(lang, { title, description, path, altPath, noindex = false }) {
  const other = lang === "de" ? "en" : "de";
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
${GATE}<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${GATE ? '<meta name="robots" content="noindex,nofollow">' : noindex ? '<meta name="robots" content="noindex,follow">' : ""}
<link rel="canonical" href="${abs(path)}">
<link rel="alternate" hreflang="${lang}" href="${abs(path)}">
<link rel="alternate" hreflang="${other}" href="${abs(altPath)}">
<link rel="alternate" hreflang="x-default" href="${abs(langPath(DEFAULT_LANG))}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${abs(path)}">
<meta property="og:locale" content="${lang === "de" ? "de_AT" : "en_GB"}">
<meta name="theme-color" content="#050507">
<link rel="icon" href="${BASE}/icon.svg" type="image/svg+xml">
<link rel="preload" href="${BASE}/fonts/${FONT_FILES[0]}" as="font" type="font/woff2" crossorigin>
<style>${fontFace()}
${css}</style>
</head>
<body>`;
}

const ICONS = {
  box: '<path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5z"/><path d="M4 7.5 12 12l8-4.5M12 12v9"/>',
  calc: '<rect x="5" y="3" width="14" height="18" rx="3"/><path d="M8.5 7.5h7M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 15.5h.01M12 15.5h.01M15.5 15.5h.01"/>',
  steps: '<circle cx="6" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><path d="M6 8v8M10 6h10M10 18h10M10 12h7"/>',
  check: '<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.3 7.5 9.5 4.3-1.2 7.5-4.9 7.5-9.5V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>',
  chart: '<path d="M4 19V5M4 19h16"/><path d="M7.5 15.5l3.5-4 3 2.5 4.5-6"/>',
  pie: '<path d="M12 3a9 9 0 1 0 9 9h-9z"/><path d="M15 3.5A9 9 0 0 1 20.5 9H15z"/>',
  up: '<path d="M4 17l6-6 4 4 6-7"/><path d="M15 8h5v5"/>',
};
const icon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name] || ""}</svg>`;

/* The rider switch: two parts of one site, clients and investors. */
function riders(lang, current) {
  const r = content.riders;
  const a = (key, href) =>
    `<a href="${href}"${current === key ? ' aria-current="page"' : ""}>${t(r[key], lang)}</a>`;
  return `<nav class="riders" aria-label="${t(r.aria, lang)}">
      ${a("clients", langPath(lang))}${a("scale", scalePath(lang))}
    </nav>`;
}

function header(lang, { page = "clients", altHref } = {}) {
  const n = content.nav;
  const other = lang === "de" ? "en" : "de";
  const home = page === "clients" ? langPath(lang) : page === "scale" ? scalePath(lang) : langPath(lang);
  const items = page === "scale" ? n.scaleItems : n.clientItems;
  const onPage = page === "clients" || page === "scale";
  const pre = onPage ? "" : home;
  const link = (item, i) =>
    `<a href="${pre}#${item.id}" style="--i:${i}">${t(item.label, lang, `nav.${item.id}`)}</a>`;
  const cta = page === "scale" ? n.scaleCta : n.cta;
  const ctaHref = page === "scale" ? `${onPage ? "" : home}#ask` : `${onPage ? "" : home}#contact`;
  return `<a class="skip" href="#main">${t(n.skip, lang)}</a>
<div class="progress" aria-hidden="true"></div>
<header class="nav">
  <div class="wrap">
    <a class="brand" href="${langPath(lang)}" aria-label="${esc(content.site.name)}"><span class="brand-mark" aria-hidden="true"></span><span class="brand-word">${esc(content.site.short)}</span></a>
    ${riders(lang, page === "scale" ? "scale" : "clients")}
    <nav class="nav-links" aria-label="${lang === "de" ? "Abschnitte" : "Sections"}">
      ${items.map(link).join("\n      ")}
    </nav>
    <div class="nav-tools">
      <a class="lang" href="${altHref || langPath(other)}" hreflang="${other}" lang="${other}" aria-label="${t(n.langSwitchAria, lang)}">${other.toUpperCase()}</a>
      <a class="btn btn-solid btn-sm" href="${ctaHref}" data-magnet>${t(cta, lang)}</a>
    </div>
  </div>
</header>
${onPage ? tabbar(lang, items) : ""}`;
}

/* On phones the sections sit in a bar at the bottom, like an app. */
function tabbar(lang, items) {
  return `<nav class="tabbar" aria-label="${lang === "de" ? "Abschnitte" : "Sections"}">
  ${items.map((it) => `<a href="#${it.id}" data-tab="${it.id}">${icon(it.icon)}<span>${t(it.label, lang)}</span></a>`).join("\n  ")}
</nav>`;
}

function footer(lang, { deck = false } = {}) {
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
      <a href="${langPath(lang)}">${t(content.riders.clients, lang)}</a>
      <a href="${scalePath(lang)}">${t(content.riders.scale, lang)}</a>
      <a href="${langPath(lang, "impressum/")}">${t(f.imprint, lang)}</a>
      <a href="${langPath(lang, "datenschutz/")}">${t(f.privacy, lang)}</a>
      ${deck ? `<a href="${BASE}/${esc(content.site.deckFile)}" download>${t(content.site.deckLabel, lang)}</a>` : ""}
      <a href="#top">${t(f.top, lang)}</a>
    </div>
    <p class="footer-word" aria-hidden="true">${esc(content.site.short)}</p>
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
  <div class="aurora" aria-hidden="true"><i></i><i></i><i></i></div>
  <div class="orbit" aria-hidden="true">
    ${content.marquee.items.slice(0, 3).map((it, i) => `<div class="ring r${i + 1}"><span class="pin"><span class="node"><i></i>${t(it, lang)}</span></span></div>`).join("")}
    <div class="core">S</div>
  </div>
  <div class="wrap">
    <p class="domain"${rv(0)}><b>${esc(h.domain)}</b>${t(h.kicker, lang)}</p>
    <h1 class="t-display split" data-split style="--d:120ms">${t(h.title, lang)}</h1>
    <p class="tagline"${rv(3)}><span class="grad">${t(h.tagline, lang)}</span></p>
    <p class="t-lead"${rv(4)}>${t(h.lead, lang)}</p>
    <p class="t-body"${rv(5)}>${t(h.sub, lang)}</p>
    <div class="hero-actions"${rv(6)}>
      <a class="btn btn-solid" href="#contact" data-magnet>${t(h.primary, lang)} <span class="arrow" aria-hidden="true">&rarr;</span></a>
      <a class="btn btn-ghost" href="#services" data-magnet>${t(h.secondary, lang)}</a>
    </div>
    <p class="hero-meta"${rv(6)}><span>${esc(p.name)}</span><span>${t(p.city, lang)}</span><a href="mailto:${esc(p.email)}">${esc(p.email)}</a></p>
  </div>
  <span class="scroll-cue" aria-hidden="true"></span>
</section>`;
}

function marquee(lang) {
  const items = content.marquee.items.map((it, i) => `<li>${t(it, lang, `marquee[${i}]`)}</li>`).join("");
  /* Two copies side by side so the loop has no seam; the second is hidden
     from screen readers. */
  return `<div class="marquee" role="presentation">
  <div class="marquee-track">
    <ul>${items}</ul>
    <ul aria-hidden="true">${items}</ul>
  </div>
</div>`;
}

function thesis(lang) {
  const th = content.thesis;
  return `<section class="thesis">
  <div class="wrap">
    <h2 class="thesis-lines" aria-label="${th.lines.map((l) => t(l, lang)).join(" ")}">
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
    return `<div${rv(i, "stat glass")} data-light>
        <p class="value t-num"><span${countAttr}>${esc(s.value)}</span>${s.unit ? `<small>${esc(s.unit)}</small>` : ""}</p>
        <p class="t-body">${t(s.text, lang, `market.stats[${i}]`)}</p>
      </div>`;
  };
  return `<section id="market">
  <div class="wrap">
    ${secHead(lang, m, "market")}
    <div class="stats">
      ${m.stats.map(stat).join("\n      ")}
    </div>
    <p class="claim split" data-split>${t(m.claim, lang)}</p>
    <p class="source t-small"${rv(1)}>${t(m.source, lang)}</p>
  </div>
</section>`;
}

function difference(lang) {
  const d = content.difference;
  const cards = d.items.map(
    (it, i) => `<li class="card glass" data-light>
          <span class="idx">${String(i + 1).padStart(2, "0")}</span>
          <h3 class="t-h3">${t(it.title, lang, `difference[${i}]`)}</h3>
          <p class="t-body">${t(it.text, lang, `difference[${i}]`)}</p>
        </li>`,
  );
  return `<section class="alt">
  <div class="wrap">
    ${secHead(lang, d, "difference")}
    ${rail(lang, cards, { label: t(d.title, lang) })}
  </div>
</section>`;
}

function method(lang) {
  const m = content.method;
  return `<section id="method">
  <div class="wrap method-layout">
    <div class="method-sticky sec-head" style="margin-bottom:0">
      <p class="t-kicker"${rv(0)}>${t(m.kicker, lang)}</p>
      <h2${sp(1)}>${t(m.title, lang)}</h2>
      <p class="t-lead"${rv(2)}>${t(m.sub, lang)}</p>
    </div>
    <ol class="steps">
      ${m.steps
        .map(
          (s, i) => `<li class="step">
        <span class="n">${String(i + 1).padStart(2, "0")}</span>
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
  const one = (c, i) => `<li class="case glass" data-light>
          <div class="case-head">
            <p class="t-kicker"><b>${esc(c.number)}</b></p>
            <h3 class="t-h2">${t(c.title, lang, `proof[${i}].title`)}</h3>
            <p class="t-small meta">${t(c.meta, lang, `proof[${i}].meta`)}</p>
          </div>
          <div class="figures">
            ${c.figures
              .map(
                (f) => `<div class="fig"><p class="t-num">${esc(f.value)}</p><p class="t-small">${t(f.label, lang, `proof[${i}].figures`)}</p></div>`,
              )
              .join("\n            ")}
          </div>
          <div class="cols">
            <div class="col"><p class="t-kicker">${t(L.start, lang)}</p><p class="t-body">${t(c.start, lang, `proof[${i}].start`)}</p></div>
            <div class="col"><p class="t-kicker">${t(L.built, lang)}</p><p class="t-body">${t(c.built, lang, `proof[${i}].built`)}</p></div>
            <div class="col"><p class="t-kicker">${t(L.measured, lang)}</p><p class="t-body">${t(c.measured, lang, `proof[${i}].measured`)}</p></div>
          </div>
        </li>`;
  return `<section id="proof" class="alt">
  <div class="wrap">
    ${secHead(lang, p, "proof")}
    ${rail(lang, p.cases.map(one), { wide: true, label: t(p.title, lang) })}
  </div>
</section>`;
}

function numbers(lang) {
  const n = content.numbers;
  const price = (it) => (lang === "de" ? esc(it.priceDe) : esc(it.price));
  return `<section id="numbers">
  <div class="wrap">
    ${secHead(lang, n, "numbers")}
    <div class="numbers-layout">
      <div${rv(0, "panel glass")} data-light>
        <h3 class="t-h3">${t(n.prices.title, lang)}</h3>
        <ul class="pricelist">
          ${n.prices.items.map((it) => `<li><span>${t(it.name, lang)}</span><span class="t-num">${price(it)}</span></li>`).join("\n          ")}
        </ul>
        <p class="t-small">${t(n.prices.note, lang)}</p>
      </div>
      <div${rv(1, "panel glass")} data-light>
        <h3 class="t-h3">${t(n.year1.title, lang)}</h3>
        <p class="big t-num"><span data-count="190000" data-sample="${esc(lang === "de" ? n.year1.figureDe : n.year1.figure)}">${esc(lang === "de" ? n.year1.figureDe : n.year1.figure)}</span></p>
        <p class="t-small">${t(n.year1.figureLabel, lang)}</p>
        <p class="t-body">${t(n.year1.text, lang)}</p>
      </div>
      <div${rv(2, "panel glass")} data-light>
        <h3 class="t-h3">${t(n.why.title, lang)}</h3>
        <p class="t-body">${t(n.why.text, lang)}</p>
      </div>
    </div>
  </div>
</section>`;
}

/* The fields slide sideways as cards, each with its moment and its name. */
function fieldsRail(lang, sec, { alt = false } = {}) {
  const cards = sec.items.map(
    (it, i) => `<li class="card glass" data-light>
          <span class="when">${typeof it.when === "string" ? esc(it.when) : t(it.when, lang, `fields[${i}].when`)}</span>
          <h3 class="t-h2">${t(it.name, lang, `fields[${i}].name`)}</h3>
          <p class="t-body">${t(it.text, lang, `fields[${i}].text`)}</p>
        </li>`,
  );
  return `<section${alt ? ' class="alt"' : ""}>
  <div class="wrap">
    ${secHead(lang, sec, "fields")}
    ${rail(lang, cards, { label: t(sec.title, lang) })}
  </div>
</section>`;
}

function timelineSection(lang, sec, { id = "", alt = false, withName = false }) {
  return `<section${id ? ` id="${id}"` : ""}${alt ? ' class="alt"' : ""}>
  <div class="wrap">
    ${secHead(lang, sec, "timeline")}
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
    ${secHead(lang, sec, "list")}
    <ul class="grid ${columns}">
      ${sec.items
        .map(
          (it, i) => `<li${rv(i, "item glass")} data-light>
        <span class="pt">${String(i + 1).padStart(2, "0")}</span>
        <h3 class="t-h3">${t(it.title, lang)}</h3>
        <p class="t-body">${t(it.text, lang)}</p>
      </li>`,
        )
        .join("\n      ")}
    </ul>
    ${closing ? `<p${rv(0, "closing glass t-body")}>${t(closing, lang)}</p>` : ""}
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
    ${secHead(lang, f, "funds")}
    <div class="bar" role="img" aria-label="${f.items.map((it) => `${t(it.title, lang)} ${pct(it)}%`).join(", ")}">
      ${f.items.map((it, k) => `<span style="--g:${it.amount};--k:${k}"></span>`).join("")}
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
      <div${rv(0, "glass")} data-light>
        <h3 class="t-h2" style="margin-bottom:20px">${t(f.payback.title, lang)}</h3>
        <ul class="kv">
          ${f.payback.items.map((it) => `<li><span class="k">${t(it.label, lang)}</span><p class="t-body">${t(it.text, lang)}</p></li>`).join("\n          ")}
        </ul>
      </div>
      <div${rv(1, "glass")} data-light>
        <h3 class="t-h2" style="margin-bottom:20px">${t(f.milestones.title, lang)}</h3>
        <ol class="timeline">
          ${f.milestones.items.map((it) => `<li class="trow"><span class="when">${esc(it.when)}</span><p class="t-body">${t(it.text, lang)}</p></li>`).join("\n          ")}
        </ol>
      </div>
    </div>
  </div>
</section>`;
}

/* ---------- client page: services ---------- */

function services(lang) {
  const s = content.services;
  const prices = content.numbers.prices.items;
  const steps = content.method.steps;
  const price = (it) => (lang === "de" ? esc(it.priceDe) : esc(it.price));
  const tabs = s.items.map(
    (it, i) => `<button class="seg-btn" type="button" role="tab" id="pkg-tab-${i}" aria-controls="pkg-${i}" aria-selected="${i === 1}" data-seg="${i}">${t(prices[it.price].name, lang)}</button>`,
  );
  const panels = s.items.map(
    (it, i) => `<article class="pkg glass" role="tabpanel" id="pkg-${i}" aria-labelledby="pkg-tab-${i}" data-seg-panel="${i}" data-light>
        <div class="pkg-head">
          <p class="t-kicker">${String(i + 1).padStart(2, "0")}</p>
          <h3 class="t-h2">${t(prices[it.price].name, lang)}</h3>
          <p class="pkg-price t-num">${price(prices[it.price])}</p>
        </div>
        <p class="t-lead">${t(it.text, lang, `services[${i}].text`)}</p>
        <div class="pkg-track" aria-label="${t(s.stepsLabel, lang)}">
          ${steps.map((st, k) => `<span class="pkg-step${it.steps.includes(k) ? " on" : ""}"><i>${String(k + 1).padStart(2, "0")}</i>${t(st.title, lang)}</span>`).join("")}
        </div>
        <div class="pkg-foot">
          <p class="pkg-result">${t(it.result, lang, `services[${i}].result`)}</p>
          <a class="btn btn-solid" href="#contact" data-magnet>${t(s.cta, lang)} <span class="arrow" aria-hidden="true">&rarr;</span></a>
        </div>
      </article>`,
  );
  return `<section id="services">
  <div class="wrap">
    ${secHead(lang, s, "services")}
    <div class="seg" role="tablist" aria-label="${t(s.pick, lang)}"${rv(0)}>
      ${tabs.join("\n      ")}
    </div>
    <div class="pkgs">
      ${panels.join("\n      ")}
    </div>
    <p class="t-small pkg-note"${rv(0)}>${t(content.numbers.prices.note, lang)}</p>
  </div>
</section>`;
}

/* The calculator. Sliders in the Anker style, numbers that follow them. */
function calc(lang) {
  const c = content.calc;
  const slider = (key, { min, max, step, value, unit }) => `<label class="regler" data-key="${key}">
          <span class="regler-kopf"><span class="regler-name">${t(c[key], lang)}</span><output class="regler-zahl" data-unit="${esc(unit)}">${value}${unit}</output></span>
          <input type="range" min="${min}" max="${max}" step="${step}" value="${value}" name="${key}">
        </label>`;
  return `<section id="calc" class="alt">
  <div class="wrap">
    ${secHead(lang, c, "calc")}
    <div class="calc" data-lang="${lang}" data-price-low="18000" data-price-high="28000" data-weeks="46">
      <div${rv(0, "calc-in glass")}>
        ${slider("hours", { min: 1, max: 40, step: 1, value: 6, unit: lang === "de" ? " h" : " h" })}
        ${slider("people", { min: 1, max: 30, step: 1, value: 3, unit: "" })}
        ${slider("rate", { min: 20, max: 150, step: 5, value: 45, unit: lang === "de" ? " €" : " €" })}
        ${slider("share", { min: 10, max: 90, step: 5, value: 50, unit: " %" })}
      </div>
      <div${rv(1, "calc-out glass")} data-light aria-live="polite">
        <div class="calc-row"><p class="calc-num t-num" data-out="hours">&ndash;</p><p class="t-small">${t(c.outHours, lang)}</p></div>
        <div class="calc-row"><p class="calc-num t-num" data-out="cost">&ndash;</p><p class="t-small">${t(c.outCost, lang)}</p></div>
        <div class="calc-row hero-row"><p class="calc-num t-num" data-out="save">&ndash;</p><p class="t-small">${t(c.outSave, lang)}</p></div>
        <div class="calc-pay">
          <p class="t-small">${t(c.outPayback, lang)}</p>
          <p class="calc-pay-num t-num" data-out="payback" data-months="${t(c.months, lang)}" data-none="${t(c.none, lang)}">&ndash;</p>
        </div>
        <noscript><p class="t-small">${t(c.noscript, lang)}</p></noscript>
        <a class="btn btn-solid" href="#contact" data-magnet>${t(c.cta, lang)} <span class="arrow" aria-hidden="true">&rarr;</span></a>
      </div>
    </div>
    <p class="t-small calc-note"${rv(0)}>${t(c.note, lang)}</p>
  </div>
</section>`;
}

/* Industries as a segmented switch: one at a time, like a rider. */
function industries(lang) {
  const f = content.fields;
  return `<section id="fields">
  <div class="wrap">
    ${secHead(lang, f, "fields")}
    <div class="seg seg-wrap" role="tablist" aria-label="${t(f.kicker, lang)}"${rv(0)}>
      ${f.items.map((it, i) => `<button class="seg-btn" type="button" role="tab" id="ind-tab-${i}" aria-controls="ind-${i}" aria-selected="${i === 0}" data-seg="${i}">${t(it.name, lang)}</button>`).join("\n      ")}
    </div>
    <div class="inds">
      ${f.items
        .map(
          (it, i) => `<article class="ind glass" role="tabpanel" id="ind-${i}" aria-labelledby="ind-tab-${i}" data-seg-panel="${i}" data-light>
        <span class="ind-n t-num">${String(i + 1).padStart(2, "0")}</span>
        <h3 class="t-h1">${t(it.name, lang)}</h3>
        <p class="t-lead">${t(it.text, lang)}</p>
      </article>`,
        )
        .join("\n      ")}
    </div>
  </div>
</section>`;
}

function contactCard(lang, { title, text, id = "" }) {
  const a = content.ask;
  const p = content.person;
  return `<div class="contact"${id ? ` id="${id}"` : ""}${rv(0)}>
      <h3 class="t-h1">${t(title, lang)}</h3>
      <p class="t-lead">${t(text, lang)}</p>
      <div class="contact-actions">
        <a class="btn btn-solid" href="mailto:${esc(p.email)}" data-magnet>${t(a.email, lang)} <span class="arrow" aria-hidden="true">&rarr;</span></a>
        <a class="btn btn-ghost" href="tel:${esc(p.phoneHref)}">${t(a.call, lang)}</a>
        <button class="btn btn-ghost" type="button" data-copy="${esc(p.email)}" data-copied="${t(a.copied, lang)}">${t(a.copy, lang)}</button>
      </div>
      <div class="contact-lines">
        <span>${esc(p.name)}, ${t(p.city, lang)}</span>
        <a href="mailto:${esc(p.email)}">${esc(p.email)}</a>
        <a href="tel:${esc(p.phoneHref)}">${esc(p.phone)}</a>
        <a href="${esc(p.linkedin)}" rel="me noopener" target="_blank">${esc(p.linkedinLabel)}</a>
      </div>
    </div>`;
}

function clientContact(lang) {
  return `<section id="contact">
  <div class="wrap">
    ${contactCard(lang, { title: content.clientContact.title, text: content.clientContact.text })}
  </div>
</section>`;
}

/* The door to the other rider. */
function scaleTeaser(lang) {
  const s = content.scaleTeaser;
  return `<section class="tight">
  <div class="wrap">
    <a class="teaser glass" href="${scalePath(lang)}" data-light${rv(0)}>
      <span class="t-kicker">${t(s.kicker, lang)}</span>
      <span class="teaser-title">${t(s.title, lang)}</span>
      <span class="t-body">${t(s.text, lang)}</span>
      <span class="teaser-go">${t(s.btn, lang)} <span class="arrow" aria-hidden="true">&rarr;</span></span>
    </a>
  </div>
</section>`;
}

function homePage(lang) {
  const path = langPath(lang);
  const altPath = langPath(lang === "de" ? "en" : "de");
  return [
    head(lang, { title: content.site.title[lang], description: content.site.description[lang], path, altPath }),
    header(lang, { page: "clients", altHref: altPath }),
    `<main id="main">`,
    hero(lang),
    marquee(lang),
    thesis(lang),
    services(lang),
    calc(lang),
    method(lang),
    proof(lang),
    industries(lang),
    difference(lang),
    listSection(lang, content.governance, { columns: "three", closing: content.governance.closing }),
    clientContact(lang),
    scaleTeaser(lang),
    `</main>`,
    footer(lang),
  ].join("\n");
}

/* ---------- scale page: the pitch as its own rider ---------- */

function scaleHero(lang) {
  const h = content.scaleHero;
  return `<section class="hero hero-scale" id="top">
  <div class="aurora" aria-hidden="true"><i></i><i></i><i></i></div>
  <div class="wrap">
    <p class="domain"${rv(0)}><b>${esc(content.hero.domain)}</b>${t(h.kicker, lang)}</p>
    <h1 class="t-display split" data-split style="--d:120ms">${t(h.title, lang)}</h1>
    <p class="t-lead"${rv(3)}>${t(h.lead, lang)}</p>
    <div class="hero-actions"${rv(4)}>
      <a class="btn btn-solid" href="#funds" data-magnet>${t(h.primary, lang)} <span class="arrow" aria-hidden="true">&rarr;</span></a>
      <a class="btn btn-ghost" href="#ask" data-magnet>${t(h.secondary, lang)}</a>
    </div>
  </div>
</section>`;
}

function scalePage(lang) {
  const path = scalePath(lang);
  const altPath = scalePath(lang === "de" ? "en" : "de");
  const a = content.ask;
  return [
    head(lang, { title: content.site.scaleTitle[lang], description: content.site.scaleDescription[lang], path, altPath }),
    header(lang, { page: "scale", altHref: altPath }),
    `<main id="main">`,
    scaleHero(lang),
    market(lang),
    numbers(lang),
    listSection(lang, content.value, { alt: true, columns: "three" }),
    timelineSection(lang, content.horizon, {}),
    funds(lang),
    listSection(lang, content.returns, { id: "returns", columns: "three" }),
    `<section id="ask">
  <div class="wrap">
    ${secHead(lang, a, "ask")}
    <ol class="ask-list">
      ${a.items.map((it, i) => `<li${rv(i)}><span>${t(it, lang, `ask[${i}]`)}</span></li>`).join("\n      ")}
    </ol>
    ${contactCard(lang, { title: a.contactTitle, text: a.contactText })}
  </div>
</section>`,
    `</main>`,
    footer(lang, { deck: true }),
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
    header(lang, { page: "legal", altHref: altPath }),
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
    header("de", { page: "legal" }),
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
  write(`${dir}${SCALE[lang]}index.html`, scalePage(lang));
  pages.push(scalePath(lang));
  write(`${dir}impressum/index.html`, legalPage(lang, "imprint"));
  write(`${dir}datenschutz/index.html`, legalPage(lang, "privacy"));
  pages.push(langPath(lang));
}
write("404.html", notFound());
// Eine Seite hinter dem Zugang laedt keine Suchmaschine ein. Sie bekommt ein
// Disallow und keine Sitemap, und jede Seite traegt zusaetzlich noindex, denn
// robots.txt liegt auf GitHub Pages unter einem Unterpfad und wird dort gar
// nicht gelesen.
write(
  "robots.txt",
  GATE
    ? "User-agent: *\nDisallow: /\n"
    : `User-agent: *\nAllow: /\nSitemap: ${abs(`${BASE}/sitemap.xml`)}\n`,
);
if (!GATE) {
  write(
    "sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${pages
      .map(
        (p) =>
          `  <url><loc>${abs(p)}</loc>${LANGS.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${abs(Object.values(SCALE).some((x) => p.endsWith(x)) ? scalePath(l) : langPath(l))}"/>`).join("")}</url>`,
      )
      .join("\n")}\n</urlset>\n`,
  );
}
write(
  "icon.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3ee6ff"/><stop offset=".5" stop-color="#2997ff"/><stop offset="1" stop-color="#8b6cff"/></linearGradient></defs><rect width="64" height="64" rx="16" fill="#050507"/><rect x="6" y="6" width="52" height="52" rx="13" fill="url(#g)"/><text x="32" y="43" text-anchor="middle" font-family="-apple-system,Helvetica,Arial,sans-serif" font-weight="800" font-size="30" fill="#050507">S</text></svg>\n`,
);
writeFileSync(join(dist, ".nojekyll"), "");
mkdirSync(join(dist, "fonts"), { recursive: true });
for (const f of FONT_FILES) copyFileSync(join(FONT_SRC, f), join(dist, "fonts", f));
if (existsSync(join(here, content.site.deckFile))) {
  copyFileSync(join(here, content.site.deckFile), join(dist, content.site.deckFile));
}
console.log(
  `Built ${pages.length} pages into dist/ (base "${BASE || "/"}", url ${URL_ROOT}, ${GATE ? "gated" : "public"})`,
);
