/*
 * One daily run of the recipe council, shared by the scheduled function and
 * the catch-up path in /api/ricette. Writes three blobs in the site-wide store
 * "sofia-ricette":
 *   libreria  approved and adapted recipes, newest first (max 150)
 *   visti     every post URL already judged, so each post is read once
 *   rapporti  the last 30 run reports, including what was rejected and why
 * No personal data is involved: the recipes are public, Sofia's health data
 * never leaves her phone.
 */
import { creaClient, raccogli, unisci } from "./ricette-web.mjs";

export const STORE = "sofia-ricette";

export async function eseguiGiro(store, { scadenzaMs = 22000, perFonte = 4 } = {}) {
  const inizio = Date.now();
  const visti = new Set(((await store.get("visti", { type: "json" })) || {}).urls || []);
  const libreria = (await store.get("libreria", { type: "json" })) || { ricette: [] };
  const client = creaClient({ scadenza: inizio + scadenzaMs });
  const { risultati, rapporto } = await raccogli({ client, visti, perFonte });
  const oggi = new Date().toISOString().slice(0, 10);
  const nuova = unisci(libreria, risultati, oggi);
  await store.setJSON("libreria", nuova);
  await store.setJSON("visti", { urls: [...visti].slice(-3000) });

  const conta = (e) => risultati.filter((r) => r.esito === e).length;
  const perSeggio = {};
  for (const r of risultati) if (r.esito === "respinta") perSeggio[r.da || "altro"] = (perSeggio[r.da || "altro"] || 0) + 1;
  const giro = {
    data: oggi,
    ora: new Date().toISOString(),
    durata_s: Math.round((Date.now() - inizio) / 100) / 10,
    lette: risultati.length,
    approvate: conta("approvata"),
    adattate: conta("adattata"),
    respinte: conta("respinta"),
    perSeggio,
    fonti: rapporto,
    respinteDettaglio: risultati.filter((r) => r.esito === "respinta").slice(0, 60).map((r) => {
      const v = r.verdetti.find((x) => x.livello === "veto") || {};
      return { titolo: r.titolo, fonte: r.fonte, url: r.url, da: r.da, motivo: (v.motivi || [])[0] || null };
    }),
  };
  const rapporti = (await store.get("rapporti", { type: "json" })) || [];
  rapporti.unshift(giro);
  await store.setJSON("rapporti", rapporti.slice(0, 30));
  return giro;
}
