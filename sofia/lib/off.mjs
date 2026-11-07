/*
 * Open Food Facts lookup for the food brain (server side, Netlify function).
 *
 * Only the food name typed by Sofia leaves the app, and only to this
 * function: the function asks Open Food Facts (open database, ODbL licence,
 * https://world.openfoodfacts.org) and returns the packages it finds with
 * their values per 100 g, allergens, traces and labels. Nothing about her is
 * sent or stored. Values are crowd-sourced: the app always says to check the
 * label.
 */
export const OFF_SEARCH = "https://search.openfoodfacts.org/search";
export const UA = "SofiaPiano/1.0 (+https://sofia-piano.netlify.app)";
const CAMPI = ["code", "product_name", "product_name_it", "product_name_en", "generic_name_it", "brands", "quantity", "nutriments", "allergens_tags", "traces_tags", "labels_tags", "categories_tags", "countries_tags", "ingredients_text_it", "ingredients_text"];

export function query(q) {
  return String(q || "").normalize("NFC").replace(/[^\p{L}\p{N}' %-]+/gu, " ").replace(/\s+/g, " ").trim().slice(0, 60);
}

const n = (x) => (x == null || x === "" || Number.isNaN(Number(x)) ? null : Math.round(Number(x) * 1000) / 1000);
const testo = (x) => String(x == null ? "" : x).replace(/\s+/g, " ").trim();

export function normalizza(hit) {
  const nu = hit.nutriments || {};
  const kcal = n(nu["energy-kcal_100g"]) ?? (nu["energy_100g"] != null ? n(nu["energy_100g"] / 4.184) : null);
  const salt = n(nu.salt_100g) ?? (nu.sodium_100g != null ? n(nu.sodium_100g * 2.5) : null);
  const nome = testo(hit.product_name_it || hit.product_name || hit.product_name_en || hit.generic_name_it);
  return {
    fonte: "off",
    codice: testo(hit.code).replace(/\D/g, "").slice(0, 20),
    nome: nome.slice(0, 120),
    marca: testo([].concat(hit.brands || [])[0] || "").slice(0, 60),
    quantita: testo(hit.quantity).slice(0, 30),
    per100: { kcal, prot: n(nu.proteins_100g), carb: n(nu.carbohydrates_100g), fat: n(nu.fat_100g), sug: n(nu.sugars_100g), fib: n(nu.fiber_100g), sat: n(nu["saturated-fat_100g"]), salt },
    allergeni: [].concat(hit.allergens_tags || []).slice(0, 20).map(String),
    tracce: [].concat(hit.traces_tags || []).slice(0, 20).map(String),
    etichette: [].concat(hit.labels_tags || []).filter((t) => /gluten|glutine|organic|bio/i.test(t)).slice(0, 10).map(String),
    categorie: [].concat(hit.categories_tags || []).slice(0, 15).map(String),
    ingredienti: testo(hit.ingredients_text_it || hit.ingredients_text).slice(0, 600),
    italia: [].concat(hit.countries_tags || []).includes("en:italy"),
  };
}

/* Usable results: a name and an energy value; Italian packages first; one per name and brand. */
export function filtra(hits) {
  const visti = new Set();
  const out = [];
  for (const h of hits || []) {
    const r = normalizza(h);
    if (!r.nome || r.per100.kcal == null || !r.codice) continue;
    const k = (r.nome + "|" + r.marca).toLowerCase();
    if (visti.has(k)) continue;
    visti.add(k);
    out.push(r);
  }
  return out.sort((a, b) => Number(b.italia) - Number(a.italia)).slice(0, 10);
}

export async function cercaOFF(q, { fetchImpl = fetch, timeoutMs = 7000 } = {}) {
  const qq = query(q);
  if (qq.length < 2) return [];
  const url = `${OFF_SEARCH}?q=${encodeURIComponent(qq)}&langs=it,en&page_size=24&fields=${CAMPI.join(",")}`;
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const r = await fetchImpl(url, { headers: { "User-Agent": UA, Accept: "application/json" }, signal: ctl.signal });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const dati = await r.json();
    return filtra(dati.hits || dati.products || []);
  } finally {
    clearTimeout(t);
  }
}

/* Cache of the food lookup (Netlify Blobs store "sofia-alimenti"): an answer is reused for 7 days, then deleted. */
export const CACHE_STORE = "sofia-alimenti";
export const SETTE_GIORNI = 7 * 24 * 3600 * 1000;

/* Deletes every cached answer older than maxEta (or without a readable time). Returns how many went. */
export async function ripulisciCache(store, { ora = Date.now(), maxEta = SETTE_GIORNI } = {}) {
  const { blobs = [] } = await store.list();
  let tolti = 0;
  for (const { key } of blobs) {
    let c = null;
    try { c = await store.get(key, { type: "json" }); } catch (e) { c = null; }
    const quando = c && Date.parse(c.quando);
    if (!quando || ora - quando >= maxEta) { await store.delete(key); tolti++; }
  }
  return tolti;
}
