/*
 * GET /api/alimento?q=<food name>
 * The food brain's live lookup: packages from Open Food Facts with values
 * per 100 g, allergens, traces and gluten-free labels. Only the food name
 * arrives here. The answer is reused for 7 days (Netlify Blobs) so the same
 * search does not go to Open Food Facts twice; the daily run deletes older
 * answers (ripulisciCache). Nothing is logged.
 */
import { getStore } from "@netlify/blobs";
import { cercaOFF, query, CACHE_STORE, SETTE_GIORNI } from "../../lib/off.mjs";

const json = (dati, stato = 200) => new Response(JSON.stringify(dati), { status: stato, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });

export default async (req) => {
  const q = query(new URL(req.url).searchParams.get("q"));
  if (q.length < 2) return json({ errore: "query", risultati: [] }, 400);
  const chiave = q.toLowerCase();
  let store = null;
  try { store = getStore(CACHE_STORE); } catch (e) { store = null; }
  if (store) {
    try {
      const c = await store.get(chiave, { type: "json" });
      if (c && Date.now() - Date.parse(c.quando) < SETTE_GIORNI) return json({ ...c, cache: true });
    } catch (e) { /* cache miss */ }
  }
  try {
    const risultati = await cercaOFF(q);
    const dati = { q, fonte: "Open Food Facts", licenza: "ODbL 1.0", url: "https://world.openfoodfacts.org", quando: new Date().toISOString(), risultati };
    if (store) { try { await store.setJSON(chiave, dati); } catch (e) { /* not fatal */ } }
    return json(dati);
  } catch (e) {
    return json({ q, errore: "non raggiungibile", risultati: [] }, 502);
  }
};

export const config = { path: "/api/alimento", method: "GET" };
