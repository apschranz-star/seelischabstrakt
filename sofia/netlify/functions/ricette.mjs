/*
 * GET /api/ricette: the council's library of web recipes and the last report.
 *
 * Catch-up: if no run happened in the last 25 hours (first deploy, or the
 * schedule was skipped), this request starts one after answering, through
 * context.waitUntil. A short lock blob keeps two visitors from starting two
 * runs. The answer itself never waits for the run.
 */
import { getStore } from "@netlify/blobs";
import { eseguiGiro, STORE } from "../../lib/giro.mjs";

const ORE_25 = 25 * 3600 * 1000;
const LOCK_MS = 5 * 60 * 1000;

export default async (req, context) => {
  const store = getStore(STORE);
  const [libreria, rapporti] = await Promise.all([
    store.get("libreria", { type: "json" }),
    store.get("rapporti", { type: "json" }),
  ]);
  const ultimo = (rapporti || [])[0] || null;
  const vecchio = !ultimo || Date.now() - Date.parse(ultimo.ora) > ORE_25;
  let avviato = false;
  if (vecchio) {
    const lock = await store.get("lock", { type: "json" });
    if (!lock || Date.now() - lock.t > LOCK_MS) {
      await store.setJSON("lock", { t: Date.now() });
      avviato = true;
      const lavoro = eseguiGiro(store, { scadenzaMs: 40000, perFonte: 5 })
        .catch((e) => console.error("giro fallito:", e.message))
        .finally(() => store.delete("lock"));
      if (context && typeof context.waitUntil === "function") context.waitUntil(lavoro);
      else await lavoro;
    }
  }
  return Response.json(
    { libreria: libreria || { aggiornato: null, ricette: [] }, ultimo, aggiornamentoAvviato: avviato },
    { headers: { "Cache-Control": "no-store" } },
  );
};

export const config = {
  path: "/api/ricette",
  method: "GET",
};
