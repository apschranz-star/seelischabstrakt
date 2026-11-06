/*
 * Daily web recipes for Sofia.
 *
 * Same method as anker/werkzeug/rezepte-holen.js, which already runs in this
 * repository: read the RSS feed a site offers for collection, load each new
 * post once, read the machine-readable recipe in it (schema.org/Recipe as
 * JSON-LD, the same data search engines read), ask robots.txt first, wait two
 * seconds between requests to the same site. Stored: name, ingredient lines,
 * times, servings, author, source and address. The method stays on the
 * original page and the app links to it; images are not copied.
 *
 * Then the council decides (app/js/engine/consiglio.js):
 *   1. Gluten guardian: anker's proven check, every line confirmed.
 *   2. Lupus sentinel and plan keeper: plan foods only, swaps the plan allows,
 *      vetoes for processed meat, frying, alcohol, sweets, foods outside the plan.
 *   3. Kidney sentinel: salt notes.
 * Only approved or adapted recipes reach the app, always with the plan's doses.
 */
import glutenModul from "./glutenpruefung.cjs";
import { valutaRicettaWeb } from "../app/js/engine/consiglio.js";

const { glutenPruefen } = glutenModul;

export const KENNUNG = "SofiaRicette/1.0 (+https://github.com/apschranz-star/seelischabstrakt)";
const ROBOTS_NAME = "sofiaricette";

/* alles: the whole feed is gluten free. Otherwise the post must carry a
   gluten-free category or the recipe must declare GlutenFreeDiet. */
/* Checked on 2026-11-06: each feed answers, robots.txt allows it, and its
   posts carry schema.org/Recipe. Category feeds ("alles: true") contain only
   posts the site itself files under gluten free. */
export const FONTI = [
  { name: "Skinnytaste", feed: "https://www.skinnytaste.com/recipes/gluten-free/feed/", alles: true },
  { name: "Eating Bird Food", feed: "https://www.eatingbirdfood.com/category/diet/gluten-free/feed/", alles: true },
  { name: "Well Plated", feed: "https://www.wellplated.com/category/recipes-by-diet/gluten-free/feed/", alles: true },
  { name: "Cookie and Kate", feed: "https://cookieandkate.com/category/food-recipes/gluten-free/feed/", alles: true },
  { name: "RecipeTin Eats", feed: "https://www.recipetineats.com/category/gluten-free-recipes/feed/", alles: true },
  { name: "Minimalist Baker", feed: "https://minimalistbaker.com/recipes/gluten-free/feed/", alles: true },
  { name: "Mama Knows Gluten Free", feed: "https://www.mamaknowsglutenfree.com/feed/", alles: true },
  { name: "Downshiftology", feed: "https://downshiftology.com/recipes/feed/", alles: false },
  { name: "Cotter Crunch", feed: "https://www.cottercrunch.com/feed/", alles: false },
  { name: "The Mediterranean Dish", feed: "https://www.themediterraneandish.com/feed/", alles: false },
];
const KATEGORIE_GF = /gluten[\s-]?free|glutenfrei|sans gluten|senza glutine|sin gluten/i;

const warte = (ms) => new Promise((r) => setTimeout(r, ms));

export function creaClient({ fetchImpl = fetch, pausa = 2000, scadenza = Infinity } = {}) {
  const ultima = {};
  const robotsCache = {};
  async function prendi(url, tipo = "text") {
    if (Date.now() > scadenza) throw new Error("tempo scaduto");
    const host = new URL(url).host;
    const passati = Date.now() - (ultima[host] || 0);
    if (passati < pausa) await warte(pausa - passati);
    ultima[host] = Date.now();
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    try {
      const r = await fetchImpl(url, { headers: { "User-Agent": KENNUNG, Accept: tipo === "xml" ? "application/rss+xml, application/xml, text/xml" : "text/html" }, redirect: "follow", signal: ctrl.signal });
      if (!r.ok) throw new Error(`HTTP ${r.status} per ${url}`);
      return await r.text();
    } finally {
      clearTimeout(t);
    }
  }
  async function permesso(url) {
    const u = new URL(url);
    if (!(u.origin in robotsCache)) {
      let regole = [];
      try { regole = leggiRobots(await prendi(u.origin + "/robots.txt")); } catch (e) { regole = []; }
      robotsCache[u.origin] = regole;
    }
    return consentito(robotsCache[u.origin], u.pathname + u.search);
  }
  return { prendi, permesso };
}

/* ------------------------------------------------------------ robots.txt */
export function leggiRobots(testo) {
  const gruppi = [];
  let att = null, inAgenti = false;
  for (const grezza of String(testo).split(/\r?\n/)) {
    const riga = grezza.replace(/#.*/, "").trim();
    const m = riga.match(/^([a-z-]+)\s*:\s*(.*)$/i);
    if (!m) continue;
    const campo = m[1].toLowerCase(), valore = m[2].trim();
    if (campo === "user-agent") {
      if (!inAgenti) { att = { agenti: [], regole: [] }; gruppi.push(att); }
      att.agenti.push(valore.toLowerCase());
      inAgenti = true;
    } else if (att && (campo === "allow" || campo === "disallow")) {
      inAgenti = false;
      att.regole.push({ percorso: valore, ok: campo === "allow" });
    } else inAgenti = false;
  }
  const propri = gruppi.filter((g) => g.agenti.some((a) => a !== "*" && ROBOTS_NAME.includes(a)));
  const tutti = gruppi.filter((g) => g.agenti.includes("*"));
  return (propri.length ? propri : tutti).flatMap((g) => g.regole).filter((r) => r.percorso !== "");
}

export function consentito(regole, percorso) {
  /* The longest matching rule wins, Allow on a tie. */
  let migliore = null;
  for (const r of regole) {
    const re = new RegExp("^" + r.percorso.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\\\$$/, "$"));
    if (re.test(percorso) && (!migliore || r.percorso.length > migliore.percorso.length || (r.percorso.length === migliore.percorso.length && r.ok))) migliore = r;
  }
  return !migliore || migliore.ok;
}

/* ------------------------------------------------------------- reading */
const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", frac12: "½", frac14: "¼", frac34: "¾", deg: "°", rsquo: "'", lsquo: "'", rdquo: '"', ldquo: '"', hellip: "...", eacute: "é", egrave: "è" };
export function pulito(s) {
  return String(s == null ? "" : s)
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+\d*);/gi, (g, n) => (n in ENT ? ENT[n] : g))
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

export function leggiFeed(xml) {
  return [...String(xml).matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => {
    const it = m[1];
    const campo = (n) => { const x = it.match(new RegExp(`<${n}>([\\s\\S]*?)</${n}>`)); return x ? pulito(x[1].replace(/<!\[CDATA\[|\]\]>/g, "")) : ""; };
    const categorie = [...it.matchAll(/<category>([\s\S]*?)<\/category>/g)].map((k) => pulito(k[1].replace(/<!\[CDATA\[|\]\]>/g, "")));
    return { titolo: campo("title"), link: campo("link"), data: campo("pubDate"), categorie };
  }).filter((i) => /^https:\/\//.test(i.link));
}

export function trovaRicetta(html) {
  for (const m of String(html).matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    let d;
    try { d = JSON.parse(m[1].trim()); } catch (e) { continue; }
    const pila = [d];
    while (pila.length) {
      const x = pila.pop();
      if (Array.isArray(x)) { pila.push(...x); continue; }
      if (!x || typeof x !== "object") continue;
      if (x["@graph"]) pila.push(x["@graph"]);
      if ([].concat(x["@type"] || []).includes("Recipe")) return x;
    }
  }
  return null;
}

export function minuti(iso) {
  const m = String(iso || "").match(/^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?/i);
  if (!m) return null;
  const n = (Number(m[1] || 0) * 24 + Number(m[2] || 0)) * 60 + Number(m[3] || 0);
  return n > 0 ? n : null;
}

/*
 * Anker's check confirms a line only when every word is a known food or a
 * known description. Lines like "2 tablespoons extra virgin olive oil (plus
 * more to serve)" fail on "serve". A line that has already passed every
 * gluten pattern (blocked, needs-label, packaged, alternative, weak wording)
 * and whose only unknown words are on this list of plain descriptions is
 * confirmed here. No food word, no "optional", "or regular", "flour" or
 * "gluten" may ever be added to this list: test/glutine.test.mjs guards it.
 */
export const DESCRITTORI = new Set(("plus more serve serving servings drizzling drizzle garnish garnishing after slicing about approximately approx divided " +
  "use used such as like if you your prefer preferred see note notes below above recipe works well good quality brand store bought homemade " +
  "fresh freshly coarse coarsely finely granny smith honeycrisp fuji gala extra virgin cold pressed medium large small jumbo thin thick bite " +
  "sized inch inches cm mm pieces piece chunks florets stems leaves sprigs bunch head heads stalks ribs bulb wedges rounds strips cubes halves " +
  "whole packed loosely lightly heaping scant level total each per person patted dry pat at room temperature softened cooled warm hot boiling " +
  "chilled thawed rinsed reserved zested juiced seeded cored pitted deseeded stemmed trimmed ends removed skin bone tails shells deveined " +
  "peeled unpeeled spiralized julienned shaved torn crumbled mashed smashed toasted roasted grilled steamed blanched cooked uncooked leftover " +
  "lengthwise crosswise diagonally thinly roughly evenly halved quartered sliced diced chopped minced grated shredded cubed and the of in on " +
  "into for to a an with from cut about container pack package packages tub jar bag bottle can cans " +
  /* plain wording and varieties of foods the check already knows (potatoes, apples, tomatoes, cucumbers, onions, squash) */
  "scrubbed clean additional addition russet yukon gold kabocha roma heirloom english persian vidalia idaho cremini campari bosc anjou " +
  "bartlett pink lady sprinkle top tops topping spicier milder leave some remove removed scoop scooped leveled spooned nonstick sturdy " +
  "high low heat sheet pan tray batch batches recommended picked debris beluga french squares").split(/\s+/));

export function glutenSofia(righe) {
  const conferma = (riga) => {
    const r = glutenPruefen([riga]);
    if (r.ok) return { ok: true, packung: r.packung || [] };
    const m = String(r.grund || "").match(/^nicht bestaetigt: (.+)$/);
    if (m && m[1] !== "keine bekannte Zutat" && m[1].split(/\s+/).every((w) => DESCRITTORI.has(w))) return { ok: true, packung: [] };
    return { ok: false, grund: r.grund, zeile: r.zeile };
  };
  const packung = [];
  for (const riga of righe) {
    const r = conferma(riga);
    if (!r.ok) return r;
    packung.push(...r.packung);
  }
  return { ok: true, packung };
}

/* Turn one JSON-LD recipe into the stored record and the council's verdict. */
export function giudica(r, { fonte, link, categorie = [] }) {
  const ingredienti = [].concat(r.recipeIngredient || []).map(pulito).filter(Boolean).slice(0, 40).map((z) => z.slice(0, 200));
  const gluten = glutenSofia(ingredienti);
  const titolo = pulito(r.name).split(/\s+\|\s+/)[0].slice(0, 140);
  const categoria = pulito([].concat(r.recipeCategory || [])[0] || "").slice(0, 40);
  const verdetto = valutaRicettaWeb({ ingredienti, titolo, categoria, gluten });
  const url = /^https:\/\//.test(r.url || "") ? r.url : link;
  const autore = pulito([].concat(r.author || []).map((a) => (typeof a === "string" ? a : a && a.name)).filter(Boolean)[0] || "");
  return {
    id: "web-" + new URL(url).host.replace(/^www\./, "").replace(/\W+/g, "-") + "-" + new URL(url).pathname.replace(/\W+/g, "-").replace(/^-|-$/g, "").slice(0, 60),
    titolo,
    fonte,
    url,
    autore,
    minuti: minuti(r.totalTime) || ((minuti(r.prepTime) || 0) + (minuti(r.cookTime) || 0)) || null,
    categoria,
    ingredienti,
    esito: verdetto.esito,
    da: verdetto.da || null,
    pasto: verdetto.pasto,
    dosi: verdetto.dosi,
    adattamenti: verdetto.adattamenti.map(({ riga, it, en }) => ({ riga, it, en })),
    verdetti: verdetto.verdetti,
    packung: gluten.ok ? (gluten.packung || []).slice(0, 12) : [],
    categorie: categorie.slice(0, 8),
  };
}

/*
 * One run. visti: URLs already judged (approved or not), so each post is read
 * once. perFonte: how many new posts to read per source in this run.
 */
export async function raccogli({ client, visti = new Set(), perFonte = 4, fonti = FONTI, log = () => {} }) {
  const risultati = [];
  const rapporto = [];
  await Promise.all(fonti.map(async (q) => {
    let letti = 0;
    const r = { fonte: q.name, letti: 0, approvate: 0, adattate: 0, respinte: 0, errore: null, motivi: {} };
    try {
      if (!(await client.permesso(q.feed))) { r.errore = "robots.txt"; rapporto.push(r); return; }
      const voci = leggiFeed(await client.prendi(q.feed, "xml"));
      for (const v of voci) {
        if (letti >= perFonte) break;
        if (visti.has(v.link)) continue;
        if (!q.alles && !v.categorie.some((k) => KATEGORIE_GF.test(k))) {
          /* Not marked gluten free in the feed: the recipe itself may still declare it. Read it only if the title is not obviously a sweet. */
          if (/cake|cookie|brownie|muffin|bread|pie|cocktail|pancake|waffle|donut|cupcake|bars?\b|fudge|candy/i.test(v.titolo)) continue;
        }
        if (!(await client.permesso(v.link))) { visti.add(v.link); continue; }
        letti++;
        visti.add(v.link);
        let ric;
        try { ric = trovaRicetta(await client.prendi(v.link)); } catch (e) { continue; }
        if (!ric) continue;
        const dieta = [].concat(ric.suitableForDiet || []).join(" ");
        const marcata = q.alles || /GlutenFreeDiet/i.test(dieta) || v.categorie.some((k) => KATEGORIE_GF.test(k));
        if (!marcata) { r.respinte++; r.motivi.non_marcata = (r.motivi.non_marcata || 0) + 1; continue; }
        const g = giudica(ric, { fonte: q.name, link: v.link, categorie: v.categorie });
        g.data = ric.datePublished || v.data ? new Date(ric.datePublished || v.data).toISOString().slice(0, 10) : null;
        if (g.esito === "approvata") r.approvate++;
        else if (g.esito === "adattata") r.adattate++;
        else { r.respinte++; r.motivi[g.da || "altro"] = (r.motivi[g.da || "altro"] || 0) + 1; }
        risultati.push(g);
        log(`${q.name}: ${g.esito} ${g.titolo}`);
      }
    } catch (e) {
      r.errore = e.message;
    }
    r.letti = letti;
    rapporto.push(r);
  }));
  return { risultati, rapporto };
}

/* Merge today's results into the library: newest first, approved and adapted only. */
export function unisci(libreria, nuove, oggi, max = 150) {
  const buone = nuove.filter((x) => x.esito === "approvata" || x.esito === "adattata").map((x) => ({ ...x, aggiunta: oggi }));
  const perId = new Map();
  for (const x of [...buone, ...(libreria.ricette || [])]) if (!perId.has(x.id)) perId.set(x.id, x);
  return { aggiornato: oggi, ricette: [...perId.values()].slice(0, max) };
}
