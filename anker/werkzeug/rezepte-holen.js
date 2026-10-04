/*
 * Holt glutenfreie Rezepte aus dem Netz und schreibt anker/rezepte-netz.js.
 *
 *     node werkzeug/rezepte-holen.js
 *
 * Laeuft einmal im Monat in .github/workflows/anker-aktuell.yml, zusammen mit
 * der Forschungsuebersicht. Die App selbst holt nichts (connect-src 'none'):
 * sie laedt die fertige Datei von ihrer eigenen Adresse.
 *
 * WIE
 * Jede Quelle unten ist eine Seite, die glutenfreie Rezepte veroeffentlicht.
 * Gelesen wird ihr RSS-Feed, also genau die Schnittstelle, die eine Seite zum
 * Abholen anbietet. Fuer jeden neuen Beitrag wird die Seite einmal geladen und
 * das maschinenlesbare Rezept darin gelesen (schema.org/Recipe als JSON-LD,
 * dasselbe, was Suchmaschinen lesen). Vorher wird robots.txt der Seite
 * befragt; verbietet sie den Zugriff, bleibt sie aussen vor. Zwischen zwei
 * Anfragen an dieselbe Seite liegen zwei Sekunden.
 *
 * WAS GESPEICHERT WIRD
 * Name, Zutaten, Zeiten, Portionen, Autorin, Quelle und Adresse. Die Zutaten
 * sind Tatsachen, die Zubereitung ist Text der Autorin: sie bleibt auf der
 * Originalseite, die App verlinkt sie. Bilder werden nicht kopiert, sie
 * gehoeren der Seite, und die App laedt nichts von fremden Adressen.
 *
 * GLUTEN
 * Glutenfrei heisst hier dreierlei: die Quelle ist eine glutenfreie Seite oder
 * markiert das Rezept ausdruecklich (suitableForDiet GlutenFreeDiet, Kategorie
 * glutenfrei), keine Zutat steht auf der Sperrliste, und Zutaten, die nur mit
 * dem Zusatz glutenfrei sicher sind (Mehl, Hafer, Brot, Nudeln ...), tragen
 * diesen Zusatz. Fehlt er, kommt das Rezept mit einem sichtbaren Hinweis in die
 * App, welche Zutat zu pruefen ist. Eine Garantie ist das nicht; die App sagt
 * das bei jedem Rezept aus dem Netz.
 */
const fs = require("fs");
const path = require("path");

const wurzel = path.join(__dirname, "..");
const KENNUNG = "AnkerRezepte/1.0 (+https://github.com/apschranz-star/seelischabstrakt)";
const ROBOTS_NAME = "ankerrezepte";

/* Die Quellen. alles: die ganze Seite ist glutenfrei. Sonst muss das Rezept
   eine passende Kategorie im Feed oder das Merkmal GlutenFreeDiet tragen. */
const QUELLEN = [
  { name: "Meaningful Eats", feed: "https://meaningfuleats.com/feed/", sprache: "en", alles: true },
  { name: "Mama Knows Gluten Free", feed: "https://www.mamaknowsglutenfree.com/feed/", sprache: "en", alles: true },
  { name: "Dish by Dish", feed: "https://www.dishbydish.net/feed/", sprache: "en", alles: true },
  { name: "Minimalist Baker", feed: "https://minimalistbaker.com/recipes/gluten-free/feed/", sprache: "en", alles: false },
  { name: "Gluten Free Palate", feed: "https://www.glutenfreepalate.com/feed/", sprache: "en", alles: true },
  { name: "Kochtrotz", feed: "https://www.kochtrotz.de/feed/", sprache: "de", alles: false },
];
const JE_QUELLE = 8;
const KATEGORIE_GF = /gluten[\s-]?free|glutenfrei|sans gluten|senza glutine|sin gluten/i;

const warte = (ms) => new Promise((r) => setTimeout(r, ms));
const letzteAnfrage = {};

async function holen(url, art = "text") {
  const host = new URL(url).host;
  const seit = Date.now() - (letzteAnfrage[host] || 0);
  if (seit < 2000) await warte(2000 - seit);
  letzteAnfrage[host] = Date.now();
  const a = await fetch(url, { headers: { "User-Agent": KENNUNG, Accept: art === "xml" ? "application/rss+xml, application/xml, text/xml" : "text/html" }, redirect: "follow" });
  if (!a.ok) throw new Error(`HTTP ${a.status} fuer ${url}`);
  return a.text();
}

/* ---------------------------------------------------------- robots.txt */

const robotsCache = {};
async function erlaubt(url) {
  const u = new URL(url);
  if (!(u.origin in robotsCache)) {
    let regeln = [];
    try { regeln = robotsLesen(await holen(u.origin + "/robots.txt")); } catch (e) { regeln = []; }
    robotsCache[u.origin] = regeln;
  }
  const pfad = u.pathname + u.search;
  /* Die laengste passende Regel gewinnt, bei Gleichstand Allow. */
  let bester = null;
  for (const r of robotsCache[u.origin]) {
    const re = new RegExp("^" + r.pfad.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\\\$$/, "$"));
    if (r.pfad && re.test(pfad)) {
      if (!bester || r.pfad.length > bester.pfad.length || (r.pfad.length === bester.pfad.length && r.erlaubt)) bester = r;
    }
  }
  return !bester || bester.erlaubt;
}

function robotsLesen(text) {
  const gruppen = [];
  let aktuell = null, inAgents = false;
  for (const roh of text.split(/\r?\n/)) {
    const zeile = roh.replace(/#.*/, "").trim();
    const m = zeile.match(/^([a-z-]+)\s*:\s*(.*)$/i);
    if (!m) continue;
    const feld = m[1].toLowerCase(), wert = m[2].trim();
    if (feld === "user-agent") {
      if (!inAgents) { aktuell = { agents: [], regeln: [] }; gruppen.push(aktuell); }
      aktuell.agents.push(wert.toLowerCase());
      inAgents = true;
    } else if (aktuell && (feld === "allow" || feld === "disallow")) {
      inAgents = false;
      aktuell.regeln.push({ pfad: wert, erlaubt: feld === "allow" });
    } else inAgents = false;
  }
  /* Eine Gruppe nur fuer diesen Abholer zuerst, sonst die fuer alle. */
  const eigen = gruppen.filter((g) => g.agents.some((a) => a !== "*" && ROBOTS_NAME.includes(a)));
  const alle = gruppen.filter((g) => g.agents.includes("*"));
  return (eigen.length ? eigen : alle).flatMap((g) => g.regeln).filter((r) => r.pfad !== "");
}

/* --------------------------------------------------------------- Lesen */

const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", frac12: "½", frac14: "¼", frac34: "¾", deg: "°", ndash: "–", mdash: "—", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", hellip: "…", eacute: "é", egrave: "è", uuml: "ü", ouml: "ö", auml: "ä", szlig: "ß", Uuml: "Ü", Ouml: "Ö", Auml: "Ä" };
function klar(s) {
  return String(s == null ? "" : s)
    .replace(/<\/?span[^>]*>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+\d*);/gi, (g, n) => (n in ENT ? ENT[n] : g))
    .replace(/\s+/g, " ")
    .replace(/\(\s*\(([^()]*)\)\s*\)/g, "($1)")
    .trim();
}

function feedLesen(xml) {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => {
    const it = m[1];
    const feld = (n) => { const x = it.match(new RegExp(`<${n}>([\\s\\S]*?)</${n}>`)); return x ? klar(x[1].replace(/<!\[CDATA\[|\]\]>/g, "")) : ""; };
    const kategorien = [...it.matchAll(/<category>([\s\S]*?)<\/category>/g)].map((k) => klar(k[1].replace(/<!\[CDATA\[|\]\]>/g, "")));
    return { titel: feld("title"), link: feld("link"), datum: feld("pubDate"), kategorien };
  }).filter((i) => /^https:\/\//.test(i.link));
}

function rezeptFinden(html) {
  for (const m of html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    let d;
    try { d = JSON.parse(m[1].trim()); } catch (e) { continue; }
    const stapel = [d];
    while (stapel.length) {
      const x = stapel.pop();
      if (Array.isArray(x)) { stapel.push(...x); continue; }
      if (!x || typeof x !== "object") continue;
      if (x["@graph"]) stapel.push(x["@graph"]);
      const t = [].concat(x["@type"] || []);
      if (t.includes("Recipe")) return x;
    }
  }
  return null;
}

/* PT1H30M -> 90 */
function minuten(iso) {
  const m = String(iso || "").match(/^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?/i);
  if (!m) return null;
  const n = (Number(m[1] || 0) * 24 + Number(m[2] || 0)) * 60 + Number(m[3] || 0);
  return n > 0 ? n : null;
}

function schritteZaehlen(ins) {
  let n = 0;
  const gehe = (x) => {
    if (!x) return;
    if (Array.isArray(x)) return x.forEach(gehe);
    if (typeof x === "string") { n += x.split(/\n+/).filter((s) => s.trim()).length; return; }
    if (x["@type"] === "HowToSection" || x.itemListElement) return gehe(x.itemListElement);
    n += 1;
  };
  gehe(ins);
  return n;
}

/* --------------------------------------------------------------- Gluten */

/* Zutaten, die nie glutenfrei sind. */
const GESPERRT = [
  /\b(wheat|barley|rye|spelt|farro|kamut|bulgur|couscous|semolina|seitan|triticale|einkorn|emmer)\b/i,
  /\bmalt(ed)?\b/i, /\bbrewer'?s yeast\b/i, /\b(beer|ale|lager)\b/i,
  /* Deutsch setzt Woerter zusammen: Hartweizengriess, Vollkorndinkel,
     Gerstenmalz. Deshalb ohne Wortgrenze vorne. */
  /(weizen|dinkel|roggen|gerste|gerstenmalz|malzextrakt|gr(ü|ue)nkern|bulgur|couscous|seitan|einkorn|\bemmer\b|\bbier\b|\bmalz\b)/i,
];
/* Zutaten, die es glutenfrei gibt, aber nur mit diesem Zusatz. */
const NUR_MIT_ZUSATZ = [
  /\b(flour|bread|breadcrumbs?|panko|pasta|noodles?|spaghetti|macaroni|tortillas?|crackers?|oats?|oatmeal|granola|soy sauce|baking powder|cookies?|pretzels?|cereal|graham)\b/i,
  /* Ebenso: Butterkekse, Semmelbroesel, Vollkornnudeln, Haferdrink. */
  /(mehl|brot|br(ö|oe)sel|nudeln|spaghetti|pasta|tortilla|hafer|sojasauce|sojaso(ss|ß)e|backpulver|keks|zwieback|bl(ä|ae)tterteig|m(ü|ue)rbeteig|lasagne|gnocchi|schupfnudel|knödel|knoedel|panier)/i,
];
const ZUSATZ = /gluten[\s-]?free|\bgf\b|glutenfrei|certified|zertifiziert|tamari|rice flour|reismehl|almond flour|mandelmehl|coconut flour|kokosmehl|buckwheat|buchweizen|cassava|maniok|tapioca|tapioka|chickpea flour|kichererbsenmehl|corn ?(flour|starch|meal)|maismehl|maisst(ä|ae)rke|potato starch|kartoffelst(ä|ae)rke|arrowroot|sorghum|millet|hirse|teff|quinoa|amaranth|rice noodles|reisnudeln|rice paper|reispapier|oat[\s-]?free|nut flour|cashew/i;
/* Kokosmilch, Buchweizen und Co. sind keine Getreidefallen. */
const HARMLOS = /buckwheat|buchweizen|coconut|kokos|cream of tartar|weinstein|rice malt|eggplant|johannisbrotkern|guarkern|flohsamen|locust bean|psyllium/i;

/* "Couscous (glutenfrei moeglich)" heisst: normaler Couscous, ausser man
   kauft den anderen. Ein glutenfrei mit so einem Zusatz ist kein Freibrief,
   sondern ein Fall fuer den Hinweis. */
const WEICH = /(gluten[\s-]?free|glutenfrei)\w*\s*(m(ö|oe)glich|as needed|if needed|if necessary|if desired|optional|bei bedarf|nach wahl|wenn n(ö|oe)tig)|(as needed|if needed|if necessary|optional|bei bedarf|nach wahl)\W+(\w+\W+){0,3}(gluten[\s-]?free|glutenfrei)/i;

function glutenPruefen(zutaten) {
  const hinweise = [];
  for (const z of zutaten) {
    if (HARMLOS.test(z) && !/(wheat|weizen)/i.test(z)) continue;
    const gf = /gluten[\s-]?free|glutenfrei/i.test(z);
    const weich = WEICH.test(z);
    if (GESPERRT.some((re) => re.test(z))) {
      if (!gf) return { ok: false, grund: z };
      if (weich) hinweise.push(z);
      continue;
    }
    if (NUR_MIT_ZUSATZ.some((re) => re.test(z)) && (!ZUSATZ.test(z) || weich)) hinweise.push(z);
  }
  return { ok: true, hinweise };
}

/* ------------------------------------------------------------- Merkmale */

const MERKMALE = [
  ["omega3", /salmon|sardine|mackerel|trout|tuna|herring|anchov|lachs|sardin|makrele|forelle|thunfisch|hering|walnut|walnuss|chia|flax|lein/i],
  ["eisen", /lentil|bean|chickpea|spinach|kale|tofu|beef|quinoa|linse|bohne|kichererbse|spinat|grünkohl|rind/i],
  /* Kalzium und Eiweiss nur aus dem, was eine Mahlzeit traegt: ein Ei im
     Kuchen oder ein Schuss Milch macht noch kein eiweissreiches Rezept. */
  ["kalzium", /yogurt|yoghurt|cheese|ricotta|feta|parmesan|cheddar|mozzarella|sardine|tofu|tahini|joghurt|käse|kaese|quark|sardin/i],
  ["eiweiss", /chicken|turkey|beef|pork|fish|salmon|tuna|shrimp|tofu|tempeh|lentil|chickpea|black beans|greek yogurt|cottage|quark|skyr|huhn|hähnchen|haehnchen|pute|rind|fisch|lachs|thunfisch|linse|kichererbse/i],
  ["ballaststoffe", /lentil|bean|chickpea|oat|chia|flax|vegetable|broccoli|linse|bohne|kichererbse|hafer|gemüse|gemuese|brokkoli|vollkorn/i],
];
const FLEISCH = /chicken|beef|pork|bacon|ham|turkey|sausage|fish|salmon|tuna|shrimp|prawn|anchov|gelatin|huhn|hähnchen|haehnchen|rind|schwein|speck|schinken|pute|wurst|fisch|lachs|thunfisch|garnele|gelatine/i;
const MILCH = /milk|butter|cream|cheese|yogurt|yoghurt|ricotta|feta|parmesan|ghee|milch|sahne|käse|kaese|joghurt|quark|schmand|mascarpone/i;
const PFLANZENMILCH = /almond milk|oat milk|coconut milk|soy milk|cashew|dairy[\s-]?free|vegan butter|pflanzen|mandelmilch|hafermilch|kokosmilch|sojamilch|cocoa butter|kakaobutter|peanut butter|almond butter|nut butter|erdnussbutter|mandelmus/i;

function merkmale(zutaten, kategorien) {
  const text = zutaten.join(" \n ");
  const tags = MERKMALE.filter(([, re]) => re.test(text)).map(([t]) => t);
  if (!FLEISCH.test(text)) tags.push("vegetarisch");
  const milch = zutaten.filter((z) => MILCH.test(z) && !PFLANZENMILCH.test(z));
  /* Die Zutaten entscheiden, nicht die Kategorie: "ohne Milchprodukte"
     ueber einem Rezept mit griechischem Joghurt ist schon vorgekommen. */
  void kategorien;
  if (!milch.length) tags.push("ohneMilch");
  if (/olive oil|olivenöl|olivenoel/i.test(text) && /tomato|tomate|zucchini|eggplant|aubergine|pepper|paprika|chickpea|kichererbse|fish|fisch/i.test(text)) tags.push("mediterran");
  return [...new Set(tags)];
}

/* ---------------------------------------------------------------- Lauf */

(async () => {
  const alle = [];
  const bericht = [];
  for (const q of QUELLEN) {
    let n = 0, geprueft = 0, verworfen = 0;
    try {
      if (!(await erlaubt(q.feed))) { bericht.push(`${q.name}: robots.txt verbietet den Feed`); continue; }
      const eintraege = feedLesen(await holen(q.feed, "xml"));
      for (const e of eintraege) {
        if (n >= JE_QUELLE) break;
        if (!q.alles && !e.kategorien.some((k) => KATEGORIE_GF.test(k))) continue;
        if (!(await erlaubt(e.link))) { verworfen++; continue; }
        geprueft++;
        let r;
        try { r = rezeptFinden(await holen(e.link)); } catch (err) { continue; }
        if (!r) continue;
        const zutaten = [].concat(r.recipeIngredient || []).map(klar).filter(Boolean);
        if (zutaten.length < 2) continue;
        const diaet = [].concat(r.suitableForDiet || []).join(" ");
        const markiert = q.alles || /GlutenFreeDiet/i.test(diaet) || e.kategorien.some((k) => KATEGORIE_GF.test(k));
        if (!markiert) continue;
        const g = glutenPruefen(zutaten);
        if (!g.ok) { verworfen++; console.log(`  verworfen (${g.grund}): ${klar(r.name)}`); continue; }
        const url = /^https:\/\//.test(r.url || "") ? r.url : e.link;
        const autor = klar([].concat(r.author || []).map((a) => (typeof a === "string" ? a : a && a.name)).filter(Boolean)[0] || "");
        const gesamt = minuten(r.totalTime) || ((minuten(r.prepTime) || 0) + (minuten(r.cookTime) || 0)) || null;
        const portionen = klar([].concat(r.recipeYield || []).sort((a, b) => String(b).length - String(a).length)[0] || "");
        alle.push({
          id: "netz-" + new URL(url).host.replace(/^www\./, "").replace(/\W+/g, "-") + "-" + new URL(url).pathname.replace(/\W+/g, "-").replace(/^-|-$/g, "").slice(0, 60),
          /* "Kuchen | Rezept fuer die Maschine": der Teil nach dem Strich ist
             Werbetext fuer Suchmaschinen, nicht der Name. */
          name: klar(r.name).split(/\s+\|\s+/)[0].replace(/^[^\p{L}\p{N}]+/u, "").slice(0, 140),
          quelle: q.name,
          url,
          autor,
          sprache: q.sprache,
          minuten: gesamt,
          vorbereitung: minuten(r.prepTime),
          kochen: minuten(r.cookTime),
          portionen: portionen.slice(0, 60),
          zutaten: zutaten.slice(0, 40).map((z) => z.slice(0, 200)),
          schritte: schritteZaehlen(r.recipeInstructions),
          kategorie: klar([].concat(r.recipeCategory || [])[0] || "").slice(0, 40),
          tags: merkmale(zutaten, e.kategorien),
          pruefen: g.hinweise.slice(0, 5),
          datum: (r.datePublished || e.datum ? new Date(r.datePublished || e.datum).toISOString().slice(0, 10) : ""),
        });
        n++;
      }
    } catch (err) {
      bericht.push(`${q.name}: ${err.message}`);
      continue;
    }
    bericht.push(`${q.name}: ${n} Rezepte, ${geprueft} Seiten gelesen, ${verworfen} verworfen`);
  }
  bericht.forEach((b) => console.log(b));

  if (alle.length < 6) {
    console.error(`Nur ${alle.length} Rezepte gefunden. rezepte-netz.js bleibt, wie es ist.`);
    process.exit(1);
  }
  const heute = new Date().toISOString().slice(0, 10);
  const text =
    "/*\n * Glutenfreie Rezepte aus dem Netz, gesammelt von werkzeug/rezepte-holen.js.\n" +
    " * Nicht von Hand aendern, der naechste Lauf ueberschreibt die Datei. Die\n" +
    " * Zubereitung steht auf der jeweiligen Originalseite, hier nur die Zutaten.\n */\n" +
    "window.ANKER_NETZREZEPTE = " + JSON.stringify({ stand: heute, rezepte: alle }, null, 1) + ";\n";
  fs.writeFileSync(path.join(wurzel, "rezepte-netz.js"), text);
  console.log(`rezepte-netz.js geschrieben: ${alle.length} Rezepte, Stand ${heute}.`);
})().catch((e) => { console.error("Abbruch:", e.message); process.exit(1); });
